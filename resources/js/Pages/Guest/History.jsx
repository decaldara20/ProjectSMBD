import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function History({ history }) {

    // Handler Hapus Semua
    const clearHistory = () => {
        if (confirm('Are you sure you want to clear your entire history?')) {
            router.post('/history/clear');
        }
    };

    // Handler Hapus Satu Item
    const removeItem = (id, type) => {
        router.post('/history/remove', { id, type });
    };

    // Helper Link URL
    const getLink = (item) => {
        if (item.type === 'movie') return `/title/${item.id}`;
        if (item.type === 'tv') return `/tv/${item.id}`;
        if (item.type === 'person') return `/person/${item.id}`;
        return '#';
    };

    return (
        <MainLayout>
            <Head title="Watch History" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1000px] mx-auto">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white font-display mb-1">
                                Watch <span className="text-cyan-500">History</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Keep track of what you've discovered recently.
                            </p>
                        </div>
                        
                        {history.length > 0 && (
                            <button 
                                onClick={clearHistory}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span> Clear All
                            </button>
                        )}
                    </div>

                    {/* Content List */}
                    {history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((item, index) => (
                                <div 
                                    key={`${item.id}-${index}`} 
                                    className="group flex items-center gap-4 p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 transition-all shadow-sm hover:shadow-md"
                                >
                                    {/* Icon Tipe */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                                        item.type === 'movie' ? 'bg-cyan-600' : 
                                        item.type === 'tv' ? 'bg-purple-600' : 'bg-pink-600'
                                    }`}>
                                        <span className="material-symbols-outlined">
                                            {item.type === 'movie' ? 'movie' : item.type === 'tv' ? 'tv' : 'person'}
                                        </span>
                                    </div>

                                    {/* Info Text */}
                                    <Link href={getLink(item)} className="flex-1 hover:text-cyan-500 transition-colors">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                                            {item.title || item.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span className="uppercase tracking-wider font-semibold">{item.type}</span>
                                            {item.year && <span>• {item.year}</span>}
                                            {item.rating && (
                                                <span className="flex items-center gap-1 text-yellow-500">
                                                    <i className="fas fa-star text-[10px]"></i> {item.rating}
                                                </span>
                                            )}
                                            <span className="text-gray-600 dark:text-gray-500">• Viewed {new Date(item.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </Link>

                                    {/* Action Button */}
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href={getLink(item)}
                                            className="hidden sm:flex px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-cyan-500 hover:text-white transition-colors"
                                        >
                                            View Again
                                        </Link>
                                        <button 
                                            onClick={() => removeItem(item.id, item.type)}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all"
                                            title="Remove from history"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">history_toggle_off</span>
                            <p className="text-xl font-bold text-gray-400">No history found</p>
                            <p className="text-sm text-gray-500">Start exploring to build your watch history.</p>
                            <Link href="/" className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all">
                                Explore Now
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}