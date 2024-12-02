import './App.css';
import React, { useEffect, useState } from 'react';
import Moviecard from './Components/Moviecard/Moviecard';
import MovieDetails from './Components/MovieDetails/MovieDetails'; // Import MovieDetails component
import axios from 'axios';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route

function App() {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchCategory, setSearchCategory] = useState('title'); // Default search category
  const [isMoviesFetched, setIsMoviesFetched] = useState(false);
  const apiKey = '9d715e4f376f12beedfd6aa758d48cab';

  const getTopRatedMovies = async () => {
    try {
      let allMovies = [];
      const totalPages = 50; // Fetch up to  50 pages for general movies

      // Fetch top-rated general movies
      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${page}`
        );
        const movies = response.data.results;

        // Fetch details for each movie
        const movieDetailsPromises = movies.map((movie) =>
          axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits`
          )
        );

        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const detailedMovies = movieDetailsResponses.map((response) => response.data);

        // Add to allMovies, ensuring no duplicates
        detailedMovies.forEach((movie) => {
          if (!allMovies.some((existingMovie) => existingMovie.id === movie.id)) {
            allMovies.push(movie);
          }
        });
      }

      // Update state with fetched movies
      setMovieList(allMovies);
      setFilteredMovies(allMovies);
      setIsMoviesFetched(true); // Mark movies as fetched
    } catch (err) {
      console.error('Error fetching top-rated movies: ', err.message);
    }
  };

  useEffect(() => {
    getTopRatedMovies();
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);

    const filtered = movieList.filter((movie) => {
      if (searchCategory === 'title') {
        return movie.title.toLowerCase().includes(value);
      } else if (searchCategory === 'genre') {
        return movie.genres.some((genre) => genre.name.toLowerCase().includes(value));
      } else if (searchCategory === 'director') {
        return movie.credits.crew.some(
          (person) => person.job === 'Director' && person.name.toLowerCase().includes(value)
        );
      } else if (searchCategory === 'actor') {
        return movie.credits.cast.some((actor) => actor.name.toLowerCase().includes(value));
      }
      return false;
    });

    setFilteredMovies(filtered);
  };

  const handleSearchCategoryChange = (e) => {
    setSearchCategory(e.target.value);
    setSearchInput(''); // Reset search input when category changes
    setFilteredMovies(movieList); // Reset filtered list
  };

  return (
    <div>
      <header className="title-container">
        <h1 className="name">CineMaze</h1>
      </header>
      <Routes>
        {/* Movie List Route */}
        <Route
          path="/"
          element={
            <div>
              <div className="search-container">
                <select
                  className="search-category"
                  onChange={handleSearchCategoryChange}
                  value={searchCategory}
                >
                  <option value="title">Title</option>
                  <option value="genre">Genre</option>
                  <option value="director">Director</option>
                  <option value="actor">Actor</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchCategory}...`}
                  className="movie-search-input"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="movie-list">
                {!isMoviesFetched ? (
                  <p>Loading movies...</p>
                ) : filteredMovies.length > 0 ? (
                  filteredMovies.map((movie) => <Moviecard key={movie.id} movie={movie} />)
                ) : (
                  <p className="no-movie-found">No movies found</p>
                )}
              </div>
            </div>
          }
        />
        {/* Movie Details Route */}
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
