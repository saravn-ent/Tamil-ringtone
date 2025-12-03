import React, { useState } from 'react';
import { 
  Play, Pause, Download, Heart, Search, Menu, X, 
  User, Music, Film, Mic, Hash, ArrowLeft, 
  Layers, Users, Star, Calendar
} from 'lucide-react';

/**
 * TamilRing "Hub" Design
 * Concept: Fully Relational Navigation (IMDb Style)
 * Every tag is a portal to a new view.
 */

// --- RELATIONAL MOCK DATA ---

const ACTORS = [
  { id: 'act1', name: 'Vijay', image: 'https://image.tmdb.org/t/p/w200/5qMF9X2sgWq5t6X0D5F7j4.jpg' },
  { id: 'act2', name: 'Trisha', image: 'https://image.tmdb.org/t/p/w200/e64s6q1s5g5s5.jpg' }, // Placeholder ID
  { id: 'act3', name: 'Vikram', image: 'https://image.tmdb.org/t/p/w200/xe5g6.jpg' }, // Placeholder ID
  { id: 'act4', name: 'Dhruv Vikram', image: 'https://image.tmdb.org/t/p/w200/dhruv.jpg' } // Placeholder ID
];

const DIRECTORS = [
  { id: 'md1', name: 'Anirudh Ravichander', role: 'Music Director' },
  { id: 'md2', name: 'A.R. Rahman', role: 'Music Director' },
  { id: 'md3', name: 'Nivas K Prasanna', role: 'Music Director' }
];

const SINGERS = [
  { id: 's1', name: 'Sid Sriram' },
  { id: 's2', name: 'Anirudh Ravichander' },
  { id: 's3', name: 'Shreya Ghoshal' },
  { id: 's4', name: 'Arivu' },
  { id: 's5', name: 'Kapil Kapilan' }
];

const MOODS = [
  { id: 'm1', name: 'Mass / Heroic', color: 'bg-red-100 text-red-800' },
  { id: 'm2', name: 'Romantic', color: 'bg-pink-100 text-pink-800' },
  { id: 'm3', name: 'Sad', color: 'bg-blue-100 text-blue-800' },
  { id: 'm4', name: 'BGM', color: 'bg-purple-100 text-purple-800' },
];

const MOVIES = [
  { 
    id: 'mov1', 
    title: 'Leo', 
    year: '2023', 
    poster: 'https://image.tmdb.org/t/p/w500/pD6sL4vntUOXHmuvJPPZAgvyfd9.jpg',
    directorId: 'md1', // Anirudh
    actorIds: ['act1', 'act2'] // Vijay, Trisha
  },
  { 
    id: 'mov2', 
    title: 'Ponniyin Selvan 2', 
    year: '2023', 
    poster: 'https://image.tmdb.org/t/p/w500/14GEwV7fL5f9FvF59V3N4bL3E6.jpg',
    directorId: 'md2', // ARR
    actorIds: ['act3', 'act2'] // Vikram, Trisha
  },
  { 
    id: 'mov3', 
    title: 'Bison', 
    year: '2024', 
    poster: 'https://pbs.twimg.com/media/GPVw4fubQAA2-0d.jpg',
    directorId: 'md3', // Nivas
    actorIds: ['act4'] // Dhruv
  }
];

const RINGTONES = [
  { id: 'r1', title: 'Badass Theme', movieId: 'mov1', moodId: 'm1', singerIds: ['s2'], downloads: 15400 },
  { id: 'r2', title: 'Naa Ready', movieId: 'mov1', moodId: 'm1', singerIds: ['s2', 's4'], downloads: 12100 },
  { id: 'r3', title: 'Anbenum', movieId: 'mov1', moodId: 'm2', singerIds: ['s2'], downloads: 8900 },
  { id: 'r4', title: 'Aga Naga', movieId: 'mov2', moodId: 'm2', singerIds: ['s1'], downloads: 18000 },
  { id: 'r5', title: 'Chinnanjiru', movieId: 'mov2', moodId: 'm3', singerIds: ['s2', 's5'], downloads: 22000 },
  { id: 'r6', title: 'Bison Roar', movieId: 'mov3', moodId: 'm4', singerIds: [], downloads: 5400 },
];

