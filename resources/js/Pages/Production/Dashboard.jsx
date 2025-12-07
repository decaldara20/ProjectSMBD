import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentItems }) {
    return (
        <DashboardLayout>
            <Head title="Production Dashboard" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-white">Production <span className="text-green-500">Studio</span></h1>
                        <p className="text-gray-400 text-sm mt-1">Manage database content and metadata.</p>
                    </div>
                    <Link href="/production/movies/create" className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center gap-2">
                        <span className="material-symbols-outlined">add_circle</span> Add New Movie
                    </Link>
                </div>

                {/* --- 1. QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Movies DB" value={stats.total_movies.toLocaleString()} icon="movie" color="text-cyan-400" />
                    <StatCard title="TV Series DB" value={stats.total_tv.toLocaleString()} icon="live_tv" color="text-purple-400" />
                    <StatCard title="People DB" value={stats.total_people.toLocaleString()} icon="person" color="text-pink-400" />
                    <StatCard title="New Entries (Week)" value={stats.recent_adds} icon="history" color="text-yellow-400" />
                </div>

                {/* --- 2. SHORTCUTS AREA --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Activity Table */}
                    <div className="md:col-span-2 bg-[#181818] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Recently Added Content</h3>
                            <Link href="/production/movies" className="text-xs text-green-500 font-bold uppercase">View All</Link>
                        </div>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3 text-right">Year</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{item.primaryTitle}</td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.titleType === 'movie' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {item.titleType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">{item.startYear}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                        <h3 className="font-bold text-white mb-2">Quick Actions</h3>
                        
                        <Link href="/production/movies/create" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                <span className="material-symbols-outlined">movie_edit</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Input Movie</h4>
                                <p className="text-xs text-gray-500">Add new film metadata</p>
                            </div>
                        </Link>

                        <Link href="/production/people/create" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Add Talent</h4>
                                <p className="text-xs text-gray-500">Register new actor/crew</p>
                            </div>
                        </Link>

                        <Link href="/production/genres" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                <span className="material-symbols-outlined">category</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Manage Genres</h4>
                                <p className="text-xs text-gray-500">Update categories</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Komponen Kartu Statistik Sederhana
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/20 transition-all">
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h4 className="text-2xl font-black text-white">{value}</h4>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
    </div>
);