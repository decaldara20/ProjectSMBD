import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

// KOMPONEN GAMBAR PENGGANTI (MURNI CSS - TIDAK BUTUH INTERNET)
const ImageFallback = ({ text, icon = "movie" }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#222] text-center select-none p-4">
        <span className="material-symbols-outlined text-5xl text-white/10 mb-2">
            {icon}
        </span>
        <span className="text-xl font-black text-gray-700 uppercase tracking-widest">
            {text ? text.substring(0, 2) : 'NA'}
        </span>
    </div>
);

export default function PersonDetail({ person, filmography }) { 
    const { auth = { user: null }, favorites = [] } = usePage().props;
    const [isFavorited, setIsFavorited] = useState(false);

    // --- STATE ---
    const [tmdbProfile, setTmdbProfile] = useState({
        image: null,
        biography: "Loading details...",
        birthday: '-',
        place_of_birth: '-',
        gender: '-',
        popularity: 0
    });
    
    const [posterMap, setPosterMap] = useState({}); 
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    // 1. SETUP FAVORITE
    useEffect(() => {
        const checkFav = favorites.some(fav => fav.id === person.nconst);
        setIsFavorited(checkFav);
    }, [favorites, person]);

    const handleToggleFavorite = () => {
        if (!auth.user) return router.visit('/login');
        setIsFavorited(!isFavorited);
        router.post('/favorites/toggle', {
            id: person.nconst,
            type: 'person',
            title: person.primaryName,
            year: person.birthYear,
            rating: null
        }, { preserveScroll: true, onError: () => setIsFavorited(!isFavorited) });
    };

    // 2. FETCH TMDB (MAPPING GAMBAR)
    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        
        // Debugging: Cek apakah API Key terbaca
        if (!TMDB_KEY) {
            console.error("❌ TMDB API KEY MISSING! Pastikan ada di file .env");
            setTmdbProfile(prev => ({ ...prev, biography: "API Key Config Error." }));
            return;
        }

        if (person && person.nconst) {
            fetch(`https://api.themoviedb.org/3/find/${person.nconst}?api_key=${TMDB_KEY}&external_source=imdb_id`)
                .then(r => r.json())
                .then(data => {
                    const result = data.person_results?.[0];
                    if (result) {
                        fetch(`https://api.themoviedb.org/3/person/${result.id}?api_key=${TMDB_KEY}&append_to_response=combined_credits`)
                            .then(r2 => r2.json())
                            .then(detail => {
                                setTmdbProfile({
                                    image: detail.profile_path,
                                    biography: detail.biography || "Biography unavailable.",
                                    birthday: detail.birthday,
                                    place_of_birth: detail.place_of_birth,
                                    gender: detail.gender === 1 ? 'Female' : detail.gender === 2 ? 'Male' : '-',
                                    popularity: detail.popularity
                                });

                                // Buat Map Gambar
                                const map = {};
                                if (detail.combined_credits?.cast) {
                                    detail.combined_credits.cast.forEach(work => {
                                        const title = work.title || work.name;
                                        if (title && work.poster_path) {
                                            // Normalisasi Key: lowercase + tanpa simbol
                                            const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
                                            map[cleanTitle] = work.poster_path;
                                        }
                                    });
                                }
                                console.log(`✅ Poster Map Ready: ${Object.keys(map).length} images found.`);
                                setPosterMap(map);
                            });
                    } else {
                        console.warn("⚠️ Person not found in TMDB.");
                        setTmdbProfile(prev => ({ ...prev, biography: "Details not found in external database." }));
                    }
                })
                .catch(err => console.error("❌ TMDB Error:", err));
        }
    }, [person]);

    // Helper: Cari URL Poster
    const getPoster = (originalTitle) => {
        if (!originalTitle) return null;
        const clean = originalTitle.toLowerCase().replace(/[^a-z0-9]/g, ''); 
        if (posterMap[clean]) return `https://image.tmdb.org/t/p/w300${posterMap[clean]}`;
        return null;
    };

    return (
        <MainLayout>
            <Head title={person.primaryName} />

            <div className="relative w-full min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
                
                {/* HERO BANNER */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden opacity-30 pointer-events-none">
                    {/* Menggunakan class standard 'bg-gradient-to-b' (Tailwind v3) agar aman */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] z-10"></div>
                    {tmdbProfile.image && (
                        <img src={`https://image.tmdb.org/t/p/original${tmdbProfile.image}`} className="w-full h-full object-cover blur-3xl scale-110" alt="Backdrop" />
                    )}
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col md:flex-row gap-12">
                    
                    {/* LEFT: PROFILE INFO */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* FOTO PROFIL (CSS Fallback jika null) */}
                            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1A1A1A] bg-[#151515]" style={{ aspectRatio: '2/3' }}>
                                {tmdbProfile.image ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/h632${tmdbProfile.image}`} 
                                        alt={person.primaryName} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageFallback text={person.primaryName} icon="person" />
                                )}
                            </div>

                            <div className="bg-[#151515] rounded-2xl p-6 border border-white/5 space-y-4 shadow-lg">
                                <h3 className="text-white font-bold border-b border-white/10 pb-3 mb-2">Info</h3>
                                <div className="grid grid-cols-1 gap-4 text-sm">
                                    <div><span className="block text-xs text-gray-500 font-bold mb-1">Born</span><span className="text-gray-300">{tmdbProfile.birthday || person.birthYear}</span></div>
                                    <div><span className="block text-xs text-gray-500 font-bold mb-1">From</span><span className="text-gray-300">{tmdbProfile.place_of_birth || '-'}</span></div>
                                </div>
                            </div>
                            <button onClick={handleToggleFavorite} className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${isFavorited ? 'bg-pink-600 text-white' : 'bg-white text-black'}`}>
                                {isFavorited ? 'Followed' : 'Follow Artist'}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-10">
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">{person.primaryName}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400 border-b border-white/10 pb-6">
                                <span>{person.primaryProfession ? person.primaryProfession.replace(/_/g, ', ').toUpperCase() : 'ARTIST'}</span>
                                <div className="hidden md:block w-px h-4 bg-white/20"></div>
                                <span className="text-yellow-500">{tmdbProfile.popularity ? tmdbProfile.popularity.toFixed(0) : 0} Popularity</span>
                            </div>
                        </div>

                        {/* BIO SECTION */}
                        <section className="mb-12">
                            <h3 className="text-2xl font-bold text-white mb-4">Biography</h3>
                            <div className="text-gray-300 leading-relaxed text-lg">
                                <p className="whitespace-pre-line">
                                    {isBioExpanded ? tmdbProfile.biography : (tmdbProfile.biography.slice(0, 500) + (tmdbProfile.biography.length > 500 ? '...' : ''))}
                                </p>
                                {tmdbProfile.biography.length > 500 && (
                                    <button onClick={() => setIsBioExpanded(!isBioExpanded)} className="text-pink-500 font-bold text-sm mt-2 hover:underline">
                                        {isBioExpanded ? 'Show Less' : 'Read Full Bio'}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* --- KNOWN FOR (DATA LOKAL + GAMBAR TMDB) --- */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Known For ({filmography.length} Works)</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {filmography.length > 0 ? filmography.map((item, index) => {
                                    const posterUrl = getPoster(item.primaryTitle);

                                    return (
                                        <Link 
                                            key={index} 
                                            href={`/title/${item.tconst}`} 
                                            className="group relative bg-[#181818] rounded-xl overflow-hidden border border-white/5 hover:border-pink-500/50 transition-all flex flex-col h-full shadow-lg"
                                        >
                                            {/* POSTER IMAGE CONTAINER */}
                                            {/* Gunakan style inline untuk aspect ratio agar tidak kena warning Tailwind */}
                                            <div className="relative w-full bg-[#222] overflow-hidden" style={{ aspectRatio: '2/3' }}>
                                                {posterUrl ? (
                                                    <img 
                                                        src={posterUrl} 
                                                        alt={item.primaryTitle}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    // COMPONENT FALLBACK (CSS ONLY - NO EXTERNAL URL)
                                                    <div className="absolute inset-0">
                                                        <ImageFallback text={item.primaryTitle} icon="movie" />
                                                    </div>
                                                )}

                                                {/* Badge Tahun */}
                                                {item.startYear && (
                                                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white border border-white/10 shadow-md z-10">
                                                        {item.startYear}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 flex flex-col flex-1 justify-end z-10 relative bg-[#181818]">
                                                <h4 className="text-gray-100 text-sm font-bold line-clamp-2 leading-snug group-hover:text-pink-500 transition-colors">
                                                    {item.primaryTitle}
                                                </h4>
                                                <p className="text-gray-500 text-xs mt-1 capitalize border-t border-white/5 pt-2">
                                                    {item.category || 'Cast'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                }) : (
                                    <div className="col-span-full p-10 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                        <p className="text-gray-500">No major filmography found in local database.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}