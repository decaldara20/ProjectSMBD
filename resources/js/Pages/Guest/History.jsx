import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function History({ history }) {

    // --- CONFIG & UTILS --- //
    const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/w154'; // Resolusi pas untuk list (w92 terlalu buram, w154 tajam)

    // Handler Hapus Semua
    const clearHistory = () => {
        if (confirm('Are you sure you want to clear your entire history? This action cannot be undone.')) {
            router.post('/history/clear');
        }
    };

    // Handler Hapus Satu Item
    const removeItem = (id, type) => {
        // Optimistic UI: Bisa ditambah animasi, tapi router reload cukup aman
        router.post('/history/remove', { id, type });
    };

    // Helper Link URL
    const getLink = (item) => {
        switch(item.type) {
            case 'movie': return `/title/${item.id}`;
            case 'tv': return `/tv/${item.id}`;
            case 'person': return `/person/${item.id}`;
            default: return '#';
        }
    };

    // Helper Format Date (e.g., "Oct 24, 2023 at 10:30 PM")
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit' 
        }).format(date);
    };

    // Helper Get Image (Poster or Profile)
    const getImageUrl = (item) => {
        // Prioritas: poster_path (Movie/TV) -> profile_path (Person)
        const path = item.poster_path || item.profile_path;
        return path ? `${TMDB_BASE_URL}${path}` : null;
    };

    return (
        <MainLayout>
            <Head title="Watch History" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen bg-[#121212] selection:bg-cyan-500/30 selection:text-cyan-200">
                <div className="w-full max-w-[900px] mx-auto">
                    
                    {/* --- HEADER SECTION --- */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white font-display mb-2 tracking-tight">
                                Watch <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">History</span>
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base font-medium">
                                Timeline of movies and shows you've explored.
                            </p>
                        </div>
                        
                        {history.length > 0 && (
                            <button 
                                onClick={clearHistory}
                                className="group relative px-5 py-2.5 rounded-xl overflow-hidden bg-red-500/5 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">delete_sweep</span> 
                                    Clear History
                                </div>
                            </button>
                        )}
                    </div>

                    {/* --- HISTORY LIST --- */}
                    {history.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {history.map((item, index) => {
                                const imageUrl = getImageUrl(item);
                                const itemLink = getLink(item);
                                const rating = item.rating ? Number(item.rating).toFixed(1) : null;

                                return (
                                    <div 
                                        key={`${item.id}-${index}`} 
                                        className="group relative flex items-center gap-4 p-3 bg-[#181818] hover:bg-[#1E1E1E] rounded-2xl border border-white/5 hover:border-cyan-500/30 shadow-lg hover:shadow-cyan-900/10 transition-all duration-300 ease-out"
                                    >
                                        {/* 1. POSTER IMAGE */}
                                        <Link href={itemLink} className="relative shrink-0 w-[60px] h-[90px] sm:w-[70px] sm:h-[105px] rounded-lg overflow-hidden bg-gray-900 shadow-md border border-white/5 group-hover:border-white/20 transition-colors">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={item.title || item.name} 
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                // Fallback Placeholder (Gradient)
                                                <div className={`w-full h-full flex items-center justify-center ${
                                                    item.type === 'movie' ? 'bg-linear-to-br from-cyan-900 to-blue-900' : 
                                                    item.type === 'tv' ? 'bg-linear-to-br from-purple-900 to-pink-900' : 'bg-gray-800'
                                                }`}>
                                                    <span className="material-symbols-outlined text-white/30 text-2xl">
                                                        {item.type === 'movie' ? 'movie' : item.type === 'tv' ? 'tv' : 'person'}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Type Badge Overlay (Mobile Friendly) */}
                                            <div className={`absolute bottom-0 inset-x-0 h-0.5 ${
                                                item.type === 'movie' ? 'bg-cyan-500' : 
                                                item.type === 'tv' ? 'bg-purple-500' : 'bg-gray-500'
                                            }`}></div>
                                        </Link>

                                        {/* 2. CONTENT INFO */}
                                        <div className="flex-1 min-w-0 py-1">
                                            {/* Top Meta: Type & Date */}
                                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                                    item.type === 'movie' 
                                                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
                                                        : item.type === 'tv'
                                                        ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                                                        : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                                                }`}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    {formatDate(item.timestamp)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <Link href={itemLink} className="block group-hover:translate-x-1 transition-transform duration-300">
                                                <h3 className="font-bold text-base sm:text-lg text-gray-200 group-hover:text-white truncate leading-tight">
                                                    {item.title || item.name}
                                                </h3>
                                            </Link>

                                            {/* Bottom Meta: Year & Rating */}
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {item.year && (
                                                    <span className="text-xs text-gray-400 font-medium">{item.year}</span>
                                                )}
                                                
                                                {/* Separator Dot if both exist */}
                                                {item.year && rating && <span className="text-[10px] text-gray-600">•</span>}

                                                {/* Rating Badge */}
                                                {rating && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px] text-yellow-500 filled">star</span>
                                                        <span className={`text-xs font-bold ${Number(rating) >= 7 ? 'text-green-400' : 'text-gray-300'}`}>
                                                            {rating}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. ACTIONS */}
                                        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/5">
                                            {/* View Button (Desktop) */}
                                            <Link 
                                                href={itemLink}
                                                className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                                title="View Details"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                            </Link>

                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => removeItem(item.id, item.type)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                                                title="Remove from history"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">close</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // --- EMPTY STATE ---
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                                <div className="relative w-20 h-20 bg-[#1A1A1A] border border-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-600">history_toggle_off</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No history found</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                Movies and TV shows you explore will automatically appear here.
                            </p>
                            <Link 
                                href="/" 
                                className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <span>Start Exploring</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}