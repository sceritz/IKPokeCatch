/**
 * useDiscordSDK
 *
 * Initialises the Discord Embedded App SDK, performs the OAuth2 flow
 * (code → access_token via the /api/token proxy), and fetches the
 * current user's identity from the Discord REST API.
 *
 * Returns:
 *   { sdk, user, loading, error }
 *
 *   sdk     — the DiscordSDK instance (for channel/guild info)
 *   user    — { id, username, discriminator, avatar } or null
 *   loading — true while initialising
 *   error   — Error object or null
 */

import { useEffect, useState } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

let _sdkInstance = null; // singleton — only instantiate once

export function useDiscordSDK() {
  const [sdk,     setSdk]     = useState(null);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // ── 1. Create SDK instance ──────────────────────────────────────────
        if (!_sdkInstance) {
          const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
          if (!clientId) {
            throw new Error(
              'VITE_DISCORD_CLIENT_ID is not set. Copy .env.example → .env and fill in your values.'
            );
          }
          _sdkInstance = new DiscordSDK(clientId);
        }

        const discordSdk = _sdkInstance;
        await discordSdk.ready();

        // ── 2. Authorise (get OAuth2 code) ──────────────────────────────────
        const { code } = await discordSdk.commands.authorize({
          client_id:     import.meta.env.VITE_DISCORD_CLIENT_ID,
          response_type: 'code',
          state:         '',
          prompt:        'none',
          scope:         ['identify'],
        });

        // ── 3. Exchange code for access_token (server-side) ─────────────────
        // Server also fetches user identity to avoid CORS issues inside Discord Activity
        const tokenRes = await fetch('/api/token', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ code }),
        });

        if (!tokenRes.ok) {
          const text = await tokenRes.text();
          throw new Error(`Token exchange failed: ${text}`);
        }

        const { access_token, user: tokenUser } = await tokenRes.json();

        // ── 4. Authenticate the SDK with the token ──────────────────────────
        await discordSdk.commands.authenticate({ access_token });

        // ── 5. Use user identity returned from the token exchange ────────────
        if (!tokenUser) throw new Error('No user data returned from token exchange');

        if (!cancelled) {
          setSdk(discordSdk);
          setUser({
            id:            tokenUser.id,
            username:      tokenUser.username,
            discriminator: tokenUser.discriminator,
            avatar:        tokenUser.avatar
              ? `https://cdn.discordapp.com/avatars/${tokenUser.id}/${tokenUser.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(tokenUser.discriminator || '0') % 5}.png`,
          });
        }
      } catch (err) {
        _sdkInstance = null; // reset so next mount can retry with a fresh instance
        if (!cancelled) {
          console.error('Discord SDK init error:', err.message, err.stack);
          setError(err);

          // Provide a guest fallback so the game is still playable in dev
          setUser({ id: 'dev', username: 'Trainer', discriminator: '0000', avatar: null });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { sdk, user, loading, error };
}
