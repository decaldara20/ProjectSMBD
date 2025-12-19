import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';

export default function MainLayout({ children }) {
    // 1. Global Data & State
    const { url, props } = usePage();
    const auth = props.auth || { user: null }; 
    const globalGenres = props.globalGenres || []; 

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const [isDark, setIsDark] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    // --- DROPDOWN STATE (FIXED: Biar bisa dipencet) ---
    const [peopleOpen, setPeopleOpen] = useState(false);
    const [genresOpen, setGenresOpen] = useState(false);
    
    // Refs untuk mendeteksi klik di luar (agar dropdown nutup sendiri)
    const peopleRef = useRef(null);
    const genresRef = useRef(null);

    // --- LIVE SEARCH STATE ---
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // 2. Effect: Inisialisasi & Event Listeners
    useEffect(() => {
        // A. Inisialisasi Tema
        if (localStorage.getItem('theme') === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }

        // B. Scroll Listener (Back To Top)
        const handleScroll = () => {
            if (window.scrollY > 500) setShowBackToTop(true);
            else setShowBackToTop(false);
        };
        window.addEventListener('scroll', handleScroll);

        // C. Click Outside Listener (PENTING: Menutup dropdown saat klik di luar)
        const handleClickOutside = (event) => {
            // Search
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            // People Dropdown
            if (peopleRef.current && !peopleRef.current.contains(event.target)) {
                setPeopleOpen(false);
            }
            // Genres Dropdown
            if (genresRef.current && !genresRef.current.contains(event.target)) {
                setGenresOpen(false);
            }
        };

        // D. Keyboard Shortcut '/'
        const handleKeyDown = (e) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Tutup dropdown dengan ESC
            if (e.key === 'Escape') {
                setPeopleOpen(false);
                setGenresOpen(false);
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // --- LOGIC LIVE SEARCH (DEBOUNCE) ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (keyword.length >= 3) {
                axios.get(`/api/search/suggestions?q=${keyword}`)
                    .then(res => {
                        setSuggestions(res.data);
                        setShowDropdown(true);
                    })
                    .catch(err => console.error(err));
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    // 3. Helper Functions
    const toggleTheme = () => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowDropdown(false);
        router.get('/search', { q: keyword });
    };

    const isActive = (path) => currentPath.startsWith(path);
    const isAuthPage = url.startsWith('/login') || url.startsWith('/register');

    // Genre Logic
    const [showAllGenres, setShowAllGenres] = useState(false);
    const limitGenres = 9;
    
    const displayedGenres = showAllGenres 
        ? globalGenres 
        : globalGenres.slice(0, limitGenres);

    return (
        <div className="relative w-full flex flex-col group/design-root min-h-screen text-[#EAEAEA]">
            <div className="layout-container flex h-full grow flex-col">
                
                {/* ================= HEADER (NAVBAR) ================= */}
                {!isAuthPage && (
                    <header className="sticky top-0 z-50 flex items-center justify-center whitespace-nowrap bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-solid border-gray-200 dark:border-[#00FFFF]/20 px-4 sm:px-8 md:px-10 lg:px-20 py-3 transition-all duration-300">
                        <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
                            
                            {/* KIRI: Logo & Menu */}
                            <div className="flex items-center gap-8 shrink-0">
                                {/* Logo */}
                                <Link href="/" className="flex items-center gap-3 text-gray-900 dark:text-white no-underline group">
                                    <img 
                                        src="/images/logo.png" 
                                        alt="IMTVDB Logo" 
                                        className="w-10 h-10 object-contain transition-all duration-300 transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" 
                                    />
                                    <h2 
                                        className="text-3xl font-bold leading-tight tracking-[-0.015em] text-cyan-700 dark:text-[#00FFFF] transition-all duration-300 group-hover:text-cyan-500 dark:group-hover:text-[#00FFFF]" 
                                        style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.15)' }}
                                    >
                                        IMTVDB
                                    </h2>
                                </Link>
                                
                                {/* NAV LINKS UTAMA */}
                                <nav className="hidden lg:flex items-center gap-6">
                                    <Link href="/explore" className={`text-sm font-medium transition-colors duration-300 ${isActive('/explore') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>Explore</Link>
                                    <Link href="/films" className={`text-sm font-medium transition-colors duration-300 ${isActive('/films') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>Films</Link>
                                    <Link href="/tv-shows" className={`text-sm font-medium transition-colors duration-300 ${isActive('/tv-shows') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>TV Shows</Link>
                                    
                                    {/* --- REVISI: PEOPLE DROPDOWN (CLICKABLE) --- */}
                                    <div className="relative" ref={peopleRef}>
                                        <button 
                                            onClick={() => setPeopleOpen(!peopleOpen)}
                                            className={`flex items-center gap-1 text-sm font-medium py-2 transition-colors duration-300 focus:outline-none ${isActive('/artists') || peopleOpen ? 'text-cyan-600 dark:text-[#00FFFF] font-bold' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}
                                        >
                                            People <i className={`fas fa-chevron-down text-[10px] ml-1 transition-transform duration-300 ${peopleOpen ? 'rotate-180' : ''}`}></i>
                                        </button>

                                        {/* Dropdown Content */}
                                        <div className={`
                                            absolute left-0 top-full mt-1 w-48 
                                            bg-white dark:bg-[#1A1A1A] 
                                            border border-gray-200 dark:border-white/10 
                                            rounded-xl shadow-xl z-50 overflow-hidden py-1
                                            transition-all duration-200 origin-top
                                            ${peopleOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}
                                        `}>
                                            <Link href='/artists?profession=actor,actress' onClick={() => setPeopleOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF]">
                                                Actors
                                            </Link>
                                            <Link href='/artists?profession=director' onClick={() => setPeopleOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF]">
                                                Directors
                                            </Link>
                                            <Link href='/artists?profession=writer' onClick={() => setPeopleOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF]">
                                                Writers
                                            </Link>
                                            <div className="border-t border-gray-200 dark:border-white/10 my-1"></div>
                                            <Link href='/artists' onClick={() => setPeopleOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF]">
                                                All People
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    {/* --- REVISI: GENRES DROPDOWN (CLICKABLE) --- */}
                                    <div className="relative" ref={genresRef}>
                                        <button 
                                            onClick={() => setGenresOpen(!genresOpen)}
                                            className={`flex items-center gap-1 text-sm font-medium py-2 transition-colors duration-300 focus:outline-none ${genresOpen ? 'text-cyan-600 dark:text-[#00FFFF] font-bold' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}
                                        >
                                            Genres <i className={`fas fa-chevron-down text-[10px] ml-1 transition-transform duration-300 ${genresOpen ? 'rotate-180' : ''}`}></i>
                                        </button>

                                        {/* Dropdown Content */}
                                        <div className={`
                                            absolute left-0 top-full mt-2 w-[500px] 
                                            bg-white dark:bg-[#1A1A1A] 
                                            border border-gray-200 dark:border-white/10 
                                            rounded-xl shadow-2xl z-50 overflow-hidden p-5
                                            transition-all duration-200 origin-top
                                            ${genresOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}
                                        `}>
                                            {/* Grid Genre */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {globalGenres.length > 0 ? (
                                                    displayedGenres.map((genre) => (
                                                        <Link 
                                                            key={genre.genre_name}
                                                            href={`/explore?genre=${genre.genre_name}`}
                                                            onClick={() => setGenresOpen(false)}
                                                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-700 dark:hover:text-[#00FFFF] rounded-lg truncate transition-colors"
                                                        >
                                                            {genre.genre_name}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-red-500 col-span-3">No genres loaded.</p>
                                                )}
                                            </div>

                                            {/* Show More / Less Logic */}
                                            {globalGenres.length > limitGenres && (
                                                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-white/10 text-center">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault(); 
                                                            setShowAllGenres(!showAllGenres);
                                                        }}
                                                        className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-[#00FFFF] flex items-center justify-center gap-1 w-full py-1"
                                                    >
                                                        {showAllGenres ? (
                                                            <>Show Less <i className="fas fa-chevron-up"></i></>
                                                        ) : (
                                                            <>View All Genres <i className="fas fa-chevron-down"></i></>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </nav>
                            </div>
                            
                            {/* TENGAH: Search Bar (TIDAK BERUBAH) */}
                            <div className="hidden md:flex flex-1 justify-center px-4 relative" ref={searchContainerRef}>
                                <form onSubmit={handleSearchSubmit} className="relative group w-full flex justify-center">
                                    <div className="relative w-full max-w-[350px] group-focus-within:max-w-[600px] transition-all duration-500 ease-in-out">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-focus-within:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </div>
                                        <input 
                                            ref={searchInputRef}
                                            type="text" 
                                            name="q" 
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            onFocus={() => { if(suggestions.length > 0) setShowDropdown(true); }}
                                            className="block w-full pl-12 pr-12 py-2.5 bg-gray-100 dark:bg-[#1A1A1A]/80 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:focus:ring-cyan-300/25 transition-all duration-300 shadow-sm dark:shadow-lg" 
                                            placeholder="Search films, TV shows, people..." 
                                            autoComplete="off" 
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span className="text-xs text-gray-500 border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 font-mono group-focus-within:text-cyan-500">/</span>
                                        </div>
                                    </div>
                                </form>

                                {/* HASIL DROPDOWN SEARCH */}
                                {showDropdown && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-2 w-full max-w-[600px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Top Results</span>
                                        </div>
                                        <ul>
                                            {suggestions.map((item) => (
                                                <li key={item.tconst}>
                                                    <Link 
                                                        href={`/title/${item.tconst}`}
                                                        className="flex items-center gap-4 px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors group border-b border-gray-100 dark:border-white/5 last:border-0"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden shrink-0 flex items-center justify-center text-gray-500">
                                                            <i className="fas fa-film"></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                                                                {item.primaryTitle}
                                                            </h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                                <span className="bg-gray-200 dark:bg-white/10 px-1.5 rounded text-[10px] uppercase font-bold">{item.titleType}</span>
                                                                <span>{item.startYear}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link 
                                            href={`/search?q=${keyword}`} 
                                            className="block text-center py-3 bg-gray-50 dark:bg-white/5 text-xs font-bold text-cyan-600 hover:text-cyan-500 hover:underline transition-all"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            View all results for "{keyword}"
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* KANAN: Tombol Aksi (TIDAK BERUBAH) */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Theme Toggle */}
                                <button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-[#00FFFF]/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-[#00FFFF]/30">
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-[#00FFFF] text-[20px]">
                                        {isDark ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </button>

                                {/* History */}
                                <Link href={auth.user ? "/history" : "/login"} className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 ${currentPath.includes('history') ? 'border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : ''}`}>
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-cyan-400 text-[20px]">history</span>
                                </Link>

                                {/* Favorite */}
                                <Link href={auth.user ? "/favorites" : "/login"} className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 ${currentPath.includes('favorites') ? 'border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : ''}`}>
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-cyan-400 text-[20px]">favorite</span>
                                </Link>

                                {/* User Menu */}
                                {auth.user ? (
                                    <div className="relative group">
                                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] border-2 border-transparent group-hover:border-cyan-500 dark:group-hover:border-[#00FFFF] transition-all duration-300 overflow-hidden shadow-md">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random&color=fff&size=128`} alt={auth.user.name} className="w-full h-full object-cover" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222]">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{auth.user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">dashboard</span> Dashboard
                                                </Link>
                                                <Link href="/logout" method="post" as="button" className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-white/5">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">logout</span> Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-[#00FFFF]/20 text-gray-600 dark:text-white transition-all duration-300 border border-transparent hover:border-cyan-200 dark:hover:border-[#00FFFF]/30">
                                            <span className="material-symbols-outlined text-[24px]">person</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                                            <div className="py-1">
                                                <Link href="/login" className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 transition-colors">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">login</span> Log In
                                                </Link>
                                                <Link href="/register" className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 transition-colors border-t border-gray-100 dark:border-white/5">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">person_add</span> Sign Up
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                )}
                
                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1">
                    {children}
                </main>

                {/* ================= FOOTER ================= */}
                {!isAuthPage && (
                    <footer className="relative bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-[#888888] py-10 px-4 sm:px-8 md:px-10 lg:px-20 mt-20 transition-colors duration-300">
                        <div className="absolute top-0 left-0 w-full h-24 -mt-24 bg-linear-to-b from-transparent to-white dark:to-[#1A1A1A] pointer-events-none transition-colors duration-300"></div>
                        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6">
                            
                            <div className="flex flex-row flex-wrap items-center justify-center gap-8 text-sm font-medium tracking-wide">
                                <Link href="/about" className="text-gray-700 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors duration-300 hover:scale-105 transform no-underline">
                                    About Us
                                </Link>
                                <a href="https://github.com/decaldara20/projectsmbd" target="_blank" rel="noreferrer" className="text-gray-700 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-white transition-colors duration-300 flex items-center gap-2 hover:scale-105 transform no-underline">
                                    <i className="fab fa-github text-lg"></i> <span>Source Code</span>
                                </a>
                            </div>

                            <div className="w-24 h-1 bg-linear-to-r from-transparent via-gray-300 dark:via-[#333] to-transparent rounded-full opacity-50"></div>

                            <div className="flex flex-col gap-1 text-xs text-gray-400 dark:text-[#555]">
                                <p>© 2025 IMTVDB. All rights reserved.</p>
                                <p className="opacity-70">
                                    Powered by <span className="text-[#FF2D20] font-bold">Laravel</span>
                                </p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>

            {/* Back To Top */}
            <button 
                onClick={scrollToTop} 
                className={`
                    fixed bottom-8 right-8 w-12 h-12 rounded-full 
                    bg-cyan-500 dark:bg-[#00FFFF] 
                    text-white dark:text-[#121212] 
                    hover:shadow-[0_0_18px_rgba(0,255,255,0.45)] 
                    dark:hover:shadow-[0_0_20px_rgba(0,255,255,0.35)] 
                    shadow-[0_0_8px_rgba(0,255,255,0.18)] 
                    dark:shadow-[0_0_10px_rgba(0,255,255,0.15)]
                    flex items-center justify-center z-50 
                    hover:scale-110 
                    transition-all duration-300 
                    ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}
                `}> 
                <i className="fas fa-arrow-up text-xl"></i> 
            </button>
        </div>
    );
}