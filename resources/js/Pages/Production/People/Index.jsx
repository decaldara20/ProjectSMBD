import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function PeopleIndex({ people, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');

    // 1. Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/people', { search, role }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // Handle Role Change
    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
        router.get('/production/people', { search, role: newRole }, { preserveState: true, replace: true });
    };

    // Helper: Format Life Span (1970 - 2023)
    const formatLifeSpan = (birth, death) => {
        if (!birth || birth === '\\N') return 'N/A';
        if (death && death !== '\\N') return `${birth} — ${death}`;
        return `${birth} — Present`; // Masih hidup
    };

    // Helper: Warna Badge Profesi
    const getProfessionStyle = (prof) => {
        const p = prof.toLowerCase().trim();
        if (p.includes('actor') || p.includes('actress')) return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
        if (p.includes('director')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (p.includes('writer')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        if (p.includes('producer')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <DashboardLayout>
            <Head title="Talent Registry" />

            <div className="space-y-6 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">Global Talent Database</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Cast & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Crew</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                            Registry of {people.total.toLocaleString('id-ID')} professionals including actors, directors, writers, and production crew.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        
                        {/* 1. Filter Role */}
                        <div className="relative group">
                            <span className="absolute left-3 top-3 text-gray-500 material-symbols-outlined text-lg pointer-events-none">filter_list</span>
                            <select 
                                value={role} 
                                onChange={handleRoleChange}
                                className="w-full sm:w-48 bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white appearance-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none cursor-pointer hover:border-white/20 transition-all text-sm font-medium"
                            >
                                <option value="all">All Professions</option>
                                <option value="actor">Actors</option>
                                <option value="actress">Actresses</option>
                                <option value="director">Directors</option>
                                <option value="writer">Writers</option>
                                <option value="producer">Producers</option>
                                <option value="composer">Composers</option>
                            </select>
                            <span className="absolute right-3 top-3 text-gray-600 material-symbols-outlined text-sm pointer-events-none">expand_more</span>
                        </div>

                        {/* 2. Search Bar */}
                        <div className="relative group flex-1 sm:w-64">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-pink-400 material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search talent..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all shadow-inner text-sm"
                            />
                        </div>

                        {/* 3. Add Button */}
                        <Link href="/production/people/create" className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
                            <span className="material-symbols-outlined text-xl">person_add</span> 
                            <span className="whitespace-nowrap">New Talent</span>
                        </Link>
                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative flex flex-col min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b border-white/5 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Name & ID</th>
                                    <th className="px-6 py-4">Primary Professions</th>
                                    <th className="px-6 py-4">Known For (Top Movies)</th>
                                    <th className="px-6 py-4 text-center">Life Span</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {people.data.length > 0 ? (
                                    people.data.map((person) => (
                                        <tr key={person.nconst} className="hover:bg-white/[0.02] transition-colors group">
                                            
                                            {/* Column 1: Name & ID */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {/* Initials Avatar */}
                                                    <div className="w-10 h-10 rounded-full bg-[#222] border border-white/5 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:border-pink-500/30 group-hover:text-pink-400 transition-colors shrink-0">
                                                        {person.primaryName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-white text-base group-hover:text-pink-400 transition-colors truncate max-w-[250px]">
                                                            {person.primaryName}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-1.5 rounded border border-white/5">
                                                                {person.nconst}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Professions (Badges) */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                                    {person.primaryProfession && person.primaryProfession !== 'Artist' ? (
                                                        person.primaryProfession.split(',').map((prof, idx) => (
                                                            <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getProfessionStyle(prof)}`}>
                                                                {prof.trim().replace(/_/g, ' ')}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-600 text-xs italic">Artist / Unspecified</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 3: Known For (List) */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 max-w-[220px]">
                                                    {person.knownFor && person.knownFor !== 'Belum ada data film' ? (
                                                        person.knownFor.split(',').slice(0, 3).map((title, idx) => (
                                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors truncate">
                                                                <span className="material-symbols-outlined text-[10px] text-pink-500/50">movie</span>
                                                                <span className="truncate">{title.trim()}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-700 text-xs italic">No associated titles</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 4: Life Span */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-mono text-gray-400">
                                                    {formatLifeSpan(person.birthYear, person.deathYear)}
                                                </span>
                                            </td>

                                            {/* Column 5: Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/production/people/${person.nconst}/edit`} className="w-8 h-8 flex items-center justify-center hover:bg-pink-500/10 text-gray-400 hover:text-pink-400 rounded-lg transition-all" title="Edit Metadata">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </Link>
                                                    <button className="w-8 h-8 flex items-center justify-center hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-all" title="Delete Entry">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <span className="material-symbols-outlined text-4xl opacity-30">person_off</span>
                                                </div>
                                                <p className="font-bold text-gray-300 text-lg">No talent found</p>
                                                <p className="text-sm text-gray-600 mt-1 max-w-xs">
                                                    Try searching for a name or change the profession filter.
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
                            Showing <span className="text-white">{people.from || 0}</span> - <span className="text-white">{people.to || 0}</span> of <span className="text-white">{people.total.toLocaleString('id-ID')}</span> profiles
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {people.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' 
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