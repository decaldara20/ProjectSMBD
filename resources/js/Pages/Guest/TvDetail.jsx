import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function TvDetail({ title }) {
    // --- FAVORITE LOGIC ---
    const { auth = { user: null }, favorites = [] } = usePage().props;
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        // Cek apakah TV Show ini sudah ada di favorit user
        // Note: Pastikan di database ID TV disimpan konsisten (show_id atau tconst)
        const checkFav = favorites.some(fav => fav.id == title.show_id || fav.id == title.tconst);
        setIsFavorited(checkFav);
    }, [favorites, title]);

    const handleToggleFavorite = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsFavorited(!isFavorited); // Optimistic UI

        router.post('/favorites/toggle', {
            id: title.show_id || title.tconst, // Prioritaskan show_id untuk TV
            type: 'tv',
            title: title.primaryTitle,
            year: title.startYear,
            rating: title.averageRating
        }, {
            preserveScroll: true,
            onError: () => setIsFavorited(!isFavorited)
        });
    };

    // --- TMDB DATA ---
    const [tmdbData, setTmdbData] = useState({
        image: null,
        backdrop: null,
        trailer: null,
        overview: null,
        cast: [],
        numberOfSeasons: 0,
        numberOfEpisodes: 0,
        status: ''
    });

    useEffect(() => {
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
        
        if (title) {
            // Cek ID (Angka vs String 'tt...')
            // Jika ID Angka -> Tembak endpoint TV langsung
            // Jika String -> Tembak Find
            const id = title.show_id || title.tconst;
            let url = '';
            
            if (!isNaN(id) && !id.toString().startsWith('tt')) {
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;
            } else {
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }
            
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    // Logic Data Parsing
                    let result = null;
                    let detail = null;

                    if (!isNaN(id) && !id.toString().startsWith('tt')) {
                        // Direct TV Endpoint
                        result = data; // Data langsung detail
                        detail = data;
                    } else {
                        // Find Endpoint
                        result = data.tv_results?.[0];
                        if (result) {
                            // Fetch Detail lagi kalau dari Find
                            return fetch(`https://api.themoviedb.org/3/tv/${result.id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`)
                                .then(r2 => r2.json());
                        }
                    }
                    return detail || result; 
                })
                .then(detail => {
                    if (detail) {
                        const trailerVideo = detail.videos?.results?.find(
                            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
                        );

                        setTmdbData({
                            image: detail.poster_path,
                            backdrop: detail.backdrop_path,
                            trailer: trailerVideo ? `https://www.youtube.com/embed/${trailerVideo.key}` : null,
                            overview: detail.overview,
                            cast: detail.credits?.cast?.slice(0, 6) || [],
                            numberOfSeasons: detail.number_of_seasons,
                            numberOfEpisodes: detail.number_of_episodes,
                            status: detail.status
                        });
                    }
                })
                .catch(err => console.error(err));
        }
    }, [title]);

    return (
        <MainLayout>
            <Head title={title.primaryTitle} />

            {/* --- HERO BACKDROP --- */}
            <div className="relative w-full h-[60vh] md:h-[80vh] flex items-end">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                    style={{ 
                        backgroundImage: `url(${tmdbData.backdrop ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop}` : '/images/hero-bg.png'})` 
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/40 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 md:pb-20 flex flex-col md:flex-row gap-8 items-end">
                    
                    {/* POSTER CARD */}
                    <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10 shrink-0 transform hover:scale-105 transition-transform duration-500">
                        <img 
                            src={tmdbData.image ? `https://image.tmdb.org/t/p/w500${tmdbData.image}` : 'https://via.placeholder.com/300x450?text=No+Image'} 
                            alt={title.primaryTitle} 
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* INFO TEXT */}
                    <div className="flex-1 text-white animate-fade-in-up">
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-bold tracking-wider uppercase mb-2">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <span>TV Series</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none text-transparent bg-clip-text bg-linear-to-r from-white to-purple-300">
                            {title.primaryTitle}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6 font-mono">
                            <span className="flex items-center gap-1 text-yellow-400">
                                <span className="material-symbols-outlined text-lg fill-1">star</span> 
                                <span className="text-white text-2xl font-bold">
                                    {title.averageRating ? Number(title.averageRating).toFixed(1) : 'N/A'}
                                </span>
                            </span>
                            <span className="px-2 py-0.5 border border-white/20 rounded text-xs">{title.startYear}</span>
                            
                            {tmdbData.numberOfSeasons > 0 && (
                                <span className="text-gray-400">
                                    {tmdbData.numberOfSeasons} Seasons • {tmdbData.numberOfEpisodes} Eps
                                </span>
                            )}

                            {title.genres && (
                                <span className="text-purple-400 font-medium">
                                    {title.genres.replace(/,/g, ' • ')}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {tmdbData.trailer && (
                                <a 
                                    href="#trailer" 
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center gap-2 hover:scale-105"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Watch Trailer
                                </a>
                            )}
                            
                            {/* TOMBOL FAVORITE (DYNAMIC) */}
                            <button 
                                onClick={handleToggleFavorite}
                                className={`px-8 py-3 border font-bold rounded-full transition-all backdrop-blur-sm flex items-center gap-2 group ${
                                    isFavorited 
                                    ? 'bg-pink-600/20 border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <span className={`material-symbols-outlined transition-transform duration-300 ${isFavorited ? 'fill-1 scale-110' : 'group-hover:scale-110'}`}>
                                    {isFavorited ? 'favorite' : 'favorite_border'}
                                </span>
                                {isFavorited ? 'Favorited' : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            {/* ... (SAMA SEPERTI SEBELUMNYA) ... */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-purple-500 pl-4">Synopsis</h3>
                        <p className="text-gray-300 leading-relaxed text-lg text-justify">
                            {tmdbData.overview || "No overview available for this TV show."}
                        </p>
                    </section>

                    {tmdbData.trailer && (
                        <section id="trailer" className="scroll-mt-24">
                            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">Official Trailer</h3>
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                                <iframe 
                                    src={tmdbData.trailer}
                                    title="YouTube video player"
                                    className="absolute inset-0 w-full h-full"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </section>
                    )}

                    {tmdbData.cast.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-pink-500 pl-4">Series Cast</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {tmdbData.cast.map(actor => (
                                    <div key={actor.id} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all group">
                                        <div className="aspect-2/3 overflow-hidden">
                                            <img 
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Img'} 
                                                alt={actor.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-white font-bold text-sm truncate">{actor.name}</p>
                                            <p className="text-gray-500 text-xs truncate">{actor.character}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* SIDE INFO */}
                <div className="space-y-8">
                    <div className="bg-[#1A1A1A]/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 sticky top-24">
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-500">info</span> 
                            Show Details
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-gray-500 text-sm">Status</span>
                                <span className="text-white text-sm font-medium">{tmdbData.status || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-gray-500 text-sm">First Air Year</span>
                                <span className="text-white text-sm font-medium">{title.startYear}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-gray-500 text-sm">Votes</span>
                                <span className="text-white text-sm font-medium">{parseInt(title.numVotes).toLocaleString()}</span>
                            </div>
                            
                            <div className="pt-4">
                                <p className="text-gray-500 text-xs mb-2">Genres</p>
                                <div className="flex flex-wrap gap-2">
                                    {title.genres && title.genres.split(',').map(g => (
                                        <span key={g} className="px-3 py-1 bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 border border-white/10 rounded-full text-xs transition-colors cursor-default">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}