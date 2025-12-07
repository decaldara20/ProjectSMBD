import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Menu Configuration
    const menus = user.role === 'executive' ? [
        { name: 'Overview', icon: 'dashboard', route: '/executive/dashboard' },
        { name: 'Market Trends', icon: 'trending_up', route: '/executive/trends' },
        { name: 'Talent Analytics', icon: 'stars', route: '/executive/talents' },
        { name: 'Platform Intel', icon: 'pie_chart', route: '/executive/platforms' },
    ] : [
        { name: 'Dashboard', icon: 'dashboard', route: '/production/dashboard' },
        { name: 'Movies', icon: 'movie', route: '/production/movies' },
        { name: 'TV Shows', icon: 'live_tv', route: '/production/tv-shows' },
        { name: 'People', icon: 'person', route: '/production/people' },
        { name: 'Companies', icon: 'domain', route: '/production/companies' },
        { name: 'Genres', icon: 'category', route: '/production/genres' },
    ];

    const isActive = (path) => window.location.pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-200 font-sans overflow-hidden">
            
            {/* --- SIDEBAR (Modern Glassmorphism) --- */}
            <aside 
                className={`relative z-30 transition-all duration-500 ease-in-out flex flex-col border-r border-white/5 bg-[#111] ${isSidebarOpen ? 'w-72' : 'w-24'}`}
                style={{
                    backgroundImage: 'linear-gradient(to bottom, #111 0%, #0f0f0f 100%)'
                }}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-white/5 relative">
                    <Link href="/" className="flex items-center gap-3 no-underline group">
                        <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-white text-2xl">movie_filter</span>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tight text-white leading-none">IMTVDB</span>
                                <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">
                                    {user.role} Suite
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menus.map((item) => {
                        const active = isActive(item.route);
                        return (
                            <Link 
                                key={item.name} 
                                href={item.route} 
                                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                                    active 
                                    ? 'bg-white/5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {/* Active Indicator Line */}
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_#06b6d4]"></div>
                                )}

                                <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${active ? 'text-cyan-400 scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                
                                {isSidebarOpen && (
                                    <span className={`font-medium text-sm tracking-wide ${active ? 'font-bold' : ''}`}>
                                        {item.name}
                                    </span>
                                )}

                                {/* Hover Glow Effect */}
                                {!active && (
                                    <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile (Floating Card Style) */}
                <div className="p-4 border-t border-white/5 bg-[#0d0d0d]">
                    <div className={`relative p-3 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 ${isSidebarOpen ? 'hover:bg-white/10' : 'bg-transparent border-none p-0 flex justify-center'}`}>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} 
                                    className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] shadow-lg" 
                                    alt="User"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1A1A1A] rounded-full"></div>
                            </div>
                            
                            {isSidebarOpen && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate leading-tight">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Logout Button (Only visible on open) */}
                        {isSidebarOpen && (
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </Link>
                        )}
                    </div>

                    {/* Collapsed Logout */}
                    {!isSidebarOpen && (
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="mt-4 w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0a0a0a]">
                
                {/* Topbar (Transparent Blur) */}
                <header className="h-20 flex items-center justify-between px-8 z-20 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-2xl">
                                {isSidebarOpen ? 'menu_open' : 'menu'}
                            </span>
                        </button>
                        
                        {/* Breadcrumb / Title */}
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {window.location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                            </h2>
                            <p className="text-xs text-gray-500">Welcome back, {user.name.split(' ')[0]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-white/10 mx-2"></div>

                        {/* Date Display */}
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-mono text-cyan-500 font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                            <p className="text-xs text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </header>

                {/* Content Scrollable */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
                    {/* Background Glow Spot */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-cyan-900/5 blur-[120px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}