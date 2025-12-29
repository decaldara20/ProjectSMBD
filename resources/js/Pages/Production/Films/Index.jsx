import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function FilmIndex({ films, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    // Filter Type dihapus karena permintaan (hanya menampilkan semua / default dari controller)

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                // Hapus parameter 'type' dari router.get karena sudah tidak dipakai di UI
                router.get('/production/films', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // Helper: Format Durasi
    const formatRuntime = (mins) => {
        if (!mins || mins === '\\N') return '-';
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    // Helper: Warna Rating
    const getRatingColor = (rating) => {
        if (!rating) return 'text-gray-600';
        if (rating >= 8.0) return 'text-emerald-400';
        if (rating >= 6.0) return 'text-yellow-400';
        return 'text-rose-400';
    };

    // Helper: Badge Style (Tetap ada untuk menampilkan tipe di tabel)
    const getTypeBadge = (t) => {
        const typeMap = {
            movie: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            tvSeries: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            tvEpisode: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
            videoGame: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            short: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        };
        return typeMap[t] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <DashboardLayout>
            <Head title="Content Registry" />

            <div className="space-y-6 pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">SQL Master Database</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Content <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">Registry</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                            Centralized database for all {films.total.toLocaleString('id-ID')} assets. Manage metadata for Movies, TV Shows, Games, and Shorts.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        
                        {/* 1. Search Bar (Sekarang mengambil lebar penuh/flex-1 karena dropdown hilang) */}
                        <div className="relative group flex-1 sm:w-80">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-blue-400 material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search by title or ID..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner text-sm"
                            />
                        </div>

                        {/* 2. Add Button (Read Only Mode: Disabled/Removed or Keep if needed) */}
                        {/* Sesuai request sebelumnya "Global Mode Read Only", tombol ini bisa dihilangkan. 
                            Tapi jika Anda ingin membiarkannya untuk navigasi ke form create (meski nanti diblokir di backend), biarkan saja.
                            Jika ingin benar-benar Read Only, hapus block <Link> ini. */}
                        
                        {/* <Link href="/production/movies/create" className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
                            <span className="material-symbols-outlined text-xl">add_box</span> 
                            <span className="whitespace-nowrap">New Entry</span>
                        </Link> */}
                        
                        {/* Tombol Info Global (Pengganti Add Button) */}
                        <div className="bg-white/5 border border-white/10 text-gray-400 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-default select-none">
                            <span className="material-symbols-outlined text-lg">public</span>
                            <span className="whitespace-nowrap text-xs uppercase tracking-wider">Global View</span>
                        </div>

                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative flex flex-col min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b border-white/5 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Title Metadata</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Genres</th>
                                    <th className="px-6 py-4 text-center">Runtime</th>
                                    <th className="px-6 py-4 text-center">Rating</th>
                                    <th className="px-6 py-4 text-right">Market Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {films.data.length > 0 ? (
                                    films.data.map((film) => (
                                        <tr key={film.tconst} className="hover:bg-white/0.02 transition-colors group">
                                            
                                            {/* Column 1: Title & ID */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#222] border border-white/5 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors shrink-0">
                                                        {film.primaryTitle.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors truncate max-w-[280px]" title={film.primaryTitle}>
                                                            {film.primaryTitle}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-1.5 rounded border border-white/5">
                                                                {film.tconst}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-mono border-l border-white/10 pl-2">
                                                                {film.startYear || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Type */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getTypeBadge(film.titleType)}`}>
                                                    {film.titleType}
                                                </span>
                                            </td>

                                            {/* Column 3: Genres */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {film.genres && film.genres !== '\\N' ? (
                                                        film.genres.split(',').slice(0, 2).map((genre, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1A1A1A] text-gray-400 border border-white/5">
                                                                {genre.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-700 text-xs italic">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 4: Runtime */}
                                            <td className="px-6 py-4 text-center font-mono text-gray-400">
                                                {formatRuntime(film.runtimeMinutes)}
                                            </td>

                                            {/* Column 5: Rating */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`flex items-center gap-1 font-bold font-mono text-base ${getRatingColor(film.averageRating)}`}>
                                                        {film.averageRating ? Number(film.averageRating).toFixed(1) : '-'}
                                                        <span className="material-symbols-outlined text-sm filled">star</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 6: Market Data (Votes) - Ganti Actions Edit/Delete dengan Info */}
                                            <td className="px-6 py-4 text-right">
                                                {film.numVotes > 0 ? (
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-white/5 px-2 py-1 rounded-lg inline-block border border-white/5">
                                                        {Number(film.numVotes).toLocaleString('id-ID')} Votes
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-700 uppercase">No Data</span>
                                                )}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <span className="material-symbols-outlined text-4xl opacity-30">database</span>
                                                </div>
                                                <p className="font-bold text-gray-300 text-lg">No records found</p>
                                                <p className="text-sm text-gray-600 mt-1 max-w-xs">
                                                    Try adjusting your search query.
                                                </p>
                                                <button 
                                                    onClick={() => { setSearch(''); router.get('/production/films'); }}
                                                    className="mt-6 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                                                >
                                                    Clear Search
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className="p-4 border-t border-white/5 bg-[#161616] flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 z-10">
                        <div className="text-xs text-gray-500 font-mono">
                            Showing <span className="text-white">{films.from || 0}</span> - <span className="text-white">{films.to || 0}</span> of <span className="text-white">{films.total.toLocaleString('id-ID')}</span> assets
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {films.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
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
                </div>
            </div>
        </DashboardLayout>
    );
}