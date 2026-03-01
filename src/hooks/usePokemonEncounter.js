/**
 * usePokemonEncounter
 *
 * Manages the full lifecycle of a single Pokémon encounter:
 *   1. Generate encounter data (species + health) using the encounter system
 *   2. Fetch Pokémon details (name + sprite) from PokéAPI
 *   3. Expose throwBall() for the capture attempt
 *   4. Expose nextEncounter() to reset and spawn a new Pokémon
 *
 * State machine:
 *   idle → loading → ready → result
 *     ↑                         │ (retryThrow if attempts remain)
 *     └── nextEncounter() ──────┘
 */

import { useState, useCallback } from 'react';
import { generateEncounter }     from '../utils/encounterSystem.js';
import { attemptCatch }          from '../utils/captureSystem.js';
import { postCatchResult }       from '../utils/discordWebhook.js';

// Use the Discord URL mapping proxy when running inside Discord (non-localhost),
// otherwise call PokéAPI directly.
const IS_LOCALHOST   = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const POKEAPI_BASE   = IS_LOCALHOST ? 'https://pokeapi.co/api/v2/pokemon' : '/pokeapi/api/v2/pokemon';
const MAX_ATTEMPTS   = 10;

async function fetchPokemonDetails(id) {
  const res  = await fetch(`${POKEAPI_BASE}/${id}`);
  if (!res.ok) throw new Error(`PokéAPI error for id ${id}: ${res.status}`);
  const data = await res.json();

  const rawSprite =
    data.sprites?.other?.['official-artwork']?.front_default ??
    data.sprites?.front_default ??
    null;

  // When inside Discord, rewrite raw.githubusercontent.com URLs through the
  // /sprites URL mapping configured in the Discord Developer Portal.
  const sprite = rawSprite && !IS_LOCALHOST
    ? rawSprite.replace('https://raw.githubusercontent.com', '/sprites')
    : rawSprite;

  return {
    name:   data.name.charAt(0).toUpperCase() + data.name.slice(1).replace(/-/g, ' '),
    sprite,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePokemonEncounter(user) {
  const [phase,           setPhase]           = useState('idle');
  const [pokemon,         setPokemon]         = useState(null);
  const [result,          setResult]          = useState(null);
  const [apiError,        setApiError]        = useState(null);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [attemptsUsed,    setAttemptsUsed]    = useState(0);

  const attemptsRemaining = attemptsAllowed - attemptsUsed;

  // ── Spawn a new Pokémon ────────────────────────────────────────────────────
  const spawnPokemon = useCallback(async () => {
    setPhase('loading');
    setResult(null);
    setApiError(null);
    setAttemptsUsed(0);
    setAttemptsAllowed(1);

    try {
      const encounter = generateEncounter();
      const details   = await fetchPokemonDetails(encounter.id);

      setPokemon({
        id:     encounter.id,
        rarity: encounter.rarity,
        stage:  encounter.stage,
        health: encounter.health,
        name:   details.name,
        sprite: details.sprite,
      });
      setPhase('ready');
    } catch (err) {
      console.error('Failed to spawn Pokémon:', err);
      setApiError(err.message ?? 'Failed to load Pokémon data');
      setPhase('idle');
    }
  }, []);

  // ── Throw a ball ───────────────────────────────────────────────────────────
  const throwBall = useCallback((ballId) => {
    if (phase !== 'ready' || !pokemon) return;

    const nextAttemptsUsed = attemptsUsed + 1;
    setAttemptsUsed(nextAttemptsUsed);

    const catchResult = attemptCatch({
      rarity: pokemon.rarity,
      health: pokemon.health,
      ballId,
    });

    setResult(catchResult);
    setPhase('result');

    // Only post to the webhook on the final outcome — success or last attempt used.
    const remaining = attemptsAllowed - nextAttemptsUsed;
    if (user && (catchResult.success || remaining === 0)) {
      postCatchResult({
        username:    user.username,
        pokemonName: pokemon.name,
        rarity:      pokemon.rarity,
        stage:       pokemon.stage,
        health:      pokemon.health,
        ballName:    catchResult.ball.name,
        success:     catchResult.success,
        chance:      catchResult.chance,
        spriteUrl:   pokemon.sprite,
      });
    }
  }, [phase, pokemon, user, attemptsUsed, attemptsAllowed]);

  // ── Retry with same Pokémon (attempts remain after a miss) ─────────────────
  const retryThrow = useCallback(() => {
    setResult(null);
    setPhase('ready');
  }, []);

  // ── Reset for next encounter ───────────────────────────────────────────────
  const nextEncounter = useCallback(() => {
    setPokemon(null);
    setResult(null);
    spawnPokemon();
  }, [spawnPokemon]);

  return {
    phase,
    pokemon,
    result,
    apiError,
    attemptsAllowed,
    attemptsRemaining,
    setAttemptsAllowed: (n) => setAttemptsAllowed(Math.min(MAX_ATTEMPTS, Math.max(1, n))),
    spawnPokemon,
    throwBall,
    retryThrow,
    nextEncounter,
  };
}
