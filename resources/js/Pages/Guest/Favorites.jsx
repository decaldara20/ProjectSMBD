import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Favorites({ favorites }) {

    // Handler Hapus (Unfavorite)
    const removeFavorite = (id, type) => {
        router.post('/favorites/toggle', { id, type });
    };

    // Helper Link
    const getLink = (item) => {
        if (item.type === 'movie') return `/title/${item.id}`;
        if (item.type === 'tv') return `/tv/${item.id}`;
        return '#';
    };

    return (
        <MainLayout>
            <Head title="My Favorites" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1200px] mx-auto">
                    
                    {/* Header */}
                    <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-display mb-1">
                            My <span className="text-red-500">Favorites</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Your personalized collection of movies and shows.
                        </p>
                    </div>

                    {/* Grid Content */}
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {favorites.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5 flex flex-col h-full">
                                    
                                    {/* Cover Image Placeholder (Bisa diganti image fetcher kalau mau) */}
                                    <Link href={getLink(item)} className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-400 opacity-50">
                                            {item.type === 'movie' ? 'movie' : 'tv'}
                                        </span>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Type Badge */}
                                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${item.type === 'movie' ? 'bg-cyan-600' : 'bg-purple-600'}`}>
                                            {item.type}
                                        </span>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <Link href={getLink(item)} className="hover:text-red-500 transition-colors">
                                                <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm font-bold leading-snug line-clamp-2 mb-1">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {item.year || '-'}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                                <i className="fas fa-star text-[10px]"></i> {item.rating}
                                            </span>
                                            
                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => removeFavorite(item.id, item.type)}
                                                className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
                                                title="Remove from favorites"
                                            >
                                                <i className="fas fa-heart-broken text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">favorite_border</span>
                            <p className="text-xl font-bold text-gray-400">Your list is empty</p>
                            <p className="text-sm text-gray-500">Save movies and shows you love here.</p>
                            <Link href="/" className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all">
                                Discover Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}