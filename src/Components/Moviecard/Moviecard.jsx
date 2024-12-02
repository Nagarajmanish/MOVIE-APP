import React from "react";
import '../Moviebox.css';
import { Link } from "react-router-dom";

function Moviecard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="card-container">
      <div className="card-img-container">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div className="card-details">
        <div className="title">
          <span>{movie.title}</span>
        </div>
        <div className="genre">
          <span>
            Genres: {movie.genres.map(genre => genre.name).join(", ")}
          </span>
        </div>
        <div className="ratings">
          <span>Rating: {movie.vote_average.toFixed(2)}</span>
          <span>Duration: {movie.runtime ? movie.runtime : "N/A"} minutes</span>
        </div>
      </div>
    </Link>
  );
}

export default Moviecard;
