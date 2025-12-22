import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentItems }) {
    
    // Helper: Warna Badge Tipe Judul
    const getTypeBadgeStyle = (type) => {
        const normalized = type?.toLowerCase() || '';
        if (normalized === 'movie') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        if (normalized.includes('tv') || normalized.includes('series')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    // Helper: Warna Rating
    const getRatingColor = (rating) => {
        if (!rating) return 'text-gray-500';
        if (rating >= 8.0) return 'text-emerald-400';
        if (rating >= 6.0) return 'text-yellow-400';
        return 'text-rose-400';
    };

    return (
        <DashboardLayout>
            <Head title="Production Dashboard" />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Live Database Connection</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Production <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">Console</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 max-w-lg">
                            Manage IMTVDB metadata registry. Input movies, update TV shows, and curate talent profiles.
                        </p>
                    </div>
                    
                    <Link href="/production/movies/create" className="group relative px-5 py-3 bg-[#f0f0f0] hover:bg-white text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 transition-all flex items-center gap-2 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-green-700">add_circle</span> 
                            New Entry
                        </span>
                    </Link>
                </div>

                {/* --- 1. STATS GRID (Clean & Modern) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Total Movies" 
                        value={stats.total_movies} 
                        icon="movie" 
                        color="text-cyan-400" 
                        gradient="from-cyan-500/10 to-blue-500/5"
                        borderColor="border-cyan-500/20"
                    />
                    <StatCard 
                        title="TV Shows" 
                        value={stats.total_tv} 
                        icon="live_tv" 
                        color="text-purple-400" 
                        gradient="from-purple-500/10 to-pink-500/5"
                        borderColor="border-purple-500/20"
                    />
                    <StatCard 
                        title="Talent Registry" 
                        value={stats.total_people} 
                        icon="groups" 
                        color="text-pink-400" 
                        gradient="from-pink-500/10 to-rose-500/5"
                        borderColor="border-pink-500/20"
                    />
                    <StatCard 
                        title="New This Year" 
                        value={stats.recent_adds} 
                        icon="calendar_month" 
                        color="text-yellow-400" 
                        gradient="from-yellow-500/10 to-orange-500/5"
                        borderColor="border-yellow-500/20"
                    />
                </div>

                {/* --- 2. MAIN CONTENT SPLIT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: Recent Data Table */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-500">dvr</span>
                                Latest Database Entries
                            </h3>
                            <Link href="/production/movies" className="text-xs text-green-500 hover:text-green-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-all hover:gap-2">
                                Full Database <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-green-500/50 to-transparent"></div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Title Metadata</th>
                                            <th className="px-6 py-4 text-center">Type</th>
                                            <th className="px-6 py-4 text-center">Year</th>
                                            <th className="px-6 py-4 text-right">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {recentItems.length > 0 ? (
                                            recentItems.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-white/0.02 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            {/* Numbering Circle */}
                                                            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs font-mono text-gray-600 border border-white/5 group-hover:border-green-500/30 group-hover:text-green-500 transition-colors">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-base group-hover:text-green-400 transition-colors truncate max-w-[180px] md:max-w-xs">
                                                                    {item.primaryTitle}
                                                                </div>
                                                                {/* ID DISPLAY (REVISI: Clean Code Style, No Fingerprint) */}
                                                                <div className="mt-1 flex">
                                                                    <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                                                        {item.tconst}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getTypeBadgeStyle(item.titleType)}`}>
                                                            {item.titleType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-mono text-gray-300">
                                                        {item.startYear || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className={`inline-flex items-center gap-1.5 font-bold font-mono ${getRatingColor(item.averageRating)}`}>
                                                            <span className="material-symbols-outlined text-sm filled">star</span>
                                                            {item.averageRating ? Number(item.averageRating).toFixed(1) : 'N/A'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-600 italic">
                                                    No recent entries found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Quick Actions & Info */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Control Panel */}
                        <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

                            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                                Quick Actions
                            </h3>
                            
                            <div className="space-y-3 relative z-10">
                                <QuickAction 
                                    href="/production/movies/create" 
                                    icon="movie_edit" 
                                    title="Input Movie" 
                                    desc="Add metadata manually"
                                />
                                <QuickAction 
                                    href="/production/people/create" 
                                    icon="person_add" 
                                    title="Register Talent" 
                                    desc="Add cast & crew"
                                />
                                <QuickAction 
                                    href="/production/genres" 
                                    icon="label" 
                                    title="Genre Tags" 
                                    desc="Manage categories"
                                />
                            </div>
                        </div>

                        {/* System Status / Tip */}
                        <div className="bg-linear-to-br from-[#121212] to-[#0a0a0a] rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-blue-500">dns</span>
                            </div>
                            
                            <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">info</span> 
                                Data Integrity Tip
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">
                                Always verify the <code className="bg-white/10 px-1 py-0.5 rounded text-blue-200">tconst</code> before submitting. Duplicate IDs will cause merge conflicts.
                            </p>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-full animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-gray-600 mt-2 font-mono text-right">System Healthy</p>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// --- COMPONENTS ---

const StatCard = ({ title, value, icon, color, gradient, borderColor }) => (
    <div className={`relative p-6 rounded-2xl border ${borderColor} bg-linear-to-br ${gradient} bg-[#121212] hover:scale-[1.02] transition-transform duration-300 shadow-xl overflow-hidden group`}>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-3xl font-black text-white tracking-tighter">
                    {value ? value.toLocaleString() : '0'}
                </h4>
            </div>
            <div className={`p-2.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
    </div>
);

const QuickAction = ({ href, icon, title, desc }) => (
    <Link href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
        <div className="w-10 h-10 rounded-lg bg-[#181818] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-green-600 transition-all shadow-inner border border-white/5">
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{title}</h4>
            <p className="text-[10px] text-gray-500">{desc}</p>
        </div>
        <span className="material-symbols-outlined text-gray-600 text-lg ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
            chevron_right
        </span>
    </Link>
);