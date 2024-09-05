import React from 'react';

import './ErrorOnAllMovieCard.css';

export default function ErrorOnAllMovieCard({ textOfError }) {
  return (
    <div className="error-on-all-movie-card">
      <p className="error-on-all-movie-card__text">{textOfError}</p>
    </div>
  );
}
