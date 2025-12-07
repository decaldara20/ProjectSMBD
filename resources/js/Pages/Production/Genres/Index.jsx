import React, { useState } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function GenreIndex({ genres, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/production/genres', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Manage Genres" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-white">Master <span className="text-yellow-500">Genres</span></h1>
                    <button className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined">add</span> New Genre
                    </button>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 material-symbols-outlined">search</span>
                    <input 
                        type="text" placeholder="Search genre..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                    />
                </form>

                <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-16">ID</th>
                                <th className="px-6 py-4">Genre Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {genres.data.map((genre) => (
                                <tr key={genre.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{genre.id}</td>
                                    <td className="px-6 py-4 font-bold text-white">{genre.genre_name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wide">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                        {genres.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className={`px-3 py-1 rounded text-xs font-bold ${link.active ? 'bg-yellow-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : <span key={i} className="px-3 py-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}