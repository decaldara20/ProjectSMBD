import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function GenreIndex({ genres, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // 1. Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/genres', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // Helper: Generate warna gradient unik berdasarkan nama genre (agar konsisten)
    const getGenreGradient = (name) => {
        const gradients = [
            'from-yellow-500/20 to-orange-500/5 border-yellow-500/20 text-yellow-500',
            'from-purple-500/20 to-pink-500/5 border-purple-500/20 text-purple-500',
            'from-blue-500/20 to-cyan-500/5 border-blue-500/20 text-blue-500',
            'from-emerald-500/20 to-teal-500/5 border-emerald-500/20 text-emerald-500',
            'from-red-500/20 to-rose-500/5 border-red-500/20 text-red-500',
            'from-indigo-500/20 to-violet-500/5 border-indigo-500/20 text-indigo-500',
        ];
        // Pilih warna berdasarkan panjang nama agar "Action" selalu warna sama
        const index = name.length % gradients.length;
        return gradients[index];
    };

    return (
        <DashboardLayout>
            <Head title="Manage Genres" />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">Master Classification</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Genre <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">Tags</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-xl">
                            Categorize content across {genres.total.toLocaleString('id-ID')} different genres. Monitor popularity and ratings per category.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-yellow-400 material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search genre..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all shadow-inner text-sm"
                            />
                        </div>
                        <button className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 whitespace-nowrap">
                            <span className="material-symbols-outlined text-xl">category</span> 
                            <span className="hidden md:inline">Add Genre</span>
                        </button>
                    </div>
                </div>

                {/* --- GENRE CARDS --- */}
                {genres.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {genres.data.map((genre) => {
                            const style = getGenreGradient(genre.genre_name);
                            
                            return (
                                <div key={genre.genre_type_id} className={`group relative bg-[#121212] border rounded-2xl p-5 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${style.split(' ')[2]}`}> {/* Ambil class border dari string style */}
                                    
                                    {/* Gradient Background Overlay */}
                                    <div className={`absolute inset-0 bg-linear-to-br ${style.split(' ').slice(0, 2).join(' ')} opacity-50 group-hover:opacity-70 transition-opacity`}></div>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 rounded-lg bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
                                                <span className="font-bold text-lg select-none">
                                                    {genre.genre_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <button className="text-white/50 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-xl font-black text-white tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left">
                                                {genre.genre_name}
                                            </h3>
                                            <p className="text-[10px] text-white/60 font-mono uppercase tracking-wider">
                                                ID: {genre.genre_type_id}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[9px] text-white/50 uppercase mb-0.5">Total Titles</p>
                                                <p className="text-sm font-bold text-white">
                                                    {genre.total_titles.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-white/50 uppercase mb-0.5">Avg Rating</p>
                                                <div className="flex items-center justify-end gap-1 text-white font-bold text-sm">
                                                    {Number(genre.avg_rating).toFixed(1)}
                                                    <span className="material-symbols-outlined text-[10px] filled">star</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div className="bg-[#121212] rounded-2xl border border-white/5 p-12 text-center border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl opacity-30 text-yellow-500">filter_none</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300">No Genres Found</h3>
                        <p className="text-gray-500 text-sm mt-2">Try checking your spelling or add a new category.</p>
                        <button 
                            onClick={() => { setSearch(''); router.get('/production/genres'); }}
                            className="mt-6 text-xs font-bold text-yellow-500 hover:text-yellow-400 uppercase tracking-widest"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {genres.data.length > 0 && (
                    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-gray-500 font-mono">
                            Showing <span className="text-white font-bold">{genres.from}</span> - <span className="text-white font-bold">{genres.to}</span> of <span className="text-white font-bold">{genres.total.toLocaleString('id-ID')}</span> genres
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {genres.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/30' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`} 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                    />
                                ) : (
                                    <span 
                                        key={i} 
                                        className="px-3 py-1.5 text-xs text-gray-700 cursor-not-allowed opacity-30 whitespace-nowrap" 
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    ></span>
                                )
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}