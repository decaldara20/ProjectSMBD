@extends('layouts.app')

@section('title', 'Beranda')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
    <style>
        .content-section:first-of-type { margin-top: -60px; position: relative; z-index: 20; }
        .hero { min-height: 85vh; margin-top: 0; }
        .movie-poster { opacity: 0; transition: opacity 0.5s ease-in-out; }
        .movie-poster.loaded { opacity: 1; }
    </style>
@endsection

@section('content')

{{-- HERO SECTION --}}
@php
    // FIX: Gunakan tconst jika id tidak ada (karena data IMDb pakai tconst)
    $heroId = $heroMovie->tconst ?? $heroMovie->id ?? null;
    $heroTitle = $heroMovie->primaryTitle ?? $heroMovie->title ?? 'Featured Movie';
    
    // Fallback Image
    $heroBg = 'https://via.placeholder.com/1920x800/111827/00E5FF?text=' . urlencode($heroTitle);
@endphp

<header class="hero tmdb-hero-lazy" id="heroHeader" data-id="{{ $heroId }}" data-type="movie" style="background-image: url('{{ $heroBg }}');">
    <div class="hero-content">
        <h1 class="hero-title">{{ $heroTitle }}</h1>
        
        <div class="hero-meta">
            <span class="rating-badge">
                <i class="fas fa-star"></i> {{ number_format($heroMovie->averageRating ?? $heroMovie->vote_average ?? 0, 1) }}
            </span>
            <span>
                @if(isset($heroMovie->startYear)) {{ $heroMovie->startYear }}
                @elseif(isset($heroMovie->release_date)) {{ \Carbon\Carbon::parse($heroMovie->release_date)->year }}
                @endif
            </span>
            <span class="meta-tag">Trending Now</span>
        </div>

        <p class="hero-description">
            {{ \Illuminate\Support\Str::limit($heroMovie->overview ?? $heroMovie->plot ?? 'Sinopsis tidak tersedia.', 200) }}
        </p>

        <div class="hero-actions">
            <a href="/title/{{ $heroId ?? '#' }}" class="btn-hero btn-primary">
                <i class="fas fa-play"></i> Lihat Detail
            </a>
        </div>
    </div>
</header>

{{-- FILTER TRIGGER --}}
<div class="filter-trigger-container">
    <button class="btn-filter" onclick="toggleFilter()">
        <i class="fas fa-sliders-h"></i> Filter & Sortir
    </button>
</div>

{{-- PANEL FILTER --}}
<aside class="filter-panel" id="filterPanel">
    <div class="filter-header">
        <h3>Filter Lengkap</h3>
        <button onclick="toggleFilter()" style="background:none; border:none; color:var(--text-primary); font-size: 1.2rem; cursor:pointer;">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <form action="/search" method="GET">
        <div class="filter-group">
            <label class="filter-label">Tipe Konten</label>
            <select name="type" class="filter-select">
                <option value="">Semua</option>
                <option value="movie">Movies</option>
                <option value="tvSeries">TV Series</option>
            </select>
        </div>
        <div class="filter-group">
            <label class="filter-label">Genre</label>
            <select name="genre" class="filter-select">
                <option value="">Pilih Genre...</option>
                @foreach($genres ?? [] as $g) <option value="{{ $g }}">{{ $g }}</option> @endforeach
            </select>
        </div>
        <button type="submit" class="btn-hero btn-primary" style="width: 100%; justify-content: center; margin-top: 20px;">
            Terapkan Filter
        </button>
    </form>
</aside>


{{-- SLIDER 1: TOP RATED MOVIES --}}
<section class="content-section">
    <div class="section-header">
        <h2 class="section-title">Top Rated <span>Movies</span></h2>
        <a href="#" class="see-all">Lihat Semua <i class="fas fa-chevron-right"></i></a>
    </div>
    
    <div class="slider-container">
        @foreach($topMovies as $movie)
            {{-- FIX: Gunakan tconst agar link benar --}}
            <div class="movie-card" onclick="window.location.href='/title/{{ $movie->tconst ?? $movie->id ?? '#' }}'">
                <img 
                    src="https://placehold.co/300x450/222/888?text=Loading..." 
                    data-id="{{ $movie->tconst ?? $movie->id ?? '' }}"
                    data-type="movie"
                    alt="{{ $movie->title ?? $movie->primaryTitle }}" 
                    class="movie-poster tmdb-lazy"
                >
                
                <div class="card-overlay">
                    <h4 class="card-title">{{ $movie->title ?? $movie->primaryTitle }}</h4>
                    <div class="card-meta">
                        <span>{{ $movie->startYear ?? '-' }}</span>
                        <span class="card-rating"><i class="fas fa-star"></i> {{ number_format($movie->averageRating ?? 0, 1) }}</span>
                    </div>
                </div>
                <div class="play-btn-overlay"><i class="fas fa-play"></i></div>
            </div>
        @endforeach
    </div>
