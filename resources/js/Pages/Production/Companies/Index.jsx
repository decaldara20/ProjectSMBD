import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function CompaniesIndex({ companies, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // 1. Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/companies', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // Helper: Tentukan "Kelas" Studio berdasarkan jumlah produksi
    const getCompanyTier = (total) => {
        if (total > 50) return { label: 'MAJOR STUDIO', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
        if (total > 10) return { label: 'ESTABLISHED', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
        return { label: 'INDIE', color: 'text-gray-400 border-gray-500/30 bg-gray-500/10' };
    };

    return (
        <DashboardLayout>
            <Head title="Production Companies" />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Global Network Registry</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Hub</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-xl">
                            Curated database of {companies.total.toLocaleString('id-ID')} production houses, streaming networks, and creative studios.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-blue-400 material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search studios..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner text-sm"
                            />
                        </div>
                        <Link href="#" className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 whitespace-nowrap">
                            <span className="material-symbols-outlined text-xl">domain_add</span> 
                            <span className="hidden md:inline">Add Entity</span>
                        </Link>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                {companies.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {companies.data.map((company) => {
                            const tier = getCompanyTier(company.total_titles);
                            
                            return (
                                <div key={company.company_id} className="group bg-[#121212] border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col justify-between h-full relative overflow-hidden">
                                    
                                    {/* Decoration Background */}
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors pointer-events-none"></div>

                                    <div>
                                        {/* Header: Logo & Tier */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <span className="font-black text-xl select-none">
                                                    {company.company_name ? company.company_name.charAt(0).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold font-mono tracking-wider border ${tier.color}`}>
                                                {tier.label}
                                            </span>
                                        </div>

                                        {/* Company Name & ID */}
                                        <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2" title={company.company_name}>
                                            {company.company_name}
                                        </h3>
                                        <p className="text-[10px] text-gray-600 font-mono mb-4">
                                            ID: {company.company_id}
                                        </p>
                                    </div>

                                    {/* Footer Stats */}
                                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                                        <div className="bg-[#181818] rounded-lg p-2 text-center border border-white/5 group-hover:border-white/10 transition-colors">
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Productions</p>
                                            <p className="text-sm font-bold text-white font-mono">
                                                {company.total_titles ? company.total_titles.toLocaleString('id-ID') : 0}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] rounded-lg p-2 text-center border border-white/5 group-hover:border-white/10 transition-colors">
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Avg Rating</p>
                                            <div className="flex items-center justify-center gap-1 text-yellow-500">
                                                <span className="text-sm font-bold text-white font-mono">
                                                    {company.avg_rating ? Number(company.avg_rating).toFixed(1) : '-'}
                                                </span>
                                                <span className="material-symbols-outlined text-[10px] filled">star</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Action Line */}
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div className="flex flex-col items-center justify-center py-20 bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-4xl opacity-30 text-blue-400">domain_disabled</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300">No Studios Found</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs text-center">
                            We couldn't find any production company matching "{search}".
                        </p>
                        <button 
                            onClick={() => { setSearch(''); router.get('/production/companies'); }}
                            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {companies.data.length > 0 && (
                    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-gray-500 font-mono">
                            Showing <span className="text-white font-bold">{companies.from}</span> to <span className="text-white font-bold">{companies.to}</span> of <span className="text-white font-bold">{companies.total.toLocaleString('id-ID')}</span> entries
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {companies.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
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