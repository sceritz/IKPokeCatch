/**
 * Discord Webhook Integration
 *
 * Sends structured game-data to the /api/webhook proxy on the Express backend.
 * The server constructs the actual Discord embed — the client never controls
 * the raw payload that is delivered to the Discord channel.
 */

/**
 * Post a catch attempt result to the Discord channel via the server proxy.
 *
 * @param {object} params
 * @param {string}  params.username      - Discord display name
 * @param {string}  params.pokemonName   - Pokémon name (capitalised)
 * @param {string}  params.rarity        - Rarity key (e.g. 'rare')
 * @param {number}  params.stage         - Evolution stage (0 | 1 | 2)
 * @param {string}  params.health        - Health state string
 * @param {string}  params.ballName      - Ball display name
 * @param {boolean} params.success       - Whether the catch succeeded
 * @param {number}  params.chance        - Catch probability (0–1)
 * @param {string}  [params.spriteUrl]   - Optional Pokémon sprite URL
 */
export async function postCatchResult({
  username,
  pokemonName,
  rarity,
  stage,
  health,
  ballName,
  success,
  chance,
  spriteUrl,
}) {
  // Convert Discord's /sprites proxy prefix back to the absolute GitHub URL
  // so the webhook embed thumbnail works outside of Discord's iframe context.
  const absoluteSpriteUrl = spriteUrl?.startsWith('/sprites/')
    ? spriteUrl.replace('/sprites/', 'https://raw.githubusercontent.com/')
    : (spriteUrl ?? null);

  try {
    const res = await fetch('/api/webhook', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        username,
        pokemonName,
        rarity,
        stage,
        health,
        ballName,
        success,
        chance,
        spriteUrl: absoluteSpriteUrl,
      }),
    });

    if (!res.ok && res.status !== 204) {
      const text = await res.text();
      console.warn('Webhook post failed:', res.status, text);
    }
  } catch (err) {
    // Webhook failure is non-fatal — the user already saw the result in-app
    console.warn('Webhook error (non-fatal):', err);
  }
}