</section>

{{-- SLIDER 2: POPULAR TV SHOWS --}}
<section class="content-section">
    <div class="section-header">
        <h2 class="section-title">Popular <span>TV Shows</span></h2>
        <a href="#" class="see-all">Lihat Semua <i class="fas fa-chevron-right"></i></a>
    </div>
    
    <div class="slider-container">
        @foreach($topShows as $show)
            {{-- 
                LOGIKA ID YANG KUAT:
                1. Cek 'show_id' (Data TV Lokal)
                2. Cek 'tconst' (Data IMDb)
                3. Cek 'id' (Standar TMDB)
            --}}
            @php 
                $tvId = $show->show_id ?? $show->tconst ?? $show->id ?? null;
                $tvTitle = $show->name ?? $show->primaryTitle ?? 'Unknown Title';
                $tvYear = isset($show->first_air_date) ? \Carbon\Carbon::parse($show->first_air_date)->year : ($show->startYear ?? '-');
            @endphp
            
            <div class="movie-card" onclick="window.location.href='/tv/{{ $tvId }}'">
                {{-- Gunakan $tvId yang sudah dipastikan isinya --}}
                <img 
                    src="https://placehold.co/300x450/222/888?text=Loading..." 
                    data-id="{{ $tvId }}"
                    data-type="tv"
                    alt="{{ $tvTitle }}" 
                    class="movie-poster tmdb-lazy"
                >
                
                <div class="card-overlay">
                    <h4 class="card-title">{{ $tvTitle }}</h4>
                    <div class="card-meta">
                        <span>{{ $tvYear }}</span>
                        <span class="card-rating">
                            <i class="fas fa-star"></i> {{ number_format($show->vote_average ?? $show->averageRating ?? 0, 1) }}
                        </span>
                    </div>
                </div>
                <div class="play-btn-overlay"><i class="fas fa-play"></i></div>
            </div>
        @endforeach
    </div>
</section>

{{-- SCRIPT JAVASCRIPT --}}
<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 

    function toggleFilter() {
        document.getElementById('filterPanel').classList.toggle('active');
    }

    document.addEventListener("DOMContentLoaded", function() {
        // --- 1. LOAD SLIDER IMAGES ---
        const images = document.querySelectorAll('.tmdb-lazy');
        
        images.forEach(img => {
            const id = img.getAttribute('data-id');
            const type = img.getAttribute('data-type');
            const title = img.getAttribute('alt');

            const showPlaceholder = () => {
                img.src = `https://placehold.co/300x450/1a1a1a/666?text=${encodeURIComponent(title)}`;
                img.classList.add('loaded');
            };

            if (!id || !TMDB_API_KEY) { showPlaceholder(); return; }

            let url = '';
            // Logika: Kalau TV dan ID Angka -> Detail TV. Kalau Movie/ID String -> Find
            if (type === 'tv' && !isNaN(id)) {
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            } else {
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let path = null;
                    if (type === 'tv' && !isNaN(id)) {
                        path = data.poster_path; 
                    } else {
                        if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                    }

                    if (path) {
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                        img.onload = () => img.classList.add('loaded');
                        img.onerror = showPlaceholder;
                    } else {
                        showPlaceholder();
                    }
                })
                .catch(() => showPlaceholder());
        });

        // --- 2. LOAD HERO BACKGROUND ---
        const hero = document.getElementById('heroHeader');
        if (hero && TMDB_API_KEY) {
            const hId = hero.getAttribute('data-id');
            
            if(hId) {
                // Gunakan Find by External ID karena Hero Movie biasanya pakai ID IMDb (tt...)
                const hUrl = `https://api.themoviedb.org/3/find/${hId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

                fetch(hUrl)
                    .then(r => r.json())
                    .then(data => {
                        let bgPath = null;
                        if (data.movie_results?.length > 0) bgPath = data.movie_results[0].backdrop_path;
                        
                        if(bgPath) {
                            // Ganti background hero dengan gambar original
                            hero.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${bgPath}')`;
                        }
                    });
            }
        }
    });
</script>

@endsection