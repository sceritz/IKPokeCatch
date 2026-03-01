import React from 'react';
import { BALLS } from '../utils/captureSystem.js';

export default function BallSelector({ onSelect, disabled }) {
  return (
    <div className="ball-selector">
      <p className="ball-selector-label">Choose your Poké Ball</p>
      <div className="ball-grid">
        {BALLS.map((ball) => (
          <button
            key={ball.id}
            className="ball-btn"
            style={{ '--ball-color': ball.color }}
            onClick={() => onSelect(ball.id)}
            disabled={disabled}
            title={`${ball.name} — ${ball.guaranteed ? 'Guaranteed catch' : `${ball.multiplier}× catch rate`}`}
          >
            <img src={ball.sprite} alt={ball.name} className="ball-sprite" draggable={false} />
            <span className="ball-name">{ball.name}</span>
            <span className="ball-mult">
              {ball.guaranteed ? '∞' : `${ball.multiplier}×`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
