<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMTVDB - @yield('title', 'Homepage')</title>
    
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@400;500;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                    "primary": "#07b6d5",
                    "background-light": "#f5f8f8",
                    "background-dark": "#121212",
                    "neon-cyan": "#00FFFF",
                    },
                    fontFamily: {
                    "display": ["Spline Sans", "sans-serif"]
                    },
                    boxShadow: {
                    'neon': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
                    'neon-subtle': '0 0 5px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3)',
                    }
                },
            },
        }
    </script>

    <style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        body, header, .form-input, .card-bg { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }

        #backToTop { transition: all 0.4s ease; opacity: 0; visibility: hidden; }
        #backToTop.show { opacity: 1; visibility: visible; bottom: 40px; }

        .filter-backdrop { transition: opacity 0.3s ease-in-out; }
        .filter-panel { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .filter-open { overflow: hidden; } /* Kunci scroll body saat filter buka */
    </style>

</head>
    <body class="font-display bg-background-light dark:bg-background-dark text-[#EAEAEA]">
        <div class="relative w-full flex flex-col group/design-root min-h-screen">
            <div class="layout-container flex h-full grow flex-col">
                
                @unless(request()->routeIs('login') || request()->routeIs('register'))
                    <header class="sticky top-0 z-50 flex items-center justify-center whitespace-nowrap bg-background-dark/80 backdrop-blur-md border-b border-solid border-neon-cyan/20 px-4 sm:px-8 md:px-10 lg:px-20 py-3 transition-all duration-300">
                        <div class="flex w-full max-w-[1400px] items-center justify-between gap-4">
                            
                            <div class="flex items-center gap-8 shrink-0">
                                <a href="/" class="flex items-center gap-3 text-white no-underline group">
            
                                    <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-neon-cyan/50 transition-all duration-300">
                                        <div class="absolute inset-0 bg-neon-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <i class="fas fa-film text-neon-cyan text-xl relative z-10 transform group-hover:scale-110 transition-transform duration-300"></i>
                                    </div>

                                    <h2 class="text-3xl font-bold leading-tight tracking-[-0.015em] text-neon-cyan transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" 
                                        style="text-shadow: 0 0 10px rgba(0, 255, 255, 0.4);">
                                        IMTVDB
                                    </h2>
                                </a>
                                
                                <nav class="hidden xl:flex items-center gap-6">
                                    <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="/">Home</a>
                                    <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="{{ route('movies.index') }}">Movies</a>
                                    <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="{{ route('tv.index') }}">TV Shows</a>
                                    <!-- <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">Artists</a> -->
                                    <!-- <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">Genres</a> -->
                                </nav>
                            </div>

                            <div class="relative group">
                                <button class="flex items-center gap-1 text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium leading-normal focus:outline-none py-2">
                                    Artists
                                    <i class="fas fa-chevron-down text-[10px] transition-transform duration-300 group-hover:rotate-180 ml-1"></i>
                                </button>
                                
                                <div class="absolute left-0 top-full mt-0 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 overflow-hidden p-2">
                                    
                                    <a href="{{ route('artists.index', ['profession' => 'actor']) }}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors">
                                        <i class="fas fa-user-tie w-4 text-center"></i>
                                        <span>Popular Actors</span>
                                    </a>

                                    <a href="{{ route('artists.index', ['profession' => 'director']) }}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors">
                                        <i class="fas fa-video w-4 text-center"></i>
                                        <span>Directors</span>
                                    </a>

                                    <a href="{{ route('artists.index', ['profession' => 'writer']) }}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors">
                                        <i class="fas fa-pen-nib w-4 text-center"></i>
                                        <span>Writers</span>
                                    </a>

                                    <div class="h-px bg-white/10 my-1"></div>

                                    <a href="{{ route('artists.index') }}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors">
                                        <i class="fas fa-users w-4 text-center"></i>
                                        <span>All Artists</span>
                                    </a>
                                </div>
                            </div>

                            <div class="relative group">
                                <button class="flex items-center gap-1 text-gray-600 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-neon-cyan transition-colors duration-300 text-sm font-medium leading-normal focus:outline-none py-2">
                                    Genres
                                    <i class="fas fa-chevron-down text-[10px] transition-transform duration-300 group-hover:rotate-180 ml-1"></i>
                                </button>
                                
                                <div class="absolute left-0 top-full mt-0 w-[600px] bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 overflow-hidden p-6">
                                    
                                    <div class="grid grid-cols-3 gap-x-4 gap-y-2">
                                        @if(isset($globalGenres))
                                            @foreach($globalGenres as $genre)
                                                <a href="/search?genre={{ $genre->genre_name }}" 
                                                class="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-neon-cyan/10 hover:text-cyan-700 dark:hover:text-neon-cyan rounded-lg transition-colors truncate">
                                                    {{ $genre->genre_name }}
                                                </a>
                                            @endforeach
                                        @else
                                            <p class="text-xs text-red-500 col-span-3">Data Genre belum dimuat (Cek AppServiceProvider).</p>
                                        @endif
                                    </div>

                                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
                                        <span class="text-xs text-gray-400">Browse by Category</span>

                                        <button onclick="toggleFilterPanel()" class="text-xs text-cyan-600 dark:text-neon-cyan font-bold hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer">
                                            View Advanced Filter <i class="fas fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="hidden lg:flex flex-1 justify-center px-4">
                                <form action="/search" method="GET" class="relative group w-full flex justify-center">
                                    <div class="relative w-full max-w-[440px] group-focus-within:max-w-[650px] transition-all duration-500 ease-in-out">
                                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                                            <svg class="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                        </div>
                                        
                                        <input 
                                            type="text" 
                                            name="q" 
                                            id="globalSearch"
                                            class="block w-full pl-12 pr-12 py-2.5 bg-[#1A1A1A]/80 border border-gray-700 rounded-full text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:bg-black transition-all duration-300 shadow-lg" 
                                            placeholder="Search movies, TV shows, or artists..."
                                            autocomplete="off"
                                        >
                                        
                                        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span class="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5 font-mono group-focus-within:text-cyan-500 group-focus-within:border-cyan-500/50 transition-colors">/</span>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            <div class="flex items-center gap-3 shrink-0">
                                <button onclick="toggleFilterPanel()" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group border border-transparent hover:border-neon-cyan/30" title="Filter Advanced">
                                    <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]">tune</span>
                                </button>

                                <button id="theme-toggle" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group" title="Ganti Tema">
                                    <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]" id="theme-icon">dark_mode</span>
                                </button>

                                <a href="{{ route('history.index') }}" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-cyan-100 dark:hover:bg-neon-cyan/20 text-gray-600 dark:text-white transition-all duration-300 group border border-transparent hover:border-cyan-200 dark:hover:border-neon-cyan/30" title="Riwayat">
                                    <span class="material-symbols-outlined group-hover:text-cyan-600 dark:group-hover:text-neon-cyan text-[20px]">history</span>
                                </a>

                                <a href="{{ route('favorites.index') }}" 
                                    class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group border border-transparent hover:border-neon-cyan/30 no-underline" 
                                    title="Favorit Saya">
                                        <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]">favorite</span>
                                </a>
                            </div>

                            <div class="relative group">
                                <button class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent hover:border-neon-cyan/30">
                                    <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan">person</span>
                                </button>

                                <div class="absolute right-0 top-full mt-3 w-48 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50 overflow-hidden">
                                    
                                    <div class="px-4 py-3 border-b border-[#333] bg-[#222]">
                                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Account</p>
                                    </div>

                                    <div class="py-1">
                                        <a href="/login" class="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors">
                                            <span class="material-symbols-outlined text-[18px] mr-3">login</span>
                                            Log In
                                        </a>
                                        <a href="/register" class="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors border-t border-[#333]">
                                            <span class="material-symbols-outlined text-[18px] mr-3">person_add</span>
                                            Sign Up
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                @endunless

                <script>
                    document.addEventListener('keydown', function(e) {
                        // Jika tombol '/' ditekan
                        if (e.key === '/') {
                            const searchInput = document.getElementById('globalSearch');
                            // Cek apakah user sedang tidak mengetik di input lain
                            if (document.activeElement !== searchInput) {
                                e.preventDefault(); // Mencegah karakter '/' tertulis di input
                                searchInput.focus(); // Fokus ke search bar
                            }
                        }
                    });
                </script>

                <main class="flex-1">
                    @yield('content')
                </main>

                @unless(request()->routeIs('login') || request()->routeIs('register'))
                    <footer class="relative bg-[#1A1A1A] text-[#888888] py-10 px-4 sm:px-8 md:px-10 lg:px-20 mt-20">
            
                        <div class="absolute top-0 left-0 w-full h-24 -mt-24 bg-gradient-to-b from-transparent to-[#1A1A1A] pointer-events-none"></div>

                        <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6">

                            <div class="flex flex-row flex-wrap items-center justify-center gap-8 text-sm font-medium tracking-wide">
                                
                                <a href="{{ route('about') }}" class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 hover:scale-105 transform no-underline">
                                    About Us
                                </a>

                                <a href="https://github.com/decaldara20/projectsmbd" target="_blank" class="text-[#EAEAEA] hover:text-white transition-colors duration-300 flex items-center gap-2 hover:scale-105 transform no-underline">
                                    <i class="fab fa-github text-lg"></i> 
                                    <span>Source Code</span>
                                </a>

                            </div>

                            <div class="w-24 h-1 bg-gradient-to-r from-transparent via-[#333] to-transparent rounded-full opacity-50"></div>

                            <div class="flex flex-col gap-1 text-xs text-[#555]">
                                <p>&copy; 2025 IMTVDB. All rights reserved.</p>
                                <p class="opacity-70">
                                    Powered by <span class="text-[#FF2D20] font-bold">Laravel</span>
                                </p>
                            </div>

                        </div>
                    </footer>
                @endunless
            </div>
        </div>

        <button id="backToTop" onclick="scrollToTop()" class="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-neon-cyan text-[#121212] shadow-neon flex items-center justify-center z-50 hover:scale-110 transition-transform duration-300">
            <i class="fas fa-arrow-up text-xl"></i>
        </button>

        <script>
            // Elemen
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const htmlElement = document.documentElement;

            // 1. Cek Tema Saat Load (LocalStorage / System Preference)
            if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                htmlElement.classList.add('dark');
                themeIcon.textContent = 'light_mode'; // Ubah ikon jadi Matahari
            } else {
                htmlElement.classList.remove('dark');
                themeIcon.textContent = 'dark_mode'; // Ubah ikon jadi Bulan
            }

            // 2. Event Listener Tombol
            themeToggleBtn.addEventListener('click', function() {
                if (htmlElement.classList.contains('dark')) {
                    // Pindah ke Light Mode
                    htmlElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                    themeIcon.textContent = 'dark_mode';
                } else {
                    // Pindah ke Dark Mode
                    htmlElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                    themeIcon.textContent = 'light_mode';
                }
            });

            // Back to Top
            const backToTopBtn = document.getElementById("backToTop");
            window.onscroll = function() {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    backToTopBtn.classList.add("show");
                } else {
                    backToTopBtn.classList.remove("show");
                }
            };
            function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        </script>

        <!-- Backdrop -->
        <div id="filterBackdrop" 
            onclick="toggleFilterPanel()" 
            class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm opacity-0 invisible transition-all duration-300 ease-in-out">
        </div>

        <!-- Filter Panel -->
        <div id="filterPanel" class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#121212]/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 shadow-2xl z-[9999] transform translate-x-full filter-panel-transition flex flex-col">
            
            <!-- Header -->
            <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1A1A1A]/80">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 font-display tracking-tight">
                    <span class="material-symbols-outlined text-cyan-600 dark:text-neon-cyan text-2xl">tune</span> 
                    Advanced Filter
                </h3>
                <button onclick="toggleFilterPanel()" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all duration-300 group">
                    <span class="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">close</span>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <form action="/search" method="GET" id="filterForm">
                    
                    <!-- Content Type -->
                    <div class="space-y-4">
                        <label class="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-neon-cyan uppercase tracking-wider">
                            <span class="material-symbols-outlined text-base">category</span> Content Type
                        </label>
                        
                        <div class="flex flex-wrap gap-3">
                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="multi" class="peer sr-only" checked>
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">All</span>
                            </label>
                            
                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="movie" class="peer sr-only">
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">Movies</span>
                            </label>

                            
                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="videoGame" class="peer sr-only">
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">Game</span>
                            </label>

                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="short" class="peer sr-only">
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">Short</span>
                            </label>
                            
                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="tvSeries" class="peer sr-only">
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">TV Series</span>
                            </label>

                            <label class="cursor-pointer flex-1 min-w-[80px]">
                                <input type="radio" name="type" value="tvMiniSeries" class="peer sr-only">
                                <span class="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-medium text-gray-600 dark:text-gray-400 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 dark:peer-checked:bg-neon-cyan/20 dark:peer-checked:text-neon-cyan dark:peer-checked:border-neon-cyan hover:bg-gray-100 dark:hover:bg-white/5 transition-all shadow-sm">TV Mini Series</span>
                            </label>
                            
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px bg-gray-200 dark:bg-white/10 w-full my-6"></div>

                    <!-- Genre & Year -->
                    <div class="space-y-6">
                        <!-- Genre -->
                        <div class="space-y-3">
                            <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <span class="material-symbols-outlined text-base">theater_comedy</span> Genre
                            </label>
                            <div class="relative">
                                <select name="genre" class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-gray-200 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 p-3 pl-4 pr-10 appearance-none cursor-pointer hover:border-cyan-500 transition-colors">
                                    <option value="">Select Genre...</option>
                                    @if(isset($globalGenres))
                                        @foreach($globalGenres as $g)
                                            <option value="{{ $g->genre_name }}">{{ $g->genre_name }}</option>
                                        @endforeach
                                    @endif
                                </select>
                                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <i class="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>
                        </div>

                        <!-- Release Year -->
                        <div class="space-y-3">
                            <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <span class="material-symbols-outlined text-base">calendar_month</span> Release Year
                            </label>
                            <div class="flex items-center gap-3">
                                <div class="relative flex-1">
                                    <input type="number" name="year_min" placeholder="1900" min="1900" max="2025" class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-sm text-gray-900 dark:text-white p-3 pl-4 pr-12 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all">
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">MIN</span>
                                </div>
                                <span class="text-gray-400 font-bold">—</span>
                                <div class="relative flex-1">
                                    <input type="number" name="year_max" placeholder="2025" min="1900" max="2025" class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-sm text-gray-900 dark:text-white p-3 pl-4 pr-12 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all">
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">MAX</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px bg-gray-200 dark:bg-white/10 w-full my-6"></div>

                    <!-- Min Rating -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <span class="material-symbols-outlined text-base">star</span> Min Rating
                            </label>
                            <span class="px-3 py-1.5 bg-cyan-100 dark:bg-neon-cyan/10 text-cyan-700 dark:text-neon-cyan text-xs font-bold rounded-lg border border-cyan-200 dark:border-neon-cyan/30 min-w-[50px] text-center" id="ratingVal">0.0</span>
                        </div>
                        <input type="range" name="rating_min" min="0" max="10" step="0.1" value="0" 
                            class="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-neon-cyan hover:accent-cyan-500 transition-all"
                            oninput="document.getElementById('ratingVal').innerText = parseFloat(this.value).toFixed(1)">
                        <div class="flex justify-between text-[10px] text-gray-400 font-mono px-1">
                            <span>0</span>
                            <span>5</span>
                            <span>10</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px bg-gray-200 dark:bg-white/10 w-full my-6"></div>

                    <!-- TV Specifics -->
                    <div class="space-y-5">
                        <h4 class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/5">
                            <span class="material-symbols-outlined text-lg">live_tv</span> TV Specifics
                        </h4>
                        
                        <!-- Country Origin -->
                        <div class="space-y-3">
                            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Country Origin</label>
                            <div class="relative">
                                <select name="country" class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 p-3 pl-4 pr-10 appearance-none cursor-pointer hover:border-purple-500 transition-colors">
                                    <option value="">All Countries</option>
                                    <option value="US">United States (US)</option>
                                    <option value="KR">South Korea (KR)</option>
                                    <option value="JP">Japan (JP)</option>
                                    <option value="GB">United Kingdom (UK)</option>
                                    <option value="ID">Indonesia (ID)</option>
                                    <option disabled>──────────</option>
                                    @if(isset($countries))
                                        @foreach($countries as $c) 
                                            <option value="{{ $c }}">{{ $c }}</option> 
                                        @endforeach
                                    @endif
                                </select>
                                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <i class="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>
                        </div>

                        <!-- TV Status -->
                        <div class="grid grid-cols-2 gap-3">
                            <label class="flex items-center p-3.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all group">
                                <input type="checkbox" name="tv_status[]" value="Returning Series" class="w-4 h-4 rounded text-purple-600 bg-gray-100 dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0">
                                <span class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-500 transition-colors">Returning</span>
                            </label>

                            <label class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                                <input type="checkbox" name="tv_status[]" value="In Production" class="w-4 h-4 rounded text-purple-600 bg-gray-100 dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:ring-offset-0">
                                <span class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-500 transition-colors">In Production</span>
                            </label>
                            
                            <label class="flex items-center p-3.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all group">
                                <input type="checkbox" name="tv_status[]" value="Ended" class="w-4 h-4 rounded text-purple-600 bg-gray-100 dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0">
                                <span class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-500 transition-colors">Ended</span>
                            </label>

                            <label class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                                <input type="checkbox" name="tv_status[]" value="Canceled" class="w-4 h-4 rounded text-purple-600 bg-gray-100 dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:ring-offset-0">
                                <span class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-500 transition-colors">Canceled</span>
                            </label>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px bg-gray-200 dark:bg-white/10 w-full my-6"></div>

                    <!-- Cast & Crew -->
                    <div class="space-y-5">
                        <h4 class="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/5">
                            <span class="material-symbols-outlined text-lg">group</span> Cast & Crew
                        </h4>
                        
                        <div class="flex gap-3">
                            <!-- Role Selector -->
                            <div class="relative w-2/5">
                                <select name="role" class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-xs text-gray-900 dark:text-white p-3 pr-8 appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-pink-500 transition-colors">
                                    <option value="actor">Actor</option>
                                    <option value="director">Director</option>
                                    <option value="writer">Writer</option>
                                </select>
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <i class="fas fa-chevron-down text-[10px]"></i>
                                </span>
                            </div>
                            <!-- Name Input -->
                            <div class="relative flex-1">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <i class="fas fa-search text-sm"></i>
                                </span>
                                <input type="text" name="person_name" placeholder="Search Name..." class="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/20 rounded-xl text-sm text-gray-900 dark:text-white p-3 pl-10 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-pink-500 transition-all">
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            <!-- Footer Buttons -->
            <div class="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121212] flex gap-4 shadow-inner">
                <button type="button" onclick="document.getElementById('filterForm').reset(); document.getElementById('ratingVal').innerText = '0.0';" class="flex-1 py-3.5 rounded-xl border-2 border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/30 transition-all active:scale-95">
                    Reset All
                </button>
                <button type="submit" form="filterForm" class="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-neon-cyan dark:to-blue-500 text-white dark:text-black font-bold text-sm shadow-lg hover:shadow-cyan-500/30 dark:hover:shadow-neon-cyan/50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-lg">search</span> Show Results
                </button>
            </div>
        </div>

        <script>
            function toggleFilterPanel() {
                const panel = document.getElementById('filterPanel');
                const backdrop = document.getElementById('filterBackdrop');
                const body = document.body;

                // Jika panel sedang TERBUKA (tidak ada class translate-x-full)
                if (!panel.classList.contains('translate-x-full')) {
                    // TUTUP
                    panel.classList.add('translate-x-full');
                    backdrop.classList.add('opacity-0', 'invisible');
                    body.classList.remove('overflow-hidden'); // Lepas kunci scroll
                } else {
                    // BUKA
                    panel.classList.remove('translate-x-full');
                    backdrop.classList.remove('opacity-0', 'invisible');
                    body.classList.add('overflow-hidden'); // Kunci scroll halaman
                }
            }
        </script>

    </body>
</html>