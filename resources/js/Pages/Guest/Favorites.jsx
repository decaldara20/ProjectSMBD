import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Favorites({ favorites }) {

    // --- CONFIG ---
    // Gunakan w342 agar gambar tajam di Grid
    const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w342';

    // Handler Hapus (Unfavorite)
    const removeFavorite = (id, type) => {
        router.post('/favorites/toggle', { id, type }, {
            preserveScroll: true
        });
    };

    // Helper Link
    const getLink = (item) => {
        if (item.type === 'movie') return `/title/${item.id}`;
        if (item.type === 'tv') return `/tv/${item.id}`;
        return '#';
    };

    // Helper Image
    const getPoster = (item) => {
        return item.poster_path ? `${TMDB_IMAGE_URL}${item.poster_path}` : null;
    };

    return (
        <MainLayout>
            <Head title="My Favorites" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen bg-[#121212] selection:bg-pink-500/30 selection:text-pink-200">
                <div className="w-full max-w-[1200px] mx-auto">
                    
                    {/* --- HEADER --- */}
                    <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white font-display mb-2 tracking-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Collection</span>
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base font-medium">
                                The movies and shows you love the most.
                            </p>
                        </div>
                        
                        {/* Counter Badge */}
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            {favorites.length} Items Saved
                        </div>
                    </div>

                    {/* --- GRID CONTENT --- */}
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                            {favorites.map((item, index) => {
                                const posterSrc = getPoster(item);
                                const rating = item.rating ? Number(item.rating).toFixed(1) : null;

                                return (
                                    <div key={`${item.id}-${index}`} className="group relative flex flex-col h-full">
                                        
                                        {/* 1. CARD IMAGE */}
                                        <Link 
                                            href={getLink(item)} 
                                            className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 shadow-xl border border-white/5 group-hover:border-pink-500/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] group-hover:-translate-y-2"
                                        >
                                            {/* Poster */}
                                            {posterSrc ? (
                                                <img 
                                                    src={posterSrc} 
                                                    alt={item.title} 
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                // Fallback Gradient (Jika poster_path null)
                                                <div className={`w-full h-full flex items-center justify-center ${
                                                    item.type === 'movie' ? 'bg-gradient-to-br from-cyan-900 to-blue-900' : 'bg-gradient-to-br from-purple-900 to-pink-900'
                                                }`}>
                                                    <span className="material-symbols-outlined text-4xl text-white/20">
                                                        {item.type === 'movie' ? 'movie' : 'tv'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    removeFavorite(item.id, item.type);
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-pink-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                                                title="Remove from favorites"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>

                                            {/* Rating Badge */}
                                            {rating && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px] text-yellow-500 filled">star</span>
                                                    <span className="text-[10px] font-bold text-white">{rating}</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* 2. INFO SECTION */}
                                        <div className="mt-3 px-1">
                                            {/* Meta Type & Year */}
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                    item.type === 'movie' 
                                                    ? 'text-cyan-400 bg-cyan-900/30 border border-cyan-500/20' 
                                                    : 'text-purple-400 bg-purple-900/30 border border-purple-500/20'
                                                }`}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    {item.year || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <Link href={getLink(item)} className="block group/text">
                                                <h3 className="text-gray-200 group-hover/text:text-pink-500 font-bold text-sm sm:text-base leading-snug line-clamp-2 transition-colors duration-300">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // --- EMPTY STATE ---
                        <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"></div>
                                <span className="relative material-symbols-outlined text-7xl text-gray-700">favorite</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">No Favorites Yet</h3>
                            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
                                Save movies and TV shows you love to create your personal collection.
                            </p>
                            <Link 
                                href="/" 
                                className="px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                            >
                                Browse Content
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}