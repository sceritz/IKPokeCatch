import React from 'react';

export default function CatchResult({ result, pokemonName, attemptsRemaining, onRetry, onNext }) {
  if (!result) return null;

  const { success, chance, ball } = result;
  const hasRetry = !success && attemptsRemaining > 0;

  return (
    <div className={`catch-result ${success ? 'result-success' : 'result-fail'}`}>
      <div className="result-icon">{success ? '✅' : '💨'}</div>

      <h3 className="result-headline">
        {success
          ? `${pokemonName} was caught!`
          : `${pokemonName} broke free!`}
      </h3>

      <div className="result-details">
        <span>{ball.name}</span>
        <span className="result-sep">·</span>
        <span>{(chance * 100).toFixed(1)}% chance</span>
      </div>

      {hasRetry && (
        <p className="attempts-remaining">
          {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
        </p>
      )}

      {!success && !hasRetry && (
        <p className="result-flavour">
          It shook the ball and escaped! Don't give up!
        </p>
      )}

      <button className="btn-next" onClick={hasRetry ? onRetry : onNext}>
        {success
          ? 'Find another Pokémon'
          : hasRetry
            ? `Try again`
            : 'Next Pokémon'}
      </button>
    </div>
  );
}
