import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CompanySwitcher from '@/Components/Dashboard/CompanySwitcher';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // 1. STATE PERSISTENCE (Agar sidebar tidak reset saat pindah halaman)
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebarState');
            return savedState !== null ? JSON.parse(savedState) : true;
        }
        return true;
    });

    // Simpan ke localStorage setiap kali state berubah
    useEffect(() => {
        localStorage.setItem('sidebarState', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const params = new URLSearchParams(window.location.search);
    const currentCompanyId = params.get('company_id');

    // Menu Configuration
    const menus = user.role === 'executive' ? [
        { name: 'Overview', icon: 'dashboard', route: '/executive/dashboard' },
        { name: 'Market Trends', icon: 'trending_up', route: '/executive/trends' },
        { name: 'Studio DNA', icon: 'fingerprint', route: '/executive/talents' },
        { name: 'Platform Intel', icon: 'pie_chart', route: '/executive/platforms' },
    ] : [
        { name: 'Dashboard', icon: 'dashboard', route: '/production/dashboard' },
        { name: 'Films', icon: 'movie', route: '/production/films' },
        { name: 'TV Shows', icon: 'live_tv', route: '/production/tv-shows' },
        { name: 'People', icon: 'person', route: '/production/people' },
        { name: 'Companies', icon: 'domain', route: '/production/companies' },
        { name: 'Genres', icon: 'category', route: '/production/genres' },
    ];

    const isActive = (path) => window.location.pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-[#050505] text-gray-200 font-sans overflow-hidden selection:bg-cyan-500/30">
            
            {/* --- SIDEBAR --- */}
            <aside 
                className={`relative z-40 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-r border-white/5 bg-[#0a0a0a] ${isSidebarOpen ? 'w-72' : 'w-24'}`}
            >
                {/* Background Gradient Subtle */}
                <div className="absolute inset-0 bg-linear-to-b from-cyan-900/5 to-transparent pointer-events-none"></div>

                {/* --- LOGO AREA --- */}
                <div className={`flex items-center justify-center border-b border-white/5 relative z-10 overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'h-40 py-6' : 'h-24 py-0'}`}>
                    <Link href="/" className="flex flex-col items-center justify-center w-full px-4 group no-underline">
                        
                        {/* 2. LOGO IMAGE LOGIC */}
                        <img 
                            src="/images/madhouse-logo.png" 
                            alt="Madhouse Logo" 
                            className={`object-contain transition-all duration-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] 
                                ${isSidebarOpen ? 'w-48 h-auto' : 'w-10 h-10'}
                            `} 
                        />

                        {/* 3. TEXT ROLE */}
                        {/* <div className={`text-center mt-1 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 h-0 overflow-hidden'}`}>
                            <span className="block text-sm font-black text-white tracking-[0.2em] leading-none uppercase">
                                {user.role} <span className="text-cyan-500">Suite</span>
                            </span>
                            <div className="h-0.5 w-8 bg-cyan-500/50 mx-auto mt-2 rounded-full"></div>
                        </div> */}
                    </Link>
                </div>

                {/* --- MENU ITEMS --- */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                    {menus.map((item) => {
                        const active = isActive(item.route);
                        return (
                            <Link 
                                key={item.name} 
                                href={`${item.route}${currentCompanyId ? `?company_id=${currentCompanyId}` : ''}`}
                                className={`relative flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'} py-3.5 rounded-xl transition-all duration-300 group ${
                                    active 
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent hover:border-white/5'
                                }`}
                                title={!isSidebarOpen ? item.name : ''} // Fallback title browser standard
                            >
                                {/* Icon */}
                                <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                
                                {/* Text Label (Visible only when Open) */}
                                <span className={`ml-4 font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 -translate-x-4 overflow-hidden'} ${active ? 'font-bold' : ''}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* --- USER PROFILE (Bottom) --- */}
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a] relative z-10">
                    <div className={`relative p-3 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 group/profile ${isSidebarOpen ? 'hover:bg-white/10' : 'bg-transparent border-none p-0 flex justify-center'}`}>
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff&bold=true`} 
                                    className="w-10 h-10 rounded-xl border-2 border-[#1A1A1A] shadow-lg transition-transform duration-300 group-hover/profile:scale-105" 
                                    alt="User"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[3px] border-[#0a0a0a] rounded-full"></div>
                            </div>
                            
                            {/* Profile Text (Open only) */}
                            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                <p className="text-sm font-bold text-gray-200 truncate leading-tight group-hover/profile:text-white transition-colors">{user.name}</p>
                                <p className="text-[10px] text-gray-500 truncate group-hover/profile:text-gray-400">Online</p>
                            </div>
                        </div>

                        {/* Logout (Open) */}
                        {isSidebarOpen && (
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Sign Out"
                            >
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </Link>
                        )}
                    </div>

                    {/* Logout (Closed) */}
                    {!isSidebarOpen && (
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="mt-4 w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-transparent transition-all shadow-lg group relative"
                            title="Sign Out"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#050505]">
                
                {/* Topbar */}
                <header className="h-24 flex items-center justify-between px-6 md:px-10 z-20 sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center gap-6">
                        {/* Sidebar Toggle Button */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-400 transition-all duration-300 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-2xl">
                                {isSidebarOpen ? 'menu_open' : 'menu'}
                            </span>
                        </button>
                        
                        {/* Breadcrumb / Title */}
                        <div className="hidden md:block">
                            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                                {window.location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                {currentCompanyId ? (
                                    <>
                                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                                        <p className="text-xs font-bold text-purple-400 tracking-wide uppercase">Madhouse Inc. Active</p>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex h-2 w-2 rounded-full bg-cyan-500/50"></span>
                                        <p className="text-xs text-gray-500 font-medium">Global Market View</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Company Switcher */}
                        <CompanySwitcher currentCompany={currentCompanyId} />
                        
                        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                        {/* Notification Bell */}
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined group-hover:animate-swing">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Date Display (Hidden on small screens) */}
                        <div className="text-right hidden xl:block">
                            <p className="text-xs font-mono text-cyan-500 font-bold tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </header>

                {/* Content Scrollable - Responsive Padding */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative scroll-smooth">
                    {/* Background Glow Spot */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505] pointer-events-none"></div>
                    
                    <div className="relative z-10 animate-fade-in-up">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}