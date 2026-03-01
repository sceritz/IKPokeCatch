import React from 'react';

export default function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div className="loading-screen">
      <div className="pokeball-spinner">
        <div className="pokeball-top" />
        <div className="pokeball-middle" />
        <div className="pokeball-bottom" />
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
}
