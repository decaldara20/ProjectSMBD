import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Tentukan Menu berdasarkan Role
    const menus = user.role === 'executive' ? [
        // 1. Dashboard Utama
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
        <div className="flex h-screen bg-[#0f0f0f] text-gray-200 font-sans overflow-hidden">
            
            {/* --- SIDEBAR --- */}
            <aside className={`bg-[#181818] border-r border-white/5 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
                        {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">IMTVDB <span className="text-cyan-500 text-xs uppercase align-top">{user.role.substring(0,3)}</span></span>}
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {menus.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.route} 
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive(item.route) 
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-2xl ${isActive(item.route) ? 'fill-1' : ''}`}>{item.icon}</span>
                            {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User Profile Bottom */}
                <div className="p-4 border-t border-white/5">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} 
                            className="w-10 h-10 rounded-full border border-white/10" 
                            alt="User"
                        />
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                        )}
                    </div>
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold ${!isSidebarOpen && 'p-2'}`}
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        {isSidebarOpen && "Sign Out"}
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Topbar */}
                <header className="h-16 bg-[#181818]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Welcome, {user.name}</span>
                    </div>
                </header>

                {/* Content Scrollable */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0f0f0f]">
                    {children}
                </main>

            </div>
        </div>
    );
}