import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CompanySwitcher({ currentCompany }) {
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi ganti mode (Global vs Company)
    const handleSwitch = (companyId) => {
        setIsOpen(false);
        
        // Kita reload halaman yang sedang aktif, tapi parameter company_id diubah
        // window.location.pathname = URL saat ini (misal: /executive/trends)
        router.get(window.location.pathname, { company_id: companyId }, {
            preserveScroll: true, // Supaya scroll gak lompat ke atas
            preserveState: false, // Supaya data terre-fresh total dari server
        });
    };

    return (
        <div className="relative">
            {/* --- TOMBOL TRIGGER --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-300 group ${
                    currentCompany 
                    ? 'bg-purple-900/20 border-purple-500/50 text-purple-300 hover:bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'bg-[#1A1A1A] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
            >
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    currentCompany ? 'bg-purple-600 text-white' : 'bg-white/10'
                }`}>
                    <span className="material-symbols-outlined text-lg">
                        {currentCompany ? 'apartment' : 'public'}
                    </span>
                </div>
                
                {/* Text Label */}
                <div className="text-left hidden md:block">
                    <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold">Data Context</p>
                    <p className="text-sm font-bold leading-none mt-0.5">
                        {currentCompany ? 'Madhouse Inc.' : 'Global Market'}
                    </p>
                </div>

                <span className={`material-symbols-outlined text-sm opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {/* --- DROPDOWN MENU --- */}
            {isOpen && (
                <>
                    {/* Backdrop Transparan (Klik luar untuk tutup) */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    
                    {/* Isi Menu */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl ring-1 ring-white/5">
                        <div className="p-1.5 space-y-1">
                            
                            {/* Opsi 1: Global Market */}
                            <button 
                                onClick={() => handleSwitch(null)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${
                                    !currentCompany ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:text-white">Global Industry</p>
                                    <p className="text-[10px] opacity-60">Standard IMDb dataset</p>
                                </div>
                                {!currentCompany && <span className="material-symbols-outlined text-blue-400 ml-auto text-sm">check</span>}
                            </button>

                            <div className="h-px bg-white/5 mx-2 my-1"></div>

                            {/* Opsi 2: Madhouse (ID 9538) */}
                            <button 
                                onClick={() => handleSwitch('9538')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${
                                    currentCompany === '9538' ? 'bg-purple-500/20 text-purple-200' : 'hover:bg-white/5 text-gray-400'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">movie_filter</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:text-white">Madhouse Inc.</p>
                                    <p className="text-[10px] opacity-60">Studio Performance View</p>
                                </div>
                                {currentCompany === '9538' && <span className="material-symbols-outlined text-purple-400 ml-auto text-sm">check</span>}
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}