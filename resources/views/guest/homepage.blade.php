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

<section class="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
    
    <div id="heroBackground" 
        class="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out scale-110"
        style="background-image: url('{{ asset('images/hero-bg.png') }}');">
    </div>

    <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
    
    <div class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pointer-events-none z-10"></div>

    <div class="relative z-20 flex flex-col gap-6 max-w-4xl p-4 text-center">
        
        <div class="flex flex-col gap-4 animate-fade-in-up">
            <h1 class="text-white text-5xl font-black leading-tight tracking-[-0.033em] md:text-7xl drop-shadow-2xl font-display md:whitespace-nowrap"
                style="text-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                Track Films, Discover Shows
            </h1>
            
            <h2 class="text-gray-200 text-lg font-normal leading-relaxed md:text-xl max-w-2xl mx-auto drop-shadow-md">
                Your ultimate guide to the world of cinema and television. Join now to create your personalized watchlist.
            </h2>
        </div>
        
        <div class="flex justify-center mt-4">
            <a href="#trending" 
                class="group relative flex items-center justify-center overflow-hidden rounded-full px-10 py-4 bg-neon-cyan text-[#121212] text-lg font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]">
                <span class="relative z-10">Start Exploring</span>
                <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"></div>
            </a>
        </div>
    </div>
    
    <div id="heroNeonLine" 
        class="absolute bottom-0 left-0 w-full h-2 bg-neon-cyan shadow-[0_0_20px_#00FFFF] z-30 transition-all duration-75 ease-out"
        style="opacity: 1;">
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
                            <img src="https://via.placeholder.com/300x450/111/555?text=Loading..." 
                                data-id="{{ $movie->tconst }}" 
                                data-type="movie"
                                alt="{{ $movie->primaryTitle }}"
                                class="tmdb-poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                            
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
                            
                            <img src="https://via.placeholder.com/300x450/111/555?text=Loading..." 
                                data-id="{{ $show->show_id }}" 
                                data-type="tv"
                                class="tmdb-poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="{{ $show->name ?? $show->primaryTitle ?? 'TV Show' }}">

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

    <section class="mt-10">
        <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
            <div class="flex items-center gap-3 mb-2 px-2">
                <div class="w-1 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_#EC4899]"></div>
                <h2 class="text-gray-900 dark:text-white text-3xl font-bold font-display tracking-tight transition-colors">
                    Top Artists
                </h2>
            </div>
            
            <div class="flex overflow-x-auto pb-12 pt-4 px-4 -mx-4 gap-8 no-scrollbar">
                @foreach($topArtists as $artist)
                <a href="{{ isset($artist->nconst) ? '/person/'.$artist->nconst : '#' }}" 
                    class="flex flex-col gap-3 items-center group min-w-[140px] cursor-pointer">
                    
                    <div class="relative p-[3px] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                        
                        <div class="w-32 h-32 md:w-36 md:h-36 rounded-full bg-cover bg-center border-4 border-[#121212] overflow-hidden relative"
                            style="background-image: url('https://ui-avatars.com/api/?name={{ urlencode($artist->primaryName) }}&background=random&size=200');">
                            
                            <img src="https://via.placeholder.com/200x200" 
                                data-id="{{ $artist->nconst }}" 
                                data-type="person"
                                alt="{{ $artist->primaryName }}"
                                class="tmdb-poster absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
                                onload="this.classList.remove('opacity-0')"> 
                        </div>
                    </div>
                    
                    <div class="text-center mt-1">
                        <p class="text-gray-200 text-sm md:text-base font-semibold group-hover:text-pink-400 transition-colors truncate w-32">
                            {{ $artist->primaryName }}
                        </p>
                        <p class="text-gray-600 text-xs mt-0.5">{{ number_format($artist->TotalNumVotes) }} Votes</p>
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
                    let imagePath = null;

                    // LOGIKA PENGAMBILAN GAMBAR
                    if (type === 'person') {
                        // Khusus Artis: Ambil dari person_results -> profile_path
                        if (data.person_results && data.person_results.length > 0) {
                            imagePath = data.person_results[0].profile_path;
                        }
                    } else if (type === 'tv' && !isNaN(id)) {
                        // Khusus TV ID Angka
                        imagePath = data.poster_path;
                    } else {
                        // Khusus Movie & TV ID String
                        if (data.movie_results && data.movie_results.length > 0) {
                            imagePath = data.movie_results[0].poster_path;
                        } else if (data.tv_results && data.tv_results.length > 0) {
                            imagePath = data.tv_results[0].poster_path;
                        }
                    }

                    // TAMPILKAN GAMBAR JIKA ADA
                    if (imagePath) {
                        img.src = `https://image.tmdb.org/t/p/w500${imagePath}`;
                    }
                    // Jika tidak ada, biarkan default (UI Avatars / Placeholder)
                })
                .catch(error => console.error("Gagal fetch:", error));
        });
    });
</script>

@endsection