import React from 'react';

const TMDB_API_KEY = '565f409b9c46bedc1fc2a9165c7d0666';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Simple List Input Component (for Directors/Actors)
const ListInput = ({ value = [], onChange, placeholder }) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                onChange([...value, inputValue.trim()]);
                setInputValue('');
            }
        }
    };

    const remove = (index) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {value.map((item, i) => (
                    <span key={i} style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item}
                        <button onClick={() => remove(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 0 }}>×</button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
        </div>
    );
};

class MovieAutocompleteControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            isSearching: false,
            inputValue: '', // For the search box
        };
        this.searchMovies = debounce(this.searchMovies.bind(this), 300);
    }

    componentDidMount() {
        // Initialize search box with current title if available
        const value = this.getValue();
        if (value.title) {
            this.setState({ inputValue: value.title });
        }
    }

    // Helper to get JS object from Immutable Map or null
    getValue() {
        const { value } = this.props;
        if (!value) return {};
        // If it's an Immutable Map (standard in Decap), convert to JS
        return typeof value.toJS === 'function' ? value.toJS() : value;
    }

    // Helper to update a specific field in the object
    updateField(fieldName, fieldValue) {
        const current = this.getValue();
        const newValue = { ...current, [fieldName]: fieldValue };
        this.props.onChange(newValue);
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
            this.setState({ searchResults: data.results || [], isSearching: false });
        } catch (error) {
            console.error('TMDB API Error:', error);
            this.setState({ searchResults: [], isSearching: false });
        }
    }

    async selectMovie(movie) {
        // Fetch full details
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
            );
            const movieDetails = await response.json();

            // Prepare new object data
            const newData = {
                ...this.getValue(), // Keep existing data (like mood/singer if they were part of this object, but they aren't)
                title: movie.title,
                year: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear().toString() : '',
                movie_director: [],
                actor: []
            };

            // Director
            const director = movieDetails.credits?.crew?.find(person => person.job === 'Director');
            if (director) newData.movie_director = [director.name];

            // Cast (top 5)
            if (movieDetails.credits?.cast) {
                newData.actor = movieDetails.credits.cast.slice(0, 5).map(actor => actor.name);
            }

            // Update the entire object value
            this.props.onChange(newData);

            this.setState({
                inputValue: movie.title,
                searchResults: [],
            });
        } catch (error) {
            console.error('Error fetching movie details:', error);
            // Fallback if fetch fails
            this.updateField('title', movie.title);
            this.setState({ inputValue: movie.title, searchResults: [] });
        }
    }

    handleSearchChange(e) {
        const val = e.target.value;
        this.setState({ inputValue: val });
        this.updateField('title', val); // Update title as user types
        this.searchMovies(val);
    }

    render() {
        const { forID, classNameWrapper, field } = this.props;
        const { searchResults, isSearching, inputValue } = this.state;
        const value = this.getValue();
        
        // Get options from config.yml (passed via field prop)
        const yearOptions = field.get('year_options') ? field.get('year_options').toJS() : [];

        return (
            <div className={classNameWrapper} style={{ border: '1px solid #dfdfdf', padding: '16px', borderRadius: '4px', backgroundColor: '#fff' }}>
                {/* 1. Movie Title Search */}
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Movie Title (Search TMDB)</label>
                    <input
                        type="text"
                        id={forID}
                        value={inputValue}
                        onChange={(e) => this.handleSearchChange(e)}
                        placeholder="Type movie name..."
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    {isSearching && <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Searching...</div>}
                    
                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '300px', overflowY: 'auto',
                            backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', marginTop: '4px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            {searchResults.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => this.selectMovie(movie)}
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt="" style={{ width: '30px', height: '45px', objectFit: 'cover' }} />}
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{movie.title}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{movie.release_date?.split('-')[0]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Year Select */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Year</label>
                    <select
                        value={value.year || ''}
                        onChange={(e) => this.updateField('year', e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
                    >
                        <option value="">Select Year</option>
                        {yearOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* 3. Directors List */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Directors</label>
                    <ListInput 
                        value={value.movie_director || []} 
                        onChange={(val) => this.updateField('movie_director', val)}
                        placeholder="Add director and press Enter"
                    />
                </div>

                {/* 4. Actors List */}
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>Actors</label>
                    <ListInput 
                        value={value.actor || []} 
                        onChange={(val) => this.updateField('actor', val)}
                        placeholder="Add actor and press Enter"
                    />
                </div>
            </div>
        );
    }
}

const MovieAutocompletePreview = ({ value }) => {
    const data = value ? (typeof value.toJS === 'function' ? value.toJS() : value) : {};
    return (
        <div style={{ padding: '10px', border: '1px solid #ccc' }}>
            <h3>{data.title || 'No Movie'} ({data.year})</h3>
            <p><strong>Director:</strong> {data.movie_director?.join(', ')}</p>
            <p><strong>Cast:</strong> {data.actor?.join(', ')}</p>
        </div>
    );
};

const MovieAutocompleteWidget = {
    name: 'movie-autocomplete',
    controlComponent: MovieAutocompleteControl,
    previewComponent: MovieAutocompletePreview,
};

export default MovieAutocompleteWidget;
