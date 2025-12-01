@extends('layouts.app')

@section('content')

{{-- CSS KHUSUS UNTUK BACKGROUND HERO DINAMIS --}}
<style>
    /* Light Mode - Pakai hero-bg(1).png */
    .hero-bg-dynamic {
        background-image: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.8) 100%), 
                            url('{{ asset("images/hero-bg(1).png") }}');
    }

    /* Dark Mode - Pakai hero-bg.png */
    .dark .hero-bg-dynamic {
        background-image: linear-gradient(rgba(18, 18, 18, 0.4) 0%, rgba(18, 18, 18, 0.8) 100%), 
                            url('{{ asset("images/hero-bg.png") }}');
    }
</style>

<section class="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-32 overflow-hidden group/hero">
    
    <div id="heroBackground" 
        class="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out scale-110"
        style="background-image: url('{{ asset('images/hero-bg.png') }}');">
    </div>

    <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
    
    <div class="absolute bottom-0 left-0 w-full h-[600px] bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent pointer-events-none z-10"></div>

    <div class="relative z-20 flex flex-col gap-4 max-w-5xl p-4 text-center">
        <div class="animate-fade-in-up" style="animation-delay: 0.1s;">
            <h1 class="text-white text-6xl md:text-8xl font-black leading-tight tracking-tighter drop-shadow-2xl font-display mb-2"
                style="text-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                Track Films, <br> <span class="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">Discover Shows</span>
            </h1>
            
            <h2 class="text-gray-200 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg opacity-90">
                Your ultimate guide to the world of cinema. <br class="hidden md:block"> Join now to create your personalized watchlist.
            </h2>
        </div>

        <div class="mt-12 animate-bounce text-white/50">
            <a href="#trending" class="cursor-pointer hover:text-neon-cyan transition-colors">
                <span class="text-xs font-bold tracking-widest uppercase block mb-2">Scroll Down</span>
                <i class="fas fa-chevron-down text-2xl"></i>
            </a>
        </div>
    </div>
</section>

<div class="relative z-20 bg-gray-50 dark:bg-[#121212] pb-20 pt-10 transition-colors duration-300">
    
    <section id="trending" class="scroll-mt-32">
        <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
            <div class="flex items-center gap-3 mb-2 px-2">
                <div class="w-1 h-8 bg-neon-cyan rounded-full shadow-[0_0_10px_#00FFFF]"></div>
                <h2 class="text-gray-900 dark:text-white text-3xl font-bold font-display tracking-tight transition-colors">
                    Trending Movies
                </h2>
                <i class="fas fa-fire text-orange-500 text-xl animate-pulse"></i>
            </div>
            
            <div class="relative group/slider">
                <div class="flex overflow-x-auto pb-12 pt-4 px-4 -mx-4 gap-6 no-scrollbar scroll-smooth snap-x">
                    @foreach($topMovies as $movie)
                        <a href="{{ isset($movie->tconst) ? '/title/'.$movie->tconst : '#' }}" 
                            class="relative flex-none w-[160px] md:w-[200px] flex flex-col gap-3 group snap-start cursor-pointer">
                            
                            <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] z-10">
                                
                                <div class="absolute inset-0 flex flex-col items-center justify-center opacity-30 text-center p-4 z-0">
                                    <i class="fas fa-film text-4xl text-gray-500 mb-2"></i>
                                    <span class="text-neon-cyan font-bold tracking-widest text-xs">IMTVDB</span>
                                    <span class="text-[10px] text-gray-500 mt-1 leading-tight line-clamp-2 px-2">
                                        {{ $movie->primaryTitle }}
                                    </span>
                                </div>
                            
                                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                                    data-id="{{ $movie->tconst }}" 
                                    data-type="movie"
                                    alt="{{ $movie->primaryTitle }}"
                                    class="tmdb-poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onload="this.classList.remove('opacity-0')">

                                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

                                <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                    <i class="fas fa-star text-[10px]"></i> {{ $movie->averageRating ?? 'N/A' }}
                                </div>
                            </div>

                            <div class="px-1">
                                <h3 class="text-gray-200 text-sm md:text-base font-semibold truncate group-hover:text-neon-cyan transition-colors">
                                    {{ $movie->primaryTitle }}
                                </h3>
                                <p class="text-gray-500 text-xs mt-1">{{ $movie->startYear ?? '-' }} • Movie</p>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    <section class="mt-10 bg-[#0F0F0F] py-10"> <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
            
            <div class="flex items-center gap-3 mb-4 px-2">
                <div class="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]"></div>
                <h2 class="text-gray-900 dark:text-white text-3xl font-bold font-display tracking-tight transition-colors">
                    Popular TV Shows
                </h2>
                <i class="fas fa-tv text-purple-400 text-xl animate-pulse"></i>
            </div>
            
            <div class="relative group/slider">
                <div class="flex overflow-x-auto pb-12 pt-4 px-4 -mx-4 gap-6 no-scrollbar scroll-smooth snap-x">
                    @foreach($topShows as $show)
                        <a href="/tv/{{ $show->show_id }}" 
                            class="relative flex-none w-[160px] md:w-[200px] flex flex-col gap-3 group snap-start cursor-pointer">
                            
                            <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] z-10">
                                
                                <div class="absolute inset-0 flex flex-col items-center justify-center opacity-30 text-center p-4 z-0">
                                    <i class="fas fa-tv text-4xl text-gray-500 mb-2"></i>
                                    <span class="text-purple-500 font-bold tracking-widest text-xs">IMTVDB</span>
                                    <span class="text-[10px] text-gray-500 mt-1 leading-tight line-clamp-2 px-2">
                                        {{ $show->name ?? $show->primaryTitle }}
                                    </span>
                                </div>

                                <img src="https://via.placeholder.com/300x450/111/555?text=Loading..." 
                                    data-id="{{ $show->show_id }}" 
                                    data-type="tv"
                                    class="tmdb-poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt="{{ $show->name ?? $show->primaryTitle ?? 'TV Show' }}"
                                    onload="this.classList.remove('opacity-0')">

                                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                    <i class="fas fa-star text-[10px]"></i> {{ number_format($show->vote_average ?? $show->averageRating ?? 0, 1) }}
                                </div>
                            </div>

                            <div class="px-1">
                                <h3 class="text-gray-200 text-sm md:text-base font-semibold truncate group-hover:text-purple-400 transition-colors">
                                    {{ $show->name ?? $show->primaryTitle }}
                                </h3>
                                <p class="text-gray-500 text-xs mt-1">
                                    {{ \Carbon\Carbon::parse($show->first_air_date ?? $show->startYear ?? now())->format('Y') }} • TV Series
                                </p>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

