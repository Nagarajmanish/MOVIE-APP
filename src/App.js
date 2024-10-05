import './App.css';
import Moviecard from './Components/Moviecard/Moviecard';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isMoviesFetched, setIsMoviesFetched] = useState(false); // Track when movies are fetched
  const apiKey = "9d715e4f376f12beedfd6aa758d48cab";

  const getTopRatedMovies = async () => {
    try {
      let allMovies = [];
      const totalPages = 100; // Assume we want to fetch up to 10 pages for general movies
      const pagesToFetch = Math.min(totalPages,150);
  
      // Fetch top-rated general movies
      for (let page = 1; page <= pagesToFetch; page++) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${page}`  // response 20 array of movies 
        );
        const movies = response.data.results;
    
  
        // Fetch details for each movie
        const movieDetailsPromises = movies.map((movie) =>
          axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits`
          )        // gets each movies details one by one
        );
      
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const detailedMovies = movieDetailsResponses.map((response) => response.data);
        console.log(detailedMovies);
  
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
      console.error("Error fetching top-rated movies: ", err.message);
      //setIsMoviesFetched(true); // Mark movies as fetched even in case of an error
    }
  };
  
  useEffect(() => {
    getTopRatedMovies();
  },[]);
  

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);

    const filtered = movieList.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(value);
      const genreMatch = movie.genres.some(genre => genre.name.toLowerCase().includes(value));
      const directorMatch = movie.credits.crew.some(person => person.job === "Director" && person.name.toLowerCase().includes(value));
      const actorMatch = movie.credits.cast.some(actor => actor.name.toLowerCase().includes(value));

      return titleMatch || genreMatch || directorMatch || actorMatch;
    });

    setFilteredMovies(filtered);
  };

  return (
    <div>
      <header className='title-container'>
        <h1 className='name'>MovieWaves </h1>
      </header>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by title, genre, director, actor..." 
          className="movie-search-input" 
          value={searchInput}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="movie-list">
        {!isMoviesFetched ? null : // Don't display anything until movies are fetched
          filteredMovies ? (
            filteredMovies.map(movie => (
              
              <Moviecard 
                key={movie.id} 
                movie={movie} 
              />
            ))
          ) : (
            <p className='no-movie-found'>No movies found</p>
          )
        }
      </div>
    </div>
  );
}

export default App;
