import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

// --- KOMPONEN KARTU HASIL PENCARIAN (Internal) ---
const SearchCard = ({ item }) => {
    const [posterUrl, setPosterUrl] = useState(item.poster); // Default dari DB (biasanya placeholder)
    const [isLoading, setIsLoading] = useState(true);

    // Helper Link
    const getLinkHref = () => {
        if (item.type === 'person') return `/person/${item.id}`;
        if (item.type === 'tvSeries') return `/tv/${item.id}`;
        return `/title/${item.id}`;
    };

    // Helper Warna Badge
    const getBadgeColor = (type) => {
        switch (type) {
            case 'movie': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
            case 'tvSeries': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            case 'person': return 'bg-pink-500/20 text-pink-400 border border-pink-500/30';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    // Helper Label
    const getTypeLabel = (type) => {
        switch (type) {
            case 'movie': return 'FILM';
            case 'tvSeries': return 'TV SHOW';
            case 'person': return 'ARTIST';
            default: return 'UNKNOWN';
        }
    };

    // --- FETCH GAMBAR DARI TMDB ---
    useEffect(() => {
        // Hanya fetch jika poster dari DB itu placeholder atau null
        if (!item.poster || item.poster.includes('placehold.co')) {
            const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
            let url = '';

            // Tentukan Endpoint (TV pakai ID angka, Movie/Person pakai Find)
            if (item.type === 'tvSeries' && !isNaN(item.id)) {
                url = `https://api.themoviedb.org/3/tv/${item.id}?api_key=${TMDB_KEY}`;
            } else {
                url = `https://api.themoviedb.org/3/find/${item.id}?api_key=${TMDB_KEY}&external_source=imdb_id`;
            }

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let path = null;
                    if (item.type === 'tvSeries' && !isNaN(item.id)) {
                        path = data.poster_path;
                    } else {
                        if (item.type === 'person') path = data.person_results?.[0]?.profile_path;
                        else if (item.type === 'tvSeries') path = data.tv_results?.[0]?.poster_path;
                        else path = data.movie_results?.[0]?.poster_path;
                    }

                    if (path) {
                        setPosterUrl(`https://image.tmdb.org/t/p/w500${path}`);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [item.id, item.type]);

    return (
        <Link 
            href={getLinkHref()}
            className="group relative flex flex-col h-full bg-[#181818] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2"
        >
            {/* Badge Tipe */}
            <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider z-20 shadow-sm backdrop-blur-md ${getBadgeColor(item.type)}`}>
                {getTypeLabel(item.type)}
            </div>

            {/* Gambar Poster */}
            <div className="relative w-full aspect-2/3 bg-gray-900 overflow-hidden">
                <img 
                    src={posterUrl || `https://via.placeholder.com/300x450?text=${item.type}`} 
                    alt={item.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                />
                
                {/* Overlay Hitam saat Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600 text-3xl">image</span>
                    </div>
                )}
            </div>

            {/* Info Teks */}
            <div className="p-4 flex flex-col flex-1 justify-between bg-[#1A1A1A] relative z-10 border-t border-white/5">
                <div>
                    <h3 className="text-gray-200 text-sm font-bold leading-snug line-clamp-2 group-hover:text-cyan-500 transition-colors mb-2">
                        {item.title || item.name}
                    </h3>
                    
                    {item.type === 'person' ? (
                        <p className="text-xs text-gray-500 italic line-clamp-1">
                            {item.known_for ? `Known for: ${item.known_for}` : 'Artist'}
                        </p>
                    ) : (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{item.startYear || 'N/A'}</span>
                            {item.averageRating && (
                                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                    <i className="fas fa-star text-[10px]"></i> 
                                    {Number(item.averageRating).toFixed(1)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

// --- HALAMAN UTAMA SEARCH RESULTS ---
export default function SearchResults({ results, queryParams }) {
    return (
        <MainLayout>
            <Head title={`Search Results for "${queryParams.q || ''}"`} />

            <div className="pt-32 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen relative bg-[#0a0a0a]">
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-900/10 blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    
                    {/* Header Pencarian */}
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 font-display tracking-tight">
                            Search <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Results</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Found <span className="text-cyan-400 font-bold text-xl mx-1">{results.length}</span> matches for keyword 
                            <span className="text-white font-bold italic ml-2 px-3 py-1 bg-white/10 rounded-full border border-white/5">"{queryParams.q}"</span>
                        </p>
                    </div>

                    {/* Jika Hasil Kosong */}
                    {results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center opacity-70">
                            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                <span className="material-symbols-outlined text-6xl text-gray-500">search_off</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-200 mb-2">No results found</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We couldn't find anything matching your search. Try checking for typos or use different keywords.
                            </p>
                            <Link href="/" className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-cyan-500/40">
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        /* Grid Hasil Pencarian */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {results.map((item, index) => (
                                <SearchCard key={index} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}