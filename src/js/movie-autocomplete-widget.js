import React from 'react';
import { debounce } from 'lodash';

const TMDB_API_KEY = 'YOUR_API_KEY_HERE'; // User needs to replace this
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class MovieAutocompleteControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            isSearching: false,
            selectedMovie: null,
            inputValue: props.value || '',
        };

        this.searchMovies = debounce(this.searchMovies.bind(this), 300);
    }

    async searchMovies(query) {
        if (!query || query.length < 2) {
            this.setState({ searchResults: [], isSearching: false });
            return;
        }

        this.setState({ isSearching: true });

        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&include_adult=false`
            );
            const data = await response.json();

            this.setState({
                searchResults: data.results || [],
                isSearching: false,
            });
        } catch (error) {
            console.error('TMDB API Error:', error);
            this.setState({ searchResults: [], isSearching: false });
        }
    }

    async selectMovie(movie) {
        const { onChange, forID } = this.props;

        // Fetch full movie details including credits
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
            );
            const movieDetails = await response.json();

            // Set the movie title
            onChange(movie.title);

            // Auto-fill other fields via the entry object
            const { entry } = this.props;

            // Year
            if (movieDetails.release_date) {
                const year = new Date(movieDetails.release_date).getFullYear().toString();
                entry.get('data').set('year', year);
            }

            // Director
            const director = movieDetails.credits?.crew?.find(person => person.job === 'Director');
            if (director) {
                entry.get('data').set('movie_director', [director.name]);
            }

            // Cast (top 5 actors)
            if (movieDetails.credits?.cast) {
                const cast = movieDetails.credits.cast.slice(0, 5).map(actor => actor.name);
                entry.get('data').set('actor', cast);
            }

            this.setState({
                selectedMovie: movie,
                inputValue: movie.title,
                searchResults: [],
            });
        } catch (error) {
            console.error('Error fetching movie details:', error);
            onChange(movie.title);
            this.setState({
                inputValue: movie.title,
                searchResults: [],
            });
        }
    }

    handleInputChange(e) {
        const value = e.target.value;
        this.setState({ inputValue: value });
        this.props.onChange(value);
        this.searchMovies(value);
    }

    render() {
        const { forID, classNameWrapper } = this.props;
        const { searchResults, isSearching, inputValue } = this.state;

        return (
            <div className={classNameWrapper} style={{ position: 'relative' }}>
                <input
                    type="text"
                    id={forID}
                    value={inputValue}
                    onChange={(e) => this.handleInputChange(e)}
                    placeholder="Type movie name..."
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                />

                {isSearching && (
                    <div style={{ padding: '8px', color: '#666' }}>Searching...</div>
                )}

                {searchResults.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            marginTop: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        {searchResults.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => this.selectMovie(movie)}
                                style={{
                                    padding: '12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                {movie.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                        alt={movie.title}
                                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                )}
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{movie.title}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

const MovieAutocompletePreview = ({ value }) => <div>{value || 'No movie selected'}</div>;

const MovieAutocompleteWidget = {
    name: 'movie-autocomplete',
    controlComponent: MovieAutocompleteControl,
    previewComponent: MovieAutocompletePreview,
};

export default MovieAutocompleteWidget;