// --- NAVIGATION HELPERS ---

// Helper to find data based on ID
const findData = (type, id) => {
  switch(type) {
    case 'movie': return MOVIES.find(m => m.id === id);
    case 'music-director': return DIRECTORS.find(d => d.id === id);
    case 'singer': return SINGERS.find(s => s.id === id);
    case 'actor': return ACTORS.find(a => a.id === id);
    case 'mood': return MOODS.find(m => m.id === id);
    default: return null;
  }
};

// --- COMPONENTS ---

const Chip = ({ label, icon: Icon, onClick, colorClass = "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700" }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${colorClass}`}
  >
    {Icon && <Icon className="w-3 h-3" />}
    {label}
  </button>
);

const RingtoneRow = ({ ringtone, onNavigate, onPlay, isPlaying }) => {
  const movie = MOVIES.find(m => m.id === ringtone.movieId);
  const mood = MOODS.find(m => m.id === ringtone.moodId);
  const singers = ringtone.singerIds.map(sid => SINGERS.find(s => s.id === sid));

  return (
    <div className="group bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-4 hover:shadow-md transition-all">
      {/* Thumbnail / Player */}
      <div 
        className="relative w-14 h-14 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => onPlay(ringtone)}
      >
        <img src={movie?.poster} className="w-full h-full object-cover" alt="" />
        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          {isPlaying ? <Pause className="w-6 h-6 text-white fill-current" /> : <Play className="w-6 h-6 text-white fill-current" />}
        </div>
      </div>

      {/* Info & Tags */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
           <h4 className="font-bold text-gray-900 truncate">{ringtone.title}</h4>
           <div className="flex items-center gap-2 text-xs text-gray-400">
             <Download className="w-3 h-3" /> {ringtone.downloads.toLocaleString()}
           </div>
        </div>
        
        {/* The "Wikipedia Style" clickable tags row */}
        <div className="flex flex-wrap gap-2 mt-2">
           <Chip 
              icon={Film} 
              label={movie?.title} 
              onClick={() => onNavigate('movie', movie.id)} 
              colorClass="bg-blue-50 text-blue-700 hover:bg-blue-100"
           />
           <Chip 
              icon={Hash} 
              label={mood?.name} 
              onClick={() => onNavigate('mood', mood.id)} 
              colorClass={mood?.color}
           />
           {singers.map(singer => (
             <Chip 
               key={singer.id}
               icon={Mic} 
               label={singer.name} 
               onClick={() => onNavigate('singer', singer.id)} 
               colorClass="bg-purple-50 text-purple-700 hover:bg-purple-100"
             />
           ))}
        </div>
      </div>

      {/* Action */}
      <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

function TamilRingHub() {
  // Navigation State
  const [viewStack, setViewStack] = useState([{ type: 'home', id: null }]);
  const [currentView, setCurrentView] = useState({ type: 'home', id: null });
  
  // Player State
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

  // Navigation Function
  const navigateTo = (type, id) => {
    const newView = { type, id };
    setViewStack([...viewStack, newView]);
    setCurrentView(newView);
    window.scrollTo(0,0);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      const newStack = [...viewStack];
      newStack.pop();
      setViewStack(newStack);
      setCurrentView(newStack[newStack.length - 1]);
    }
  };

  const handlePlay = (ringtone) => {
    if (currentSong?.id === ringtone.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(ringtone);
      setIsPlaying(true);
    }
  };

  // --- VIEW RENDERERS ---

  const renderHome = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Film className="w-5 h-5 text-orange-500" /> Recent Movies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOVIES.map(movie => (
            <div 
              key={movie.id} 
              onClick={() => navigateTo('movie', movie.id)}
              className="cursor-pointer group"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 relative shadow-sm group-hover:shadow-md transition-all">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {movie.year}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm truncate">{movie.title}</h3>
              <p className="text-xs text-gray-500 truncate">{DIRECTORS.find(d => d.id === movie.directorId)?.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" /> Trending Ringtones
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {RINGTONES.slice(0, 6).map(r => (
            <RingtoneRow key={r.id} ringtone={r} onNavigate={navigateTo} onPlay={handlePlay} isPlaying={currentSong?.id === r.id && isPlaying} />
          ))}
        </div>
      </section>
    </div>
  );

  const renderMoviePage = (movieId) => {
    const movie = MOVIES.find(m => m.id === movieId);
    const director = DIRECTORS.find(d => d.id === movie.directorId);
    const actors = movie.actorIds.map(aid => ACTORS.find(a => a.id === aid));
    const movieRingtones = RINGTONES.filter(r => r.movieId === movieId);

    return (
      <div>
        {/* Movie Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row gap-6 items-start">
          <img src={movie.poster} className="w-32 md:w-48 rounded-lg shadow-md" alt={movie.title} />
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
               <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">{movie.year}</span>
               <span className="text-gray-400 text-sm">• Action / Thriller</span>
             </div>
             <h1 className="text-3xl font-bold text-gray-900 mb-4">{movie.title}</h1>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                   <p className="text-gray-500 mb-1">Music Director</p>
                   <Chip 
                     icon={Music} 
                     label={director.name} 
                     onClick={() => navigateTo('music-director', director.id)} 
                     colorClass="bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 text-sm py-1.5"
                   />
                </div>
                <div>
                   <p className="text-gray-500 mb-1">Starring</p>
                   <div className="flex flex-wrap gap-2">
                     {actors.map(actor => (
                       <Chip 
                         key={actor.id}
                         icon={User} 
                         label={actor.name} 
                         onClick={() => navigateTo('actor', actor.id)} 
                         colorClass="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                       />
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Movie Ringtones */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tracks & Ringtones ({movieRingtones.length})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {movieRingtones.map(r => (
             <RingtoneRow key={r.id} ringtone={r} onNavigate={navigateTo} onPlay={handlePlay} isPlaying={currentSong?.id === r.id && isPlaying} />
           ))}
        </div>
      </div>
    );
  };

  const renderEntityPage = (type, id) => {
    // Generic page for Singer, Director, Actor, Mood
    const data = findData(type, id);
    let relatedRingtones = [];
    
    // Filter Logic
    if (type === 'music-director') {
       // Find movies by director, then ringtones in those movies
       const movieIds = MOVIES.filter(m => m.directorId === id).map(m => m.id);
       relatedRingtones = RINGTONES.filter(r => movieIds.includes(r.movieId));
    } else if (type === 'singer') {
       relatedRingtones = RINGTONES.filter(r => r.singerIds.includes(id));
    } else if (type === 'actor') {
       const movieIds = MOVIES.filter(m => m.actorIds.includes(id)).map(m => m.id);
       relatedRingtones = RINGTONES.filter(r => movieIds.includes(r.movieId));
    } else if (type === 'mood') {
       relatedRingtones = RINGTONES.filter(r => r.moodId === id);
    }

    const titles = {
      'music-director': 'Music Director',
      'singer': 'Singer',
      'actor': 'Actor',
      'mood': 'Mood'
    };

    return (
      <div>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 mb-8 text-white flex items-center gap-6 shadow-lg">
           <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-4 border-white/20">
             {data.name.charAt(0)}
           </div>
           <div>
             <span className="text-orange-400 font-bold uppercase tracking-wider text-xs">{titles[type] || 'Artist'}</span>
             <h1 className="text-4xl font-bold mt-1">{data.name}</h1>
             <p className="text-gray-400 mt-2">{relatedRingtones.length} Ringtones Available</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {relatedRingtones.map(r => (
             <RingtoneRow key={r.id} ringtone={r} onNavigate={navigateTo} onPlay={handlePlay} isPlaying={currentSong?.id === r.id && isPlaying} />
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* --- SIDEBAR NAVIGATION (The "Directory") --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
        <div className="p-6 sticky top-0 bg-white z-10 border-b border-gray-100">
           <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigateTo('home')}>
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white"><Music className="w-5 h-5"/></div>
             TamilRing
           </div>
        </div>
        
        <nav className="p-4 space-y-8">
           {/* Section: Main */}
           <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Discover</h3>
             <button onClick={() => navigateTo('home')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors">
               <Layers className="w-4 h-4" /> Home / Feed
             </button>
           </div>

           {/* Section: Taxonomy - Music Directors */}
           <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Music Directors</h3>
             <div className="space-y-1">
               {DIRECTORS.map(d => (
                 <button key={d.id} onClick={() => navigateTo('music-director', d.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                   <Music className="w-3 h-3 text-gray-400" /> {d.name}
                 </button>
               ))}
             </div>
           </div>

           {/* Section: Taxonomy - Actors (New) */}
           <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Actors / Stars</h3>
             <div className="space-y-1">
               {ACTORS.map(a => (
                 <button key={a.id} onClick={() => navigateTo('actor', a.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                   <User className="w-3 h-3 text-gray-400" /> {a.name}
                 </button>
               ))}
             </div>
           </div>

           {/* Section: Taxonomy - Singers */}
           <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Singers</h3>
             <div className="space-y-1">
               {SINGERS.slice(0,4).map(s => (
                 <button key={s.id} onClick={() => navigateTo('singer', s.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                   <Mic className="w-3 h-3 text-gray-400" /> {s.name}
                 </button>
               ))}
               <button className="px-8 text-xs text-orange-600 hover:underline pt-1">View All Singers</button>
             </div>
           </div>

           {/* Section: Taxonomy - Moods */}
           <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Moods</h3>
             <div className="flex flex-wrap gap-2 px-2">
               {MOODS.map(m => (
                 <button key={m.id} onClick={() => navigateTo('mood', m.id)} className={`text-xs px-2 py-1 rounded border ${m.color.replace('text-', 'border-').replace('100', '200')} bg-white`}>
                   {m.name}
                 </button>
               ))}
             </div>
           </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-64 min-w-0 flex flex-col min-h-screen">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200 h-16 px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-600"><Menu/></button>
             {/* Back Button logic */}
             {viewStack.length > 1 && (
               <button onClick={goBack} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                 <ArrowLeft className="w-4 h-4" /> Back
               </button>
             )}
           </div>

           <div className="flex-1 max-w-lg mx-6 relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search for movies, artists, or songs..." className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
           </div>

           <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-200">
             T
           </div>
        </header>

        {/* Dynamic Content View */}
        <div className="p-6 md:p-8 flex-1">
          {currentView.type === 'home' && renderHome()}
          {currentView.type === 'movie' && renderMoviePage(currentView.id)}
          {['music-director', 'singer', 'actor', 'mood'].includes(currentView.type) && renderEntityPage(currentView.type, currentView.id)}
        </div>

      </main>

      {/* --- FLOATING PLAYER --- */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-50 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
           <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <img src={MOVIES.find(m => m.id === currentSong.movieId)?.poster} className="w-10 h-10 rounded object-cover bg-gray-200" alt="" />
                 <div>
                    <h4 className="text-sm font-bold text-gray-900">{currentSong.title}</h4>
                    <p className="text-xs text-gray-500">{MOVIES.find(m => m.id === currentSong.movieId)?.title}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                 </button>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                 <Download className="w-4 h-4" /> Download
              </button>
           </div>
        </div>
      )}

    </div>
  );
}

const MovieAutocompleteWidget = {
    name: 'movie-autocomplete',
    controlComponent: TamilRingHub,
    previewComponent: TamilRingHub,
};

export default MovieAutocompleteWidget;
