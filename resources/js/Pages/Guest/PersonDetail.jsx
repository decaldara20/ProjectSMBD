import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function PersonDetail({ person }) {
    // --- 1. GLOBAL STATE ---
    const { auth = { user: null }, favorites = [] } = usePage().props;
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const checkFav = favorites.some(fav => fav.id === person.nconst);
        setIsFavorited(checkFav);
    }, [favorites, person]);

    const handleToggleFavorite = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        setIsFavorited(!isFavorited);
        router.post('/favorites/toggle', {
            id: person.nconst,
            type: 'person',
            title: person.primaryName,
            year: person.birthYear,
            rating: null
        }, {
            preserveScroll: true,
            onError: () => setIsFavorited(!isFavorited)
        });
    };

    // --- 2. TMDB STATE ---
    const [tmdbData, setTmdbData] = useState({
        image: null,
        biography: '',
        birthday: '-',
        place_of_birth: '-',
        known_for_department: '-',
        gender: '-',
        popularity: 0,
        credits: []
    });

    const [isBioExpanded, setIsBioExpanded] = useState(false);

    // --- 3. FETCH DATA ---
    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        
        if (person && person.nconst) {
            fetch(`https://api.themoviedb.org/3/find/${person.nconst}?api_key=${TMDB_KEY}&external_source=imdb_id`)
                .then(r => r.json())
                .then(data => {
                    const result = data.person_results?.[0];
                    if (result) {
                        fetch(`https://api.themoviedb.org/3/person/${result.id}?api_key=${TMDB_KEY}&append_to_response=combined_credits`)
                            .then(r2 => r2.json())
                            .then(detail => {
                                const sortedCredits = detail.combined_credits?.cast
                                    ?.sort((a, b) => b.vote_count - a.vote_count)
                                    ?.slice(0, 12) || []; // Ambil 12 teratas biar grid penuh

                                setTmdbData({
                                    image: detail.profile_path,
                                    biography: detail.biography || "Biography currently unavailable.",
                                    birthday: detail.birthday,
                                    place_of_birth: detail.place_of_birth,
                                    known_for_department: detail.known_for_department,
                                    gender: detail.gender === 1 ? 'Female' : detail.gender === 2 ? 'Male' : '-',
                                    popularity: detail.popularity,
                                    credits: sortedCredits
                                });
                            });
                    }
                })
                .catch(err => console.error(err));
        }
    }, [person]);

    return (
        <MainLayout>
            <Head title={person.primaryName} />

            <div className="relative w-full min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
                
                {/* --- 1. HERO BANNER (BLURRED BACKDROP) --- */}
                {/* Menggunakan foto profil yang diblur/zoom sebagai background */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] z-10"></div>
                    {tmdbData.image && (
                        <img 
                            src={`https://image.tmdb.org/t/p/original${tmdbData.image}`} 
                            className="w-full h-full object-cover blur-3xl scale-110" 
                            alt="Backdrop"
                        />
                    )}
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col md:flex-row gap-12">
                    
                    {/* --- LEFT: PROFILE CARD --- */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Profile Image */}
                            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1A1A1A] aspect-2/3">
                                <img 
                                    src={tmdbData.image ? `https://image.tmdb.org/t/p/h632${tmdbData.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.primaryName)}&size=500&background=random`} 
                                    alt={person.primaryName} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Personal Info Grid */}
                            <div className="bg-[#151515] rounded-2xl p-6 border border-white/5 space-y-4 shadow-lg">
                                <h3 className="text-white font-bold border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-pink-500">person</span> Personal Info
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4 text-sm">
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Known For</span>
                                        <span className="text-white bg-pink-500/10 px-2 py-1 rounded text-xs border border-pink-500/20 text-pink-400">
                                            {tmdbData.known_for_department}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Gender</span>
                                        <span className="text-gray-300">{tmdbData.gender}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Birthday</span>
                                        <span className="text-gray-300">{tmdbData.birthday || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Place of Birth</span>
                                        <span className="text-gray-300 leading-snug">{tmdbData.place_of_birth || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={handleToggleFavorite}
                                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-1 ${
                                    isFavorited 
                                    ? 'bg-pink-600 text-white shadow-pink-500/30' 
                                    : 'bg-white text-black hover:bg-gray-200'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${isFavorited ? 'fill-1' : ''}`}>favorite</span>
                                {isFavorited ? 'Followed' : 'Follow Artist'}
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT: CONTENT --- */}
                    <div className="flex-1 min-w-0">
                        
                        {/* Header Name & Stats */}
                        <div className="mb-10">
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-lg">
                                {person.primaryName}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400 border-b border-white/10 pb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                    {person.primaryProfession ? person.primaryProfession.replace(/_/g, ', ').toUpperCase() : 'ARTIST'}
                                </div>
                                <div className="hidden md:block w-px h-4 bg-white/20"></div>
                                <div>
                                    {person.birthYear} {person.deathYear ? `- ${person.deathYear}` : ''}
                                </div>
                                <div className="hidden md:block w-px h-4 bg-white/20"></div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="material-symbols-outlined text-base">trending_up</span>
                                    <span className="text-white">{tmdbData.popularity.toFixed(0)} Popularity</span>
                                </div>
                            </div>
                        </div>

                        {/* Biography */}
                        <section className="mb-12">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                Biography
                            </h3>
                            <div className="text-gray-300 leading-relaxed text-lg space-y-4">
                                {tmdbData.biography.length > 500 && !isBioExpanded ? (
                                    <>
                                        <p>{tmdbData.biography.slice(0, 500)}...</p>
                                        <button 
                                            onClick={() => setIsBioExpanded(true)}
                                            className="text-pink-500 font-bold hover:text-pink-400 flex items-center gap-1 text-sm mt-2 transition-colors"
                                        >
                                            Read Full Bio <i className="fas fa-arrow-right"></i>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="whitespace-pre-line">{tmdbData.biography}</p>
                                        {tmdbData.biography.length > 500 && (
                                            <button 
                                                onClick={() => setIsBioExpanded(false)}
                                                className="text-pink-500 font-bold hover:text-pink-400 flex items-center gap-1 text-sm mt-4"
                                            >
                                                Show Less <i className="fas fa-arrow-up"></i>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Known For (Filmography) */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Known For
                                    <span className="text-sm font-normal text-gray-500 ml-2 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                        {tmdbData.credits.length} Top Works
                                    </span>
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {tmdbData.credits.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        href={item.media_type === 'tv' ? `/tv/tt${item.id}` : `/title/tt${item.id}`} // Fallback link
                                        className="group relative bg-[#181818] rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-pink-500/10 flex flex-col h-full"
                                    >
                                        {/* Poster */}
                                        <div className="aspect-2/3 overflow-hidden bg-[#222] relative w-full">
                                            {item.poster_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} 
                                                    alt={item.title || item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 p-4 text-center">
                                                    <span className="material-symbols-outlined text-3xl mb-2">movie</span>
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            )}
                                            
                                            {/* Rating Badge */}
                                            {item.vote_average > 0 && (
                                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-yellow-400 font-bold border border-white/10 flex items-center gap-1 shadow-lg">
                                                    <i className="fas fa-star text-[8px]"></i> {item.vote_average.toFixed(1)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-3 flex flex-col flex-1 justify-between bg-[#181818]">
                                            <div>
                                                <h4 className="text-gray-200 text-sm font-bold line-clamp-2 leading-snug group-hover:text-pink-500 transition-colors mb-1">
                                                    {item.title || item.name}
                                                </h4>
                                                <p className="text-gray-500 text-xs truncate">
                                                    {item.character ? `as ${item.character}` : (item.job || 'Cast')}
                                                </p>
                                            </div>
                                            
                                            {item.release_date || item.first_air_date ? (
                                                <p className="text-[10px] text-gray-600 mt-2 font-mono">
                                                    {(item.release_date || item.first_air_date).substring(0, 4)}
                                                </p>
                                            ) : null}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            {tmdbData.credits.length === 0 && (
                                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-gray-500">No filmography data available.</p>
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}