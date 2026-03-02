/**
 * Minimal Express server for IK PokéCatch Discord Activity.
 *
 * Responsibilities:
 *  1. OAuth2 token exchange  — Discord requires a server-side code→token swap
 *     so that the client secret is never exposed to the browser.
 *  2. Webhook proxy          — accepts structured game-data from the client,
 *     constructs the Discord embed server-side, and forwards it.
 *     The client never controls the raw payload sent to Discord.
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Trust proxy ────────────────────────────────────────────────────────────────
// Required so req.ip resolves the real client IP when behind a reverse proxy,
// load balancer, or CDN (Railway, Fly.io, nginx, Cloudflare, etc.).
app.set('trust proxy', 1);

// ── CORS ───────────────────────────────────────────────────────────────────────
// Restrict to known origins only. Set ALLOWED_ORIGINS in your environment as a
// comma-separated list for production (e.g. "https://yourapp.discordactivities.com").
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

// Wildcard suffix patterns — any subdomain of these domains is permitted.
// Covers Cloudflare tunnel URLs (*.trycloudflare.com) so the tunnel URL
// never needs to be hardcoded; the Vite proxy passes Origin through unchanged.
const ALLOWED_ORIGIN_SUFFIXES = ['.trycloudflare.com', '.discordsays.com'];

function isOriginAllowed(origin) {
  console.log('[cors] origin received:', JSON.stringify(origin));
  if (!origin) return true; // same-origin / non-browser requests have no Origin header
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (ALLOWED_ORIGIN_SUFFIXES.some((suffix) => origin.endsWith(suffix))) return true;
  // Allow any localhost port in development
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  } catch (e) {
    console.log('[cors] URL parse failed:', e.message);
  }
  console.log('[cors] REJECTED origin:', JSON.stringify(origin));
  return false;
}

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

// ── Rate limiting ──────────────────────────────────────────────────────────────
// Simple in-memory sliding-window limiter. No external dependency needed.
const _rateLimitStore = new Map();
const RATE_WINDOW_MS  = 60_000;

function rateLimit(windowMs, max) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const timestamps = (_rateLimitStore.get(key) ?? []).filter(t => t > windowStart);

    if (timestamps.length >= max) {
      return res.status(429).json({ error: 'Too many requests — please try again later.' });
    }

    timestamps.push(now);
    _rateLimitStore.set(key, timestamps);
    next();
  };
}

// Periodically evict expired entries to prevent unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of _rateLimitStore) {
    const fresh = timestamps.filter(t => t > now - RATE_WINDOW_MS);
    if (fresh.length === 0) {
      _rateLimitStore.delete(key);
    } else {
      _rateLimitStore.set(key, fresh);
    }
  }
}, RATE_WINDOW_MS).unref(); // .unref() so the timer doesn't keep the process alive

// ── OAuth Token Exchange ───────────────────────────────────────────────────────
// Discord Activity SDK gives the client an auth code.
// We exchange it here for an access token using the client secret.
app.post('/api/token', rateLimit(60_000, 10), async (req, res) => {
  console.log('TOKEN REQUEST RECEIVED');
  const { code } = req.body;
  console.log(`[token] Exchange request received, code present: ${!!code}`);

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Token exchange failed — HTTP ${response.status}:`, JSON.stringify(data));
      // Return a generic error — never forward raw Discord error details to the client.
      return res.status(401).json({ error: 'Token exchange failed' });
    }

    // Fetch user identity server-side — avoids CORS/iframe issues in Discord Activities
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const userData = userRes.ok ? await userRes.json() : null;
    console.log(`[token] User fetch status: ${userRes.status}, username: ${userData?.username ?? 'null'}`);

    res.json({
      access_token: data.access_token,
      user: userData ? {
        id:            userData.id,
        username:      userData.username,
        discriminator: userData.discriminator,
        avatar:        userData.avatar,
      } : null,
    });
  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Webhook Proxy ─────────────────────────────────────────────────────────────
// The client sends structured game-data. This server constructs the Discord
// embed itself — the client never controls what is posted to the channel.

const RARITY_LABELS = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  very_rare: 'Very Rare',
  legendary: 'Legendary',
};

const STAGE_LABELS = {
  0: 'Base Form',
  1: '1st Evolution',
  2: '2nd Evolution',
};

const RARITY_COLORS = {
  common:    0x9e9e9e,
  uncommon:  0x66bb6a,
  rare:      0x42a5f5,
  very_rare: 0xab47bc,
  legendary: 0xffa726,
};

// Sprite URLs from PokéAPI are hosted exclusively on raw.githubusercontent.com.
const ALLOWED_SPRITE_HOSTS = new Set(['raw.githubusercontent.com', 'assets.pokemon.com']);

// Strip Discord mention patterns that could ping real users or roles.
const MENTION_RE = /@(everyone|here|[&!]?\d+)/g;
function sanitize(str, maxLen = 256) {
  if (typeof str !== 'string') return '';
  return str.replace(MENTION_RE, '[mention removed]').slice(0, maxLen);
}

app.post('/api/webhook', rateLimit(60_000, 30), async (req, res) => {
  console.log('WEBHOOK REQUEST RECEIVED');
  console.log('[webhook] Request body:', JSON.stringify(req.body));

  const webhookUrl = process.env.VITE_DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('[webhook] VITE_DISCORD_WEBHOOK_URL is not set');
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  // ── Validate incoming game-data fields ──────────────────────────────────────
  const { username, pokemonName, rarity, stage, health, ballName, success, chance, spriteUrl } = req.body;

  if (
    typeof username    !== 'string' ||
    typeof pokemonName !== 'string' ||
    typeof rarity      !== 'string' ||
    typeof health      !== 'string' ||
    typeof ballName    !== 'string' ||
    typeof success     !== 'boolean' ||
    typeof chance      !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  if (!RARITY_LABELS[rarity]) {
    return res.status(400).json({ error: 'Invalid rarity' });
  }

  if (chance < 0 || chance > 1 || !isFinite(chance)) {
    return res.status(400).json({ error: 'Invalid chance value' });
  }

  // ── Validate sprite URL against allowlist ───────────────────────────────────
  let safeSpriteUrl = null;
  if (typeof spriteUrl === 'string' && spriteUrl.length > 0) {
    try {
      const parsed = new URL(spriteUrl);
      if ((parsed.protocol === 'https:') && ALLOWED_SPRITE_HOSTS.has(parsed.hostname)) {
        safeSpriteUrl = spriteUrl;
      }
    } catch {
      // Invalid URL — ignore the thumbnail
    }
  }

  // ── Build the Discord embed server-side ─────────────────────────────────────
  const safeUsername    = sanitize(username, 80);
  const safePokemonName = sanitize(pokemonName, 80);
  const safeHealth      = sanitize(health, 80);
  const safeBallName    = sanitize(ballName, 80);
  const stageLabel      = STAGE_LABELS[stage] ?? `Stage ${Number(stage)}`;

  const color = success
    ? 0x66bb6a  // green for caught
    : (RARITY_COLORS[rarity] ?? 0xef5350);

  const embed = {
    title:       `IK PokéCatch — ${success ? 'Caught!' : 'Escaped!'}`,
    description: success
      ? `✅ **${safeUsername}** caught **${safePokemonName}**!`
      : `❌ **${safePokemonName}** broke free! Better luck next time, **${safeUsername}**.`,
    color,
    fields: [
      { name: 'Pokémon',      value: safePokemonName,          inline: true },
      { name: 'Rarity',       value: RARITY_LABELS[rarity],    inline: true },
      { name: 'Evolution',    value: stageLabel,               inline: true },
      { name: 'Health',       value: safeHealth,               inline: true },
      { name: 'Ball Used',    value: safeBallName,             inline: true },
      { name: 'Catch Chance', value: `${(chance * 100).toFixed(1)}%`, inline: true },
    ],
    footer:    { text: 'IK PokéCatch Discord Activity' },
    timestamp: new Date().toISOString(),
  };

  if (safeSpriteUrl) {
    embed.thumbnail = { url: safeSpriteUrl };
  }

  console.log(`[webhook] Posting to Discord for ${safeUsername} — ${safePokemonName} (${success ? 'caught' : 'missed'})`);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[webhook] Discord rejected the request — HTTP ${response.status}:`, text);
      return res.status(response.status).json({ error: text });
    }

    console.log(`[webhook] Posted successfully — HTTP ${response.status}`);
    res.set('Cache-Control', 'no-store').status(204).end();
  } catch (err) {
    console.error('[webhook] Proxy error:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`IK PokéCatch server running on http://localhost:${PORT}`);
  console.log(`[config] Webhook URL loaded: ${process.env.VITE_DISCORD_WEBHOOK_URL ? 'YES' : 'NO — check .env file!'}`);
});