<section class="mt-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div class="w-full max-w-[1400px] mx-auto">
            <div class="flex items-center gap-3 mb-6 px-2 border-b border-gray-200 dark:border-white/10 pb-4">
                <i class="fas fa-users text-pink-500 text-2xl"></i>
                <h2 class="text-gray-900 dark:text-white text-3xl font-bold font-display tracking-tight transition-colors">
                    Top Artists
                </h2>
            </div>
            
            <div class="flex overflow-x-auto pb-12 pt-4 px-4 -mx-4 gap-12 no-scrollbar">
                
                @foreach($topArtists as $artist)
                <a href="{{ isset($artist->nconst) ? '/person/'.$artist->nconst : '#' }}" 
                   class="flex flex-col gap-4 items-center group min-w-[140px] cursor-pointer">
                    
                    <div class="relative p-[2px] rounded-full bg-transparent group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300 shadow-none group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                        
                        <div class="w-36 h-36 md:w-40 md:h-40 rounded-full bg-cover bg-center border-4 border-gray-100 dark:border-[#1A1A1A] transition-transform duration-300 group-hover:scale-95 relative overflow-hidden bg-gray-200 dark:bg-[#222]">
                             
                             <div class="absolute inset-0 bg-cover bg-center z-0" 
                                  style="background-image: url('https://ui-avatars.com/api/?name={{ urlencode($artist->primaryName) }}&background=random&size=200&color=fff');">
                             </div>

                             <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                                  data-id="{{ $artist->nconst }}" 
                                  data-type="person"
                                  alt="{{ $artist->primaryName }}"
                                  class="tmdb-poster absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 opacity-0"
                                  onload="this.classList.remove('opacity-0')"> 
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <p class="text-gray-800 dark:text-gray-200 text-base font-medium group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate w-36">
                            {{ $artist->primaryName }}
                        </p>
                        <p class="text-gray-500 dark:text-gray-600 text-xs mt-1 uppercase tracking-wider">
                            {{ number_format($artist->TotalNumVotes) }} VOTES
                        </p>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
    </section>

</div>

<script>
    // 1. Efek Parallax Mouse (Background Bergerak)
    document.addEventListener('mousemove', function(e) {
        const bg = document.getElementById('heroBackground');
        if (!bg) return;

        // Hitung posisi mouse relatif terhadap tengah layar
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        bg.style.transform = `scale(1.1) translate(${-x * 20}px, ${-y * 20}px)`;
    });

    // 2. Efek Scroll (Neon Line Blur)
    document.addEventListener('scroll', function() {
        const neonLine = document.getElementById('heroNeonLine');
        if (!neonLine) return;
        const scrollY = window.scrollY;
        const fadeEnd = 500;
        let opacity = 1 - (scrollY / fadeEnd);
        if (opacity < 0) opacity = 0;
        let blurAmount = (scrollY / fadeEnd) * 10;
        neonLine.style.opacity = opacity;
        neonLine.style.filter = `blur(${blurAmount}px)`;
    });
</script>

{{-- SCRIPT JAVASCRIPT --}}
<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; // API Key Kamu

    document.addEventListener("DOMContentLoaded", function() {
        const posters = document.querySelectorAll('.tmdb-poster');

        posters.forEach(img => {
            const id = img.getAttribute('data-id');   // ID (tt... atau nm... atau angka)
            const type = img.getAttribute('data-type'); // 'movie', 'tv', atau 'person'

            if (!id || !TMDB_API_KEY) return;

            let url = '';

            // TENTUKAN URL API
            if (type === 'tv' && !isNaN(id)) {
                // Khusus TV dengan ID angka
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            } else {
                // Untuk Movie, Person, atau TV dengan ID string (tt...)
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let path = null;
                    
                    // Logika Path Gambar
                    if (type === 'person') {
                        if (data.person_results?.length > 0) path = data.person_results[0].profile_path;
                    } else if (type === 'tv' && !isNaN(id)) {
                        path = data.poster_path;
                    } else {
                        if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                    }

                    // Jika ada gambar, pasang src dan load
                    if (path) {
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                        // 'onload' event di HTML akan otomatis hapus opacity-0 saat gambar siap
                    }
                    // Jika TIDAK ada gambar, biarkan saja (opacity tetap 0).
                    // Maka DIV layer bawah (Logo/Avatar) yang akan terlihat.
                })
                .catch(() => {
                    // Error silent, biarkan placeholder tampil
                });
        });
    });
</script>

@endsection