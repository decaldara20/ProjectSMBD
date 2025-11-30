@extends('layouts.app')

@section('title', $title->primaryTitle)

@section('content')

<div class="relative w-full min-h-[80vh]">
    
    <div class="absolute inset-0 bg-cover bg-center opacity-30 tmdb-backdrop" 
         data-id="{{ $title->tconst }}" 
         data-type="movie"
         style="background-image: url('https://via.placeholder.com/1920x800/1a1a1a/333');">
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent"></div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-10 items-start">
        
        <div class="w-full md:w-[300px] shrink-0 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 group perspective">
            <img src="https://via.placeholder.com/300x450/1a1a1a/666?text=Loading..." 
                 data-id="{{ $title->tconst }}" 
                 data-type="movie"
                 alt="{{ $title->primaryTitle }}"
                 class="tmdb-poster w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105">
        </div>

        <div class="flex-1 space-y-6 text-white">
            
            <div>
                <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none font-display mb-2">
                    {{ $title->primaryTitle }}
                </h1>
                @if($title->originalTitle != $title->primaryTitle)
                    <p class="text-gray-400 text-sm italic">Original Title: {{ $title->originalTitle }}</p>
                @endif
            </div>

            <div class="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                <div class="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                    <i class="fas fa-star"></i> 
                    <span class="text-lg font-bold">{{ $title->averageRating ?? 'N/A' }}</span>
                    <span class="text-xs text-gray-500">/10</span>
                </div>
                
                <span>{{ $title->startYear }}</span>
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>{{ $title->runtimeMinutes ? $title->runtimeMinutes . ' min' : 'N/A' }}</span>
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span class="border border-gray-600 px-2 py-0.5 rounded text-xs">
                    {{ $title->isAdult ? '18+' : 'PG-13' }}
                </span>
            </div>

            <div class="flex flex-wrap gap-2">
                @foreach(explode(',', $title->Genres_List) as $genre)
                    <a href="/search?genre={{ trim($genre) }}" class="px-4 py-1.5 rounded-full bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/50 text-gray-300 hover:text-neon-cyan text-xs font-bold uppercase tracking-wider transition-all">
                        {{ trim($genre) }}
                    </a>
                @endforeach
            </div>

            <div class="flex flex-wrap gap-4 pt-4">
                <form action="{{ route('favorites.toggle') }}" method="POST">
                    @csrf
                    <input type="hidden" name="id" value="{{ $title->tconst }}">
                    <input type="hidden" name="type" value="movie">
                    <input type="hidden" name="title" value="{{ $title->primaryTitle }}">
                    <input type="hidden" name="year" value="{{ $title->startYear }}">
                    <input type="hidden" name="rating" value="{{ $title->averageRating }}">
                    
                    <button type="submit" class="flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] hover:bg-pink-600 text-white font-bold rounded-full border border-white/10 hover:border-pink-500 transition-all shadow-lg hover:shadow-pink-500/30 group">
                        <i class="fas fa-heart group-hover:animate-pulse"></i> 
                        <span>Add to Favorites</span>
                    </button>
                </form>

                <button class="flex items-center gap-2 px-6 py-3 bg-neon-cyan hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1">
                    <i class="fas fa-play"></i> Watch Trailer
                </button>
            </div>

            <div class="pt-4 max-w-3xl">
                <h3 class="text-neon-cyan font-bold uppercase tracking-widest text-xs mb-2">Overview</h3>
                <p class="text-lg text-gray-300 leading-relaxed tmdb-overview">
                    Loading plot details...
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                    <h4 class="text-gray-500 text-xs uppercase font-bold mb-1">Directors</h4>
                    <p class="text-white">{{ $title->Directors_List ?? 'N/A' }}</p>
                </div>
                <div>
                    <h4 class="text-gray-500 text-xs uppercase font-bold mb-1">Writers</h4>
                    <p class="text-white">{{ $title->Writers_List ?? 'N/A' }}</p>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 

    document.addEventListener("DOMContentLoaded", function() {
        const posters = document.querySelectorAll('.tmdb-poster');
        const backdrops = document.querySelectorAll('.tmdb-backdrop');
        const overviewText = document.querySelector('.tmdb-overview');

        posters.forEach(img => {
            const id = img.getAttribute('data-id'); // ID IMDb (tt...)
            
            if (!id) return;

            // Panggil Endpoint FIND
            const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let result = null;

                    // LOGIKA BARU: Cek Movie dulu, kalau tidak ada cek TV
                    if (data.movie_results && data.movie_results.length > 0) {
                        result = data.movie_results[0];
                    } else if (data.tv_results && data.tv_results.length > 0) {
                        result = data.tv_results[0];
                    }

                    if (result) {
                        // 1. Set Poster
                        if (result.poster_path) {
                            img.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
                        }
                        
                        // 2. Set Backdrop (Background Besar)
                        if (result.backdrop_path) {
                            backdrops.forEach(bg => {
                                bg.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${result.backdrop_path}')`;
                            });
                        }

                        // 3. Set Overview (Sinopsis)
                        if (result.overview && overviewText) {
                            overviewText.textContent = result.overview;
                        }
                    } else {
                        // Fallback jika tidak ditemukan di TMDb
                        if (overviewText) overviewText.textContent = "Detail sinopsis belum tersedia.";
                    }
                })
                .catch(err => console.error("Gagal mengambil data TMDb:", err));
        });
    });
</script>

@endsection