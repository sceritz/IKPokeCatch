/**
 * Encounter System
 *
 * Handles selecting a random Pokémon from the weighted pool and
 * assigning it a random health state at spawn time.
 */

import { POKEMON_POOL } from '../data/pokemonRarity.js';

// ─── Health states ────────────────────────────────────────────────────────────
export const HEALTH_STATES = {
  HEALTHY:          'Healthy',
  DAMAGED:          'Damaged',
  HEAVILY_DAMAGED:  'Heavily Damaged',
};

export const HEALTH_MULTIPLIERS = {
  [HEALTH_STATES.HEALTHY]:         1.0,
  [HEALTH_STATES.DAMAGED]:         1.5,
  [HEALTH_STATES.HEAVILY_DAMAGED]: 2.0,
};

// Spawn probability for each health state (must sum to 1)
const HEALTH_SPAWN_WEIGHTS = {
  [HEALTH_STATES.HEALTHY]:         0.50,
  [HEALTH_STATES.DAMAGED]:         0.35,
  [HEALTH_STATES.HEAVILY_DAMAGED]: 0.15,
};

// ─── Weighted random selection ────────────────────────────────────────────────
/**
 * Picks a random item from an array of { weight, ...data } objects.
 * Uses a single-pass weighted random algorithm.
 */
function weightedRandom(items, getWeight) {
  const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);
  let threshold = Math.random() * totalWeight;

  for (const item of items) {
    threshold -= getWeight(item);
    if (threshold <= 0) return item;
  }

  // Fallback (floating point edge case)
  return items[items.length - 1];
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Selects a random Pokémon from the weighted pool.
 * Returns { id, rarity, stage } from the rarity data.
 */
export function selectRandomPokemon() {
  return weightedRandom(POKEMON_POOL, (p) => p.spawnWeight);
}

/**
 * Randomly assigns a health state to the spawned Pokémon.
 * Returns one of the HEALTH_STATES values.
 */
export function assignHealthState() {
  const entries = Object.entries(HEALTH_SPAWN_WEIGHTS);
  const items = entries.map(([state, weight]) => ({ state, weight }));
  return weightedRandom(items, (item) => item.weight).state;
}

/**
 * Full encounter: select a Pokémon and assign its health state.
 * Returns { id, rarity, stage, health }
 */
export function generateEncounter() {
  const pokemon = selectRandomPokemon();
  const health  = assignHealthState();
  return { ...pokemon, health };
}
