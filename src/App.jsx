import React, { useEffect } from 'react';
import { useDiscordSDK }        from './hooks/useDiscordSDK.js';
import { usePokemonEncounter }  from './hooks/usePokemonEncounter.js';
import LoadingScreen            from './components/LoadingScreen.jsx';
import PokemonDisplay           from './components/PokemonDisplay.jsx';
import BallSelector             from './components/BallSelector.jsx';
import CatchResult              from './components/CatchResult.jsx';

export default function App() {
  // ── Discord SDK ────────────────────────────────────────────────────────────
  const { user, loading: sdkLoading, error: sdkError } = useDiscordSDK();

  // ── Encounter ──────────────────────────────────────────────────────────────
  const {
    phase,
    pokemon,
    result,
    apiError,
    attemptsAllowed,
    attemptsRemaining,
    setAttemptsAllowed,
    spawnPokemon,
    throwBall,
    retryThrow,
    nextEncounter,
  } = usePokemonEncounter(user);

  // Spawn the first Pokémon once the SDK (or fallback) is ready
  useEffect(() => {
    if (!sdkLoading && phase === 'idle') {
      spawnPokemon();
    }
  }, [sdkLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────
  if (sdkLoading) {
    return <LoadingScreen message="Connecting to Discord…" />;
  }

  if (phase === 'loading') {
    return <LoadingScreen message="A wild Pokémon appeared!" />;
  }

  if (apiError) {
    return (
      <div className="error-screen">
        <p>⚠️ Failed to load Pokémon data.</p>
        <p className="error-detail">{apiError}</p>
        <button className="btn-next" onClick={spawnPokemon}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <span className="app-title">IK PokéCatch</span>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Wild Pokémon */}
        {pokemon && phase !== 'result' && (
          <>
            <p className="wild-text">A wild Pokémon appeared!</p>
            <PokemonDisplay pokemon={pokemon} />
          </>
        )}

        {/* Show Pokémon quietly behind the result too */}
        {pokemon && phase === 'result' && (
          <PokemonDisplay pokemon={pokemon} />
        )}

        {/* Attempt setter — visible while choosing a ball */}
        {phase === 'ready' && (
          <div className="attempt-setter">
            <span className="attempt-label">Attempts</span>
            <div className="attempt-controls">
              <button
                className="attempt-btn"
                onClick={() => setAttemptsAllowed(attemptsAllowed - 1)}
                disabled={attemptsAllowed <= 1}
              >−</button>
              <span className="attempt-count">{attemptsAllowed}</span>
              <button
                className="attempt-btn"
                onClick={() => setAttemptsAllowed(attemptsAllowed + 1)}
                disabled={attemptsAllowed >= 10}
              >+</button>
            </div>
          </div>
        )}

        {/* Ball selection — only while in 'ready' phase */}
        {phase === 'ready' && (
          <BallSelector onSelect={throwBall} disabled={false} />
        )}

        {/* Catch result */}
        {phase === 'result' && result && (
          <CatchResult
            result={result}
            pokemonName={pokemon?.name ?? 'Pokémon'}
            attemptsRemaining={attemptsRemaining}
            onRetry={retryThrow}
            onNext={nextEncounter}
          />
        )}
      </main>

      {/* SDK error banner (non-fatal) */}
      {sdkError && (
        <div className="sdk-warning">
          ⚠️ Auth error: {sdkError.message}
        </div>
      )}
    </div>
  );
}
