import React from "react";
import '../Moviebox.css';

function Moviecard({ movie }) {
  return (
    <div className="card-container">
      {movie ? (
        <>
          <div className="card-img-container">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
          <div className="card-details">
            <div className="title">
              <span>{movie.title}</span> {/* Dynamically display the movie title */}
            </div>
            <div className="genre">
              <span>
                Genres:{" "}
                {movie.genres
                  ? movie.genres.map(genre => genre.name).join(", ")
                  : "N/A"}
              </span> {/* Display genre names */}
            </div>
            <div className="ratings">
              <span>Rating: {movie.vote_average.toFixed(2)}</span> {/* Display the rating */}
              <span>Duration: {movie.runtime ? movie.runtime : "N/A"} minutes</span> {/* Display runtime */}
            </div>
          </div>
        </>
      ) : (
        <p>no movie data available</p>
      )}
    </div>
  );
}

export default Moviecard;
