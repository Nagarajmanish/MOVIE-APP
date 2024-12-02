import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const apiKey = "9d715e4f376f12beedfd6aa758d48cab";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits`
        );
        console.log("Movie details response:", response.data); // Log the response
        setMovieDetails(response.data);

        // Find the trailer key
        const trailer = response.data.videos.results.find(video => video.type === 'Trailer');
        if (trailer) {
          setTrailerKey(trailer.key); // Store the trailer key
          console.log("Trailer key found:", trailer.key); // Log the trailer key
        } else {
          console.log("No trailer found for this movie."); // Log if no trailer is found
        }
      } catch (err) {
        console.error("Error fetching movie details: ", err.message);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movieDetails) return <p>Loading movie details...</p>;

  const director = movieDetails.credits?.crew.find(person => person.job === "Director")?.name || "Unknown Director";

  return (
    <div className="movie-details-container">
      <div className='img-container'>
        <h2>{movieDetails.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
          alt={movieDetails.title}
        />
      </div>
      <div className='details-container'>
        <p>
          <span>Overview:</span>
          <br />
          {movieDetails.overview}
        </p>
        <p>
          <span>Genre:</span> {movieDetails.genres.map(genre => genre.name).join(", ")}
        </p>
        <p>
          <span>Rating:</span> {movieDetails.vote_average.toFixed(2)}
        </p>
        <p>
          <span>Duration:</span> {movieDetails.runtime} minutes
        </p>
        <p>
          <span>Director:</span> {director}
        </p>
        {/* Display trailer link if available */}
        {trailerKey && (
          <div className="trailer-container">
            <h3>Watch Trailer</h3>
            <a href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
