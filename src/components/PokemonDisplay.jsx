import React from 'react';
import { RARITY_LABELS, STAGE_LABELS, RARITY_COLORS } from '../data/pokemonRarity.js';
import { HEALTH_STATES } from '../utils/encounterSystem.js';

const HEALTH_ICONS = {
  [HEALTH_STATES.HEALTHY]:         '💚',
  [HEALTH_STATES.DAMAGED]:         '🟡',
  [HEALTH_STATES.HEAVILY_DAMAGED]: '🔴',
};

const HEALTH_CLASS = {
  [HEALTH_STATES.HEALTHY]:         'health-healthy',
  [HEALTH_STATES.DAMAGED]:         'health-damaged',
  [HEALTH_STATES.HEAVILY_DAMAGED]: 'health-heavy',
};

// Soft desaturated glow per rarity — gives the sprite a spotlight feel
const RARITY_GLOW = {
  common:    'rgba(120, 120, 150, 0.22)',
  uncommon:  'rgba(102, 187, 106, 0.22)',
  rare:      'rgba(66,  165, 245, 0.22)',
  very_rare: 'rgba(171,  71, 188, 0.22)',
  legendary: 'rgba(255, 167,  38, 0.28)',
};

export default function PokemonDisplay({ pokemon }) {
  if (!pokemon) return null;

  const { name, sprite, rarity, stage, health } = pokemon;
  const rarityColor = RARITY_COLORS[rarity] ?? '#9e9e9e';
  const glowColor   = RARITY_GLOW[rarity]   ?? 'rgba(100, 100, 150, 0.18)';

  return (
    <div className="pokemon-display">
      {/* Sprite with rarity aura */}
      <div
        className="sprite-container"
        style={{ background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 68%)` }}
      >
        {sprite ? (
          <img
            src={sprite}
            alt={name}
            className="pokemon-sprite"
            draggable={false}
          />
        ) : (
          <div className="sprite-placeholder">?</div>
        )}
      </div>

      {/* Info block */}
      <div className="pokemon-info">
        <h2 className="pokemon-name">{name}</h2>

        <div className="badges">
          <span
            className="badge badge-rarity"
            style={{ borderColor: rarityColor, color: rarityColor }}
          >
            {RARITY_LABELS[rarity] ?? rarity}
          </span>

          <span className="badge badge-stage">
            {STAGE_LABELS[stage] ?? `Stage ${stage}`}
          </span>
        </div>

        <div className={`health-status ${HEALTH_CLASS[health]}`}>
          <span className="health-icon">{HEALTH_ICONS[health]}</span>
          <span className="health-label">{health}</span>
        </div>
      </div>
    </div>
  );
}
