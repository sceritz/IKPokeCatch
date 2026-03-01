/**
 * Capture System
 *
 * Defines the four Poké Balls and computes catch probability.
 *
 * Formula:
 *   catchChance = baseRate × ballMultiplier × healthMultiplier
 *   (clamped to [0, 1])
 *
 * Master Ball is always a guaranteed catch (returns true immediately).
 */

import { BASE_CATCH_RATES } from '../data/pokemonRarity.js';
import { HEALTH_MULTIPLIERS } from './encounterSystem.js';

// When running inside Discord, rewrite raw.githubusercontent.com URLs through
// the /sprites URL mapping configured in the Discord Developer Portal.
const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const spriteUrl = (path) => IS_LOCALHOST
  ? `https://raw.githubusercontent.com${path}`
  : `/sprites${path}`;

// ─── Ball definitions ─────────────────────────────────────────────────────────
export const BALLS = [
  {
    id:         'poke',
    name:       'Poké Ball',
    multiplier: 1.0,
    guaranteed: false,
    color:      '#e53935',
    sprite:     spriteUrl('/PokeAPI/sprites/master/sprites/items/poke-ball.png'),
  },
  {
    id:         'great',
    name:       'Great Ball',
    multiplier: 1.5,
    guaranteed: false,
    color:      '#1e88e5',
    sprite:     spriteUrl('/PokeAPI/sprites/master/sprites/items/great-ball.png'),
  },
  {
    id:         'ultra',
    name:       'Ultra Ball',
    multiplier: 2.0,
    guaranteed: false,
    color:      '#f9a825',
    sprite:     spriteUrl('/PokeAPI/sprites/master/sprites/items/ultra-ball.png'),
  },
  {
    id:         'master',
    name:       'Master Ball',
    multiplier: Infinity,
    guaranteed: true,
    color:      '#8e24aa',
    sprite:     spriteUrl('/PokeAPI/sprites/master/sprites/items/master-ball.png'),
  },
];

export const getBallById = (id) => BALLS.find((b) => b.id === id);

// ─── Catch calculation ────────────────────────────────────────────────────────
/**
 * @param {object} params
 * @param {string} params.rarity   - Pokémon rarity tier
 * @param {string} params.health   - Current health state
 * @param {string} params.ballId   - Which ball was thrown
 * @returns {{ success: boolean, chance: number, ball: object }}
 */
export function attemptCatch({ rarity, health, ballId }) {
  const ball = getBallById(ballId);

  if (!ball) throw new Error(`Unknown ball id: ${ballId}`);

  if (ball.guaranteed) {
    return { success: true, chance: 1.0, ball };
  }

  const baseRate        = BASE_CATCH_RATES[rarity]    ?? 0.10;
  const healthMult      = HEALTH_MULTIPLIERS[health]  ?? 1.0;
  const chance          = Math.min(1.0, baseRate * ball.multiplier * healthMult);
  const success         = Math.random() < chance;

  return { success, chance, ball };
}
