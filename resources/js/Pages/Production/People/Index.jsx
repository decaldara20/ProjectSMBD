import React, { useState } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function PeopleIndex({ people, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/production/people', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Manage Talent" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-white">Talent <span className="text-pink-500">Directory</span></h1>
                    <Link href="/production/people/create" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined">person_add</span> Add New
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <span className="absolute left-3 top-2.5 text-gray-400 material-symbols-outlined">search</span>
                    <input 
                        type="text" 
                        placeholder="Search actors, directors..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    />
                </form>

                {/* Table */}
                <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Birth Year</th>
                                <th className="px-6 py-4">Primary Profession</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {people.data.map((person) => (
                                <tr key={person.nconst} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">
                                        {person.primaryName}
                                        <span className="block text-xs text-gray-500 font-mono">{person.nconst}</span>
                                    </td>
                                    <td className="px-6 py-4">{person.birthYear || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-pink-500/10 text-pink-400 px-2 py-1 rounded text-xs border border-pink-500/20 uppercase tracking-wide">
                                            {person.primaryProfession ? person.primaryProfession.replace(/_/g, ', ') : 'UNKNOWN'}
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
                        {people.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className={`px-3 py-1 rounded text-xs font-bold ${link.active ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : <span key={i} className="px-3 py-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}