import React, { useState } from 'react';
import { router } from '@inertiajs/react';

// PERBAIKAN 1: Tambahkan 'disabled' di sini
export default function CompanySwitcher({ currentCompany, disabled }) { 
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi ganti mode
    const handleSwitch = (companyId) => {
        setIsOpen(false);
        router.get(window.location.pathname, { company_id: companyId }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative z-50">
            {/* --- TOMBOL TRIGGER UTAMA --- */}
            <button 
                onClick={toggleOpen} 
                className={`group flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full border transition-all duration-500 relative overflow-hidden ${
                    disabled 
                    ? 'bg-[#0a0a0a] border-white/5 text-gray-600 cursor-not-allowed opacity-60' 
                    : currentCompany 
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.5)]' 
                        : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                } ${isOpen ? 'ring-2 ring-cyan-500/30 border-cyan-500/50' : ''}`}
                disabled={disabled} 
            >
                {/* Efek Shine Bergerak (Matikan jika disabled) */}
                {!disabled && (
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none"></div>
                )}

                {/* Icon Circle */}
                <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    disabled
                    ? 'bg-[#151515] text-gray-600' // Icon mati
                    : currentCompany 
                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_#22d3ee] scale-105' 
                        : 'bg-indigo-500 text-white shadow-[0_0_15px_#6366f1] scale-105'
                }`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {disabled ? 'lock' : (currentCompany ? 'domain' : 'hub')} 
                    </span>
                </div>
                
                {/* Text Label */}
                <div className="relative z-10 text-left hidden md:block">
                    <p className={`text-[9px] uppercase tracking-widest font-bold leading-none mb-0.5 transition-colors ${
                        disabled ? 'text-gray-600' : (currentCompany ? 'text-cyan-500/70' : 'text-indigo-400')
                    }`}>
                        {disabled ? 'View Only' : (currentCompany ? 'Studio Focus' : 'Full Integration')}
                    </p>
                    <p className={`text-sm font-bold leading-none transition-colors ${
                        disabled ? 'text-gray-500' : (currentCompany ? 'text-cyan-100' : 'text-white')
                    }`}>
                        {disabled ? 'Global Registry' : (currentCompany ? 'Madhouse Inc.' : 'Integrated DB')}
                    </p>
                </div>

                {/* Arrow Icon (Hilangkan jika disabled) */}
                {!disabled && (
                    <span className={`relative z-10 material-symbols-outlined text-sm opacity-50 transition-transform duration-500 ml-1 ${isOpen ? 'rotate-180 text-white opacity-100' : 'group-hover:translate-y-0.5'}`}>
                        expand_more
                    </span>
                )}
            </button>

            {/* --- DROPDOWN MENU --- */}
            {isOpen && !disabled && ( 
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={() => setIsOpen(false)}></div>
                    
                    {/* Menu Panel */}
                    <div className="absolute right-0 top-full mt-3 w-80 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] z-50 overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        {/* Header Menu */}
                        <div className="bg-[#151515] px-4 py-3 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Select Data Environment</span>
                            <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px] ${currentCompany ? 'bg-cyan-500 shadow-cyan-500' : 'bg-indigo-500 shadow-indigo-500'}`}></span>
                        </div>

                        <div className="p-2 space-y-1">
                            
                            {/* Option 1: Integrated DB */}
                            <button 
                                onClick={() => handleSwitch(null)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group relative overflow-hidden ${
                                    !currentCompany 
                                    ? 'bg-indigo-950/30 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]' 
                                    : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                                }`}
                            >
                                <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner ${
                                    !currentCompany ? 'bg-indigo-500 text-white shadow-indigo-500/40' : 'bg-[#1A1A1A] text-gray-500 group-hover:text-indigo-400'
                                }`}>
                                    <span className="material-symbols-outlined">hub</span>
                                </div>
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${!currentCompany ? 'text-indigo-100' : 'text-gray-300 group-hover:text-white'}`}>Integrated DB</p>
                                        {!currentCompany && <span className="px-1.5 py-0.5 rounded border border-indigo-400/30 bg-indigo-500/20 text-[9px] font-bold text-indigo-300 uppercase">Default</span>}
                                    </div>
                                </div>
                                {!currentCompany && <span className="material-symbols-outlined text-indigo-400 text-lg animate-pulse relative z-10">check_circle</span>}
                                {!currentCompany && <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>}
                            </button>

                            {/* Option 2: Madhouse Inc. */}
                            <button 
                                onClick={() => handleSwitch('9538')}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group relative overflow-hidden ${
                                    currentCompany === '9538' 
                                    ? 'bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_20px_-5px_rgba(34,211,238,0.2)]' 
                                    : 'hover:bg-cyan-950/10 border border-transparent hover:border-cyan-500/20'
                                }`}
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner ${
                                    currentCompany === '9538' ? 'bg-cyan-500 text-black shadow-cyan-500/40' : 'bg-[#1A1A1A] text-gray-500 group-hover:text-cyan-400'
                                }`}>
                                    <span className="material-symbols-outlined">domain</span>
                                </div>
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${currentCompany === '9538' ? 'text-cyan-100' : 'text-gray-300 group-hover:text-cyan-100'}`}>Madhouse Inc.</p>
                                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase transition-colors ${
                                            currentCompany === '9538' 
                                            ? 'bg-cyan-500 text-black border-cyan-400' 
                                            : 'bg-cyan-900/20 border-cyan-500/20 text-cyan-600 group-hover:text-cyan-400 group-hover:border-cyan-500/50'
                                        }`}>
                                            Exclusive
                                        </span>
                                    </div>
                                </div>
                                
                                {currentCompany === '9538' && (
                                    <div className="relative z-10 w-6 h-6 flex items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20 animate-ping"></span>
                                        <span className="material-symbols-outlined text-cyan-400 text-lg">check_circle</span>
                                    </div>
                                )}
                            </button>

                        </div>
                        
                        <div className="bg-[#121212] px-5 py-2 border-t border-white/5 text-[10px] text-gray-600 flex justify-between items-center">
                            <span className="flex items-center gap-1 text-gray-700">
                                <span className="w-1 h-1 rounded-full bg-green-500"></span> Live Connected
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}