import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function MainLayout({ children }) {
    // 1. Global Data & State
    const { url, props } = usePage();
    const auth = props.auth || { user: null }; 
    const globalGenres = props.globalGenres || []; 
    const countries = props.countries || []; 

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const [isDark, setIsDark] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    
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

        // C. Click Outside Listener (Menutup dropdown saat klik sembarang tempat)
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // D. Keyboard Shortcut '/' untuk Search
        const handleKeyDown = (e) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
                document.removeEventListener('keydown', handleKeyDown);
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
        }, 300); // Tunggu 300ms

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
    
    // Logika pemotongan data
    const displayedGenres = showAllGenres 
        ? globalGenres 
        : globalGenres.slice(0, limitGenres);

    return (
        <div className="relative w-full flex flex-col group/design-root min-h-screen text-[#EAEAEA]">
            <div className="layout-container flex h-full grow flex-col">
                
                {/* ===================================================
                    HEADER (NAVBAR)
                   =================================================== */}
                {!isAuthPage && (
                    <header className="sticky top-0 z-50 flex items-center justify-center whitespace-nowrap bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-solid border-gray-200 dark:border-[#00FFFF]/20 px-4 sm:px-8 md:px-10 lg:px-20 py-3 transition-all duration-300">
                        <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
                            
                            {/* KIRI: Logo & Menu */}
                            <div className="flex items-center gap-8 shrink-0">
                                {/* Logo */}
                                <Link href="/" className="flex items-center gap-3 text-gray-900 dark:text-white no-underline group">
                                
                                    {/* Gambar Logo */}
                                    <img 
                                        src="/images/logo.png" 
                                        alt="IMTVDB Logo" 
                                        className="w-10 h-10 object-contain transition-all duration-300 transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] dark:group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" 
                                    />

                                    {/* Teks Logo */}
                                    <h2 
                                        className="text-3xl font-bold leading-tight tracking-[-0.015em] text-cyan-700 dark:text-[#00FFFF] transition-all duration-300 group-hover:text-cyan-500 dark:group-hover:text-[#00FFFF] group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] dark:group-hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]" 
                                        style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.15)' }}
                                    >
                                        IMTVDB
                                    </h2>
                                </Link>
                                
                                {/* Nav Links */}
                                <nav className="hidden lg:flex items-center gap-6">
                                    <Link href="/explore" className={`text-sm font-medium transition-colors duration-300 ${isActive('/explore') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>Explore</Link>
                                    <Link href="/films" className={`text-sm font-medium transition-colors duration-300 ${isActive('/films') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>Films</Link>
                                    <Link href="/tv-shows" className={`text-sm font-medium transition-colors duration-300 ${isActive('/tv-shows') ? 'text-cyan-600 dark:text-[#00FFFF] font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]' : 'text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF]'}`}>TV Shows</Link>
                                    
                                    {/* Artists Dropdown */}
                                    <div className="relative group">
                                        <button
                                            className={`
                                                flex items-center gap-1 text-sm font-medium py-2 transition-colors duration-300
                                                ${isActive('/artists')
                                                    ? 'text-cyan-400 dark:text-[#00FFFF] font-bold'
                                                    : 'text-gray-600 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-[#00FFFF]'
                                                }
                                            `}
                                        >
                                            Peoples
                                            <i className="fas fa-chevron-down text-[10px] ml-1 transition-transform duration-300 group-hover:rotate-180"></i>
                                        </button>

                                        <div
                                            className="
                                                absolute left-0 top-full mt-1 w-56
                                                bg-white/95 dark:bg-[#121212]/95
                                                border border-gray-200 dark:border-white/10
                                                rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.06)]
                                                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                                transition-all duration-300 z-50 overflow-hidden p-2
                                            "
                                        >
                                            {/* Actors */}
                                            <Link 
                                                href='/artists?profession=actor,actress'
                                                className="
                                                    flex items-center gap-3 px-4 py-2.5 text-sm
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-cyan-50 dark:hover:bg-cyan-500/10
                                                    hover:text-cyan-600 dark:hover:text-[#00FFFF]
                                                    rounded-lg transition-colors duration-200
                                                "
                                            >
                                                <i className="fas fa-user-tie w-4"></i> Actors
                                            </Link>

                                            {/* Directors */}
                                            <Link 
                                                href='/artists?profession=director'
                                                className="
                                                    flex items-center gap-3 px-4 py-2.5 text-sm
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-cyan-50 dark:hover:bg-cyan-500/10
                                                    hover:text-cyan-600 dark:hover:text-[#00FFFF]
                                                    rounded-lg transition-colors duration-200
                                                "
                                            >
                                                <i className="fas fa-video w-4"></i> Directors
                                            </Link>

                                            {/* Writers */}
                                            <Link 
                                                href='/artists?profession=writer'
                                                className="
                                                    flex items-center gap-3 px-4 py-2.5 text-sm
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-cyan-50 dark:hover:bg-cyan-500/10
                                                    hover:text-cyan-600 dark:hover:text-[#00FFFF]
                                                    rounded-lg transition-colors duration-200
                                                "
                                            >
                                                <i className="fas fa-pen-nib w-4"></i> Writers
                                            </Link>

                                            {/* Producers */}
                                            <Link 
                                                href='/artists?profession=producer'
                                                className="
                                                    flex items-center gap-3 px-4 py-2.5 text-sm
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-cyan-50 dark:hover:bg-cyan-500/10
                                                    hover:text-cyan-600 dark:hover:text-[#00FFFF]
                                                    rounded-lg transition-colors duration-200
                                                "
                                            >
                                                <i className="fas fa-clapperboard w-4"></i> Producers
                                            </Link>

                                            <div className="h-px bg-gray-300 dark:bg-white/10 my-2"></div>

                                            {/* All People */}
                                            <Link 
                                                href='/artists'
                                                className="
                                                    flex items-center gap-3 px-4 py-2.5 text-sm
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-cyan-50 dark:hover:bg-cyan-500/10
                                                    hover:text-cyan-600 dark:hover:text-[#00FFFF]
                                                    rounded-lg transition-colors duration-200
                                                "
                                            >
                                                <i className="fas fa-users w-4"></i> All People
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    {/* Genres Dropdown */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-1 text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors duration-300 text-sm font-medium focus:outline-none py-2">
                                            Genres <i className="fas fa-chevron-down text-[10px] ml-1 transition-transform group-hover:rotate-180"></i>
                                        </button>

                                        <div className="
                                            absolute left-0 top-full mt-2 w-[600px] 
                                            bg-white dark:bg-[#181818] 
                                            border border-gray-200 dark:border-white/10 
                                            rounded-xl shadow-2xl 
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                            transition-all duration-300 
                                            z-50 overflow-hidden p-6
                                        ">

                                            {/* Grid Genre */}
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                                {globalGenres.length > 0 ? (
                                                    <>
                                                        {displayedGenres.map((genre) => (
                                                            <Link 
                                                                key={genre.genre_name}
                                                                href={`/explore?genre=${genre.genre_name}`}
                                                                className="
                                                                    block px-3 py-2 text-sm 
                                                                    text-gray-600 dark:text-gray-300 
                                                                    hover:bg-cyan-50 
                                                                    dark:hover:bg-white/10 
                                                                    hover:text-cyan-700 
                                                                    dark:hover:text-[#00FFFF] 
                                                                    rounded-lg truncate transition-colors
                                                                "
                                                            >
                                                                {genre.genre_name}
                                                            </Link>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-red-500 col-span-3">Data Genre belum dimuat.</p>
                                                )}
                                            </div>

                                            {/* Tombol Show More / Less */}
                                            {globalGenres.length > limitGenres && (
                                                <div className="mt-3 text-center border-t border-gray-200 dark:border-white/10 pt-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Biar dropdown gak nutup
                                                            setShowAllGenres(!showAllGenres);
                                                        }}
                                                        className="
                                                            text-xs text-gray-500 
                                                            hover:text-cyan-600 
                                                            dark:hover:text-[#00FFFF] 
                                                            font-medium flex items-center justify-center gap-1 w-full py-1
                                                        "
                                                    >
                                                        {showAllGenres ? (
                                                            <>Show Less <i className="fas fa-chevron-up"></i></>
                                                        ) : (
                                                            <>Show All ({globalGenres.length - limitGenres} more) <i className="fas fa-chevron-down"></i></>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </nav>
                            </div>
                            
                            {/* TENGAH: Search Bar */}
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearchSubmit(e);
                                                    e.preventDefault(); // Jangan refresh halaman bawaan browser
                                                    setShowDropdown(false); // Tutup dropdown kalo ada
                                                    router.get('/search', { q: keyword }); // LANGSUNG PINDAH HALAMAN
                                                }
                                            }}
                                            onFocus={() => { if(suggestions.length > 0) setShowDropdown(true); }}
                                            className="block w-full pl-12 pr-12 py-2.5 bg-gray-100 dark:bg-[#1A1A1A]/80 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:focus:ring-cyan-300/25 focus:shadow-[0_0_12px_rgba(0,255,255,0.25)] dark:focus:shadow-[0_0_14px_rgba(0,255,255,0.15)] transition-all duration-300 shadow-sm dark:shadow-lg" 
                                            placeholder="Search films, TV shows, peoples..." 
                                            autoComplete="off" 
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span className="text-xs text-gray-500 border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 font-mono group-focus-within:text-cyan-500 group-focus-within:border-cyan-500/50">/</span>
                                        </div>
                                    </div>
                                </form>

                                {/* --- HASIL DROPDOWN --- */}
                                {showDropdown && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-2 w-full max-w-[600px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
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
                                                        {/* Thumbnail Placeholder */}
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
                                                                {item.averageRating && (
                                                                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                                                                        <i className="fas fa-star text-[8px]"></i> {Number(item.averageRating).toFixed(1)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <i className="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs group-hover:text-cyan-500 group-hover:translate-x-1 transition-all"></i>
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

                            {/* KANAN: Tombol Aksi */}
                            <div className="flex items-center gap-3 shrink-0">

                                {/* Theme Toggle */}
                                <button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-[#00FFFF]/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-[#00FFFF]/30" title="Ganti Tema">
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-[#00FFFF] text-[20px]">
                                        {isDark ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </button>

                                {/* History (Protected) */}
                                <Link href={auth.user ? "/history" : "/login"} className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 ${currentPath.includes('history') ? 'border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : ''}`} title="Riwayat">
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-cyan-400 text-[20px]">history</span>
                                </Link>

                                {/* Favorite (Protected) */}
                                <Link href={auth.user ? "/favorites" : "/login"} className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 ${currentPath.includes('favorites') ? 'border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : ''}`} title="Favorit Saya">
                                    <span className="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-cyan-400 text-[20px]">favorite</span>
                                </Link>

                                {/* User Menu Logic (@guest vs @auth) */}
                                {auth.user ? (
                                    /* SUDAH LOGIN */
                                    <div className="relative group">
                                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] border-2 border-transparent group-hover:border-cyan-500 dark:group-hover:border-[#00FFFF] transition-all duration-300 overflow-hidden shadow-md">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random&color=fff&size=128`} alt={auth.user.name} className="w-full h-full object-cover" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222]">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{auth.user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user.email}</p>
                                                <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-[#00FFFF]/20 dark:text-[#00FFFF] uppercase tracking-wider">Member</span>
                                            </div>
                                            <div className="py-1">
                                                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">dashboard</span> Dashboard
                                                </Link>
                                                <div className="h-px bg-gray-200 dark:bg-[#333] my-1"></div>
                                                <Link href="/logout" method="post" as="button" className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">logout</span> Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* BELUM LOGIN (TAMU) */
                                    <div className="relative group">
                                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-[#00FFFF]/20 text-gray-600 dark:text-white transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent hover:border-cyan-200 dark:hover:border-[#00FFFF]/30">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-[#EAEAEA] group-hover:text-cyan-600 dark:group-hover:text-[#00FFFF]">person</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222]">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="/login" className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors">
                                                    <span className="material-symbols-outlined text-[18px] mr-3">login</span> Log In
                                                </Link>
                                                <Link href="/register" className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-[#00FFFF]/10 hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors border-t border-gray-200 dark:border-[#333]">
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
                
                {/* ===================================================
                    MAIN CONTENT
                   =================================================== */}
                <main className="flex-1">
                    {children}
                </main>

                {/* ===================================================
                    FOOTER
                   =================================================== */}
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