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
    </style>

</head>
<body class="font-display bg-background-light dark:bg-background-dark text-[#EAEAEA]">
    <div class="relative w-full flex flex-col group/design-root min-h-screen">
        <div class="layout-container flex h-full grow flex-col">
            
            <header class="sticky top-0 z-50 flex items-center justify-center whitespace-nowrap bg-background-dark/80 backdrop-blur-md border-b border-solid border-neon-cyan/20 px-4 sm:px-8 md:px-10 lg:px-20 py-3 transition-all duration-300">
                <div class="flex w-full max-w-[1400px] items-center justify-between gap-4">
                    
                    <div class="flex items-center gap-8 shrink-0">
                        <a href="/" class="flex items-center gap-2 text-white no-underline group">
                            <h2 class="text-3xl font-bold leading-tight tracking-[-0.015em] text-neon-cyan transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" 
                                style="text-shadow: 0 0 5px rgba(0, 255, 255, 0.4);">
                                IMTVDB
                            </h2>
                        </a>
                        
                        <nav class="hidden xl:flex items-center gap-6">
                            <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="/">Home</a>
                            <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">Movies</a>
                            <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">TV Shows</a>
                            <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">Artists</a>
                            <a class="text-[#EAEAEA] hover:text-neon-cyan transition-colors duration-300 text-sm font-medium" href="#">Genres</a>
                        </nav>
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
                        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group" title="Filter Advanced">
                            <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]">tune</span>
                        </button>

                        <button id="theme-toggle" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group" title="Ganti Tema">
                            <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]" id="theme-icon">dark_mode</span>
                        </button>

                        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group" title="Riwayat">
                            <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]">history</span>
                        </button>

                        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-neon-cyan/20 text-white transition-all duration-300 group" title="Favorit Saya">
                            <span class="material-symbols-outlined text-[#EAEAEA] group-hover:text-neon-cyan text-[20px]">favorite</span>
                        </button>

                        <a href="/login" class="flex h-10 px-6 items-center justify-center rounded-full bg-neon-cyan text-[#121212] text-sm font-bold tracking-wide hover:shadow-[0_0_15px_#00FFFF] hover:scale-105 transition-all duration-300">
                            Login
                        </a>
                    </div>
                </div>
            </header>

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

            <footer class="bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-[#888888] py-6 px-4 sm:px-8 md:px-10 lg:px-20 border-t border-gray-200 dark:border-[#282828] transition-colors duration-300">
                <div class="w-full max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
                    
                    <a href="#" class="text-base font-medium text-gray-800 dark:text-[#EAEAEA] hover:text-cyan-600 dark:hover:text-[#00FFFF] transition-colors duration-300">
                        About Us
                    </a>

                    <div class="flex flex-col gap-1 text-sm">
                        <p class="text-gray-500 dark:text-gray-400">© 2025 IMTVDB. All rights reserved.</p>
                        <p class="text-xs text-gray-400 dark:text-[#555]">Powered by <span class="text-[#FF2D20] font-bold">Laravel</span></p>
                    </div>
                </div>
            </footer>

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
</body>
</html>