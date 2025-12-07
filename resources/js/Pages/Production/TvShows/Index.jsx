import React, { useState } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function TvShowIndex({ shows, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/production/tv-shows', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Manage TV Shows" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-white">TV Shows <span className="text-purple-500">Database</span></h1>
                    <Link href="/production/tv-shows/create" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined">add</span> Add New
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <span className="absolute left-3 top-2.5 text-gray-400 material-symbols-outlined">search</span>
                    <input 
                        type="text" 
                        placeholder="Search series..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                </form>

                {/* Table */}
                <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Start Year</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {shows.data.map((show) => (
                                <tr key={show.tconst || show.show_id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">
                                        {show.primaryTitle}
                                        <span className="block text-xs text-gray-500 font-mono">{show.tconst || show.show_id}</span>
                                    </td>
                                    <td className="px-6 py-4">{show.startYear}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-yellow-500 flex items-center gap-1">
                                            <i className="fas fa-star text-[10px]"></i> {show.averageRating || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                        {shows.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className={`px-3 py-1 rounded text-xs font-bold ${link.active ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : <span key={i} className="px-3 py-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}