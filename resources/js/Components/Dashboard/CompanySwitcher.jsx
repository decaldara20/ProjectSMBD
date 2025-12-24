import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CompanySwitcher({ currentCompany }) {
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi ganti mode
    const handleSwitch = (companyId) => {
        setIsOpen(false);
        router.get(window.location.pathname, { company_id: companyId }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <div className="relative">
            {/* --- TOMBOL TRIGGER --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full border transition-all duration-500 group ${
                    currentCompany 
                    ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]' 
                    : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
            >
                {/* Icon Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentCompany 
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_#22d3ee]' 
                    : 'bg-white/10 text-gray-300'
                }`}>
                    <span className="material-symbols-outlined text-lg">
                        {currentCompany ? 'apartment' : 'public'}
                    </span>
                </div>
                
                {/* Text Label */}
                <div className="text-left hidden md:block">
                    <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold leading-none mb-0.5">Context</p>
                    <p className="text-sm font-bold leading-none">
                        {currentCompany ? 'Madhouse Inc.' : 'Global Market'}
                    </p>
                </div>

                {/* Arrow */}
                <span className={`material-symbols-outlined text-sm opacity-50 transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {/* --- DROPDOWN MENU --- */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    
                    <div className="absolute right-0 top-full mt-3 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl ring-1 ring-white/5 animate-fade-in-up">
                        <div className="p-2 space-y-1">
                            
                            {/* Header Kecil */}
                            <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-white/5 mb-1">
                                Select Data Source
                            </div>

                            {/* Opsi 1: Global Market */}
                            <button 
                                onClick={() => handleSwitch(null)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group relative overflow-hidden ${
                                    !currentCompany ? 'bg-white/5 text-white ring-1 ring-white/10' : 'hover:bg-white/5 text-gray-400'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${!currentCompany ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                                    <span className="material-symbols-outlined">public</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:text-white">Global Industry</p>
                                    <p className="text-[10px] opacity-60">General IMDb Dataset</p>
                                </div>
                                {!currentCompany && <span className="material-symbols-outlined text-blue-400 ml-auto">check_circle</span>}
                            </button>

                            {/* Opsi 2: Madhouse */}
                            <button 
                                onClick={() => handleSwitch('9538')}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group relative overflow-hidden ${
                                    currentCompany === '9538' ? 'bg-cyan-950/30 text-cyan-100 ring-1 ring-cyan-500/50' : 'hover:bg-white/5 text-gray-400'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentCompany === '9538' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-white/5 text-gray-500 group-hover:text-cyan-400'}`}>
                                    <span className="material-symbols-outlined">movie_filter</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:text-white">Madhouse Inc.</p>
                                    <p className="text-[10px] opacity-60">Executive Studio View</p>
                                </div>
                                {currentCompany === '9538' && (
                                    <span className="flex h-3 w-3 relative ml-auto">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                    </span>
                                )}
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}