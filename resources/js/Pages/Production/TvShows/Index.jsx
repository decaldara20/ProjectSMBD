import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function TvShowIndex({ shows, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // 1. Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/tv-shows', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // 2. Helper: Status Series (Running vs Ended)
    const getSeriesStatus = (start, end) => {
        // Jika endYear kosong/null, asumsikan masih tayang (Running)
        if (!end || end === '\\N') {
            return { 
                label: 'Running', 
                style: 'bg-green-500/10 text-green-400 border-green-500/20', 
                dot: 'bg-green-500',
                text: `${start} — Present` 
            };
        }
        return { 
            label: 'Ended', 
            style: 'bg-gray-500/10 text-gray-400 border-gray-500/20', 
            dot: 'bg-gray-500',
            text: `${start} — ${end}` 
        };
    };

    // 3. Helper: Warna Rating
    const getRatingColor = (rating) => {
        if (!rating) return 'text-gray-600';
        if (rating >= 8.0) return 'text-purple-400'; // Ungu (Signature TV)
        if (rating >= 6.0) return 'text-blue-400';
        return 'text-rose-400';
    };

    return (
        <DashboardLayout>
            <Head title="TV Series Database" />

            <div className="space-y-6 pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">SQL TV Database</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            TV Series <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Registry</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
                            Manage {shows.total.toLocaleString('id-ID')} television series, seasons metadata, and status.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative group w-full md:w-64">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-purple-400 material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search series..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all shadow-inner text-sm"
                            />
                        </div>

                        {/* Add Button */}
                        <Link href="/production/tv-shows/create" className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
                            <span className="material-symbols-outlined text-xl">add_box</span> 
                            <span className="whitespace-nowrap">New Series</span>
                        </Link>
                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative flex flex-col min-h-[500px]">
                    {/* Decorative Top Line (Purple Theme) */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-purple-500/50 to-transparent"></div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b border-white/5 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Series Title</th>
                                    <th className="px-6 py-4">Genres</th>
                                    <th className="px-6 py-4 text-center">Broadcast Status</th>
                                    <th className="px-6 py-4 text-center">Rating</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shows.data.length > 0 ? (
                                    shows.data.map((show) => {
                                        const status = getSeriesStatus(show.startYear, show.endYear);
                                        return (
                                            <tr key={show.tconst} className="hover:bg-white/0.02 transition-colors group">
                                                
                                                {/* Column 1: Title & ID */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar Icon */}
                                                        <div className="w-10 h-10 rounded-lg bg-[#222] border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors shrink-0">
                                                            <span className="material-symbols-outlined text-xl">live_tv</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white text-base group-hover:text-purple-400 transition-colors truncate max-w-[280px]">
                                                                {show.primaryTitle}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-1.5 rounded border border-white/5">
                                                                    {show.tconst}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Column 2: Genres */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                                        {show.genres && show.genres !== '\\N' ? (
                                                            show.genres.split(',').slice(0, 2).map((genre, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1A1A1A] text-gray-400 border border-white/5">
                                                                    {genre.trim()}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-700 text-xs italic">-</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Column 3: Status & Year */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${status.style}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
                                                            {status.label}
                                                        </span>
                                                        <span className="text-xs font-mono text-gray-500">
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Column 4: Rating */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`flex items-center gap-1 font-bold font-mono text-base ${getRatingColor(show.averageRating)}`}>
                                                            {show.averageRating ? Number(show.averageRating).toFixed(1) : '-'}
                                                            <span className="material-symbols-outlined text-sm filled">star</span>
                                                        </div>
                                                        {show.numVotes > 0 && (
                                                            <div className="text-[9px] text-gray-600 mt-0.5 uppercase tracking-wide">
                                                                {Number(show.numVotes).toLocaleString('id-ID')} Votes
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Column 5: Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/production/tv-shows/${show.tconst}/edit`} className="w-8 h-8 flex items-center justify-center hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 rounded-lg transition-all" title="Edit Metadata">
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </Link>
                                                        <button className="w-8 h-8 flex items-center justify-center hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-all" title="Delete Entry">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <span className="material-symbols-outlined text-4xl opacity-30">live_tv</span>
                                                </div>
                                                <p className="font-bold text-gray-300 text-lg">No series found</p>
                                                <p className="text-sm text-gray-600 mt-1 max-w-xs">
                                                    Try checking spelling or add a new entry.
                                                </p>
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
                            Showing <span className="text-white">{shows.from || 0}</span> - <span className="text-white">{shows.to || 0}</span> of <span className="text-white">{shows.total.toLocaleString('id-ID')}</span> series
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {shows.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
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