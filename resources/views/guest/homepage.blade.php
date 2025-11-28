@extends('layouts.app')

@section('title', 'Beranda')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
@endsection

@section('content')

@php
    $bgImage = "https://via.placeholder.com/1920x800/111827/00E5FF?text=" . urlencode($heroMovie->primaryTitle ?? 'IMTVDB');
@endphp

<header class="hero" style="background-image: url('https://image.tmdb.org/t/p/original/{{ $heroMovie->poster_path }}');">
    <div class="hero-content">
        <h1 class="hero-title">{{ $heroMovie->primaryTitle ?? 'Data Tidak Ditemukan' }}</h1>
        
        <div class="hero-meta">
            <span class="rating-badge">
                <i class="fas fa-star"></i> {{ $heroMovie->averageRating ?? 'N/A' }}
            </span>
            <span>{{ $heroMovie->startYear ?? '-' }}</span>
            <span class="meta-tag">
                {{ $heroMovie->runtimeMinutes ? $heroMovie->runtimeMinutes . ' min' : 'N/A' }}
            </span>
        </div>

        <p class="hero-description">
            {{ $heroMovie->plot }} </p>
        </p>

        <div class="hero-actions">
            <a href="{{ isset($heroMovie->tconst) ? '/title/' . $heroMovie->tconst : '#' }}" class="btn-hero btn-primary">
                <i class="fas fa-play"></i> Lihat Detail
            </a>
        </div>
    </div>
</header>

    <div class="filter-trigger-container">
        <button class="btn-filter" onclick="toggleFilter()">
            <i class="fas fa-sliders-h"></i> Filter & Sortir
        </button>
    </div>

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
                    <option value="short">Short</option>
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Genre</label>
                <select name="genre" class="filter-select">
                    <option value="">Pilih Genre...</option>
                    @foreach($genres as $g) <option value="{{ $g }}">{{ $g }}</option> @endforeach
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Tahun Rilis</label>
                <select name="year" class="filter-select">
                    <option value="">Semua Tahun</option>
                    @foreach($years as $y) <option value="{{ $y }}">{{ $y }}</option> @endforeach
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Rating IMDb (Min)</label>
                <input type="number" name="rating_min" class="filter-input" placeholder="Contoh: 7.0" step="0.1" min="0" max="10">
            </div>

            <div class="filter-group">
                <label class="filter-label">Jumlah Vote (Min)</label>
                <input type="number" name="votes_min" class="filter-input" placeholder="Contoh: 50000">
            </div>

            <hr style="border-color: var(--border-color); margin: 20px 0;">

            <div class="filter-group">
                <label class="filter-label">Negara Asal</label>
                <select name="country" class="filter-select">
                    <option value="">Semua Negara</option>
                    @foreach($countries as $c) <option value="{{ $c }}">{{ $c }}</option> @endforeach
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Network / Platform</label>
                <select name="network" class="filter-select">
                    <option value="">Semua Network</option>
                    @foreach($networks as $n) <option value="{{ $n }}">{{ $n }}</option> @endforeach
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Status Produksi</label>
                <select name="status" class="filter-select">
                    <option value="">Semua Status</option>
                    @foreach($statuses as $s) <option value="{{ $s }}">{{ $s }}</option> @endforeach
                </select>
            </div>

            <div class="filter-group">
                <label class="filter-label">Tipe Serial</label>
                <select name="show_type" class="filter-select">
                    <option value="">Semua Tipe</option>
                    @foreach($types as $t) <option value="{{ $t }}">{{ $t }}</option> @endforeach
                </select>
            </div>

            <hr style="border-color: var(--border-color); margin: 20px 0;">

            <div class="filter-group">
                <label class="filter-label">Aktor / Pemeran</label>
                <input type="text" name="actor" class="filter-input" placeholder="Nama Aktor...">
            </div>

            <div class="filter-group">
                <label class="filter-label">Sutradara</label>
                <input type="text" name="director" class="filter-input" placeholder="Nama Sutradara...">
            </div>

            <button type="submit" class="btn-hero btn-primary" style="width: 100%; justify-content: center; margin-top: 20px;">
                Terapkan Filter
            </button>
        </form>
    </aside>


    <section class="content-section">
        <div class="section-header">
            <h2 class="section-title">Top Rated <span>Movies</span></h2>
            <a href="#" class="see-all">Lihat Semua <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="slider-container">
            @foreach($topMovies as $movie)
                <div class="movie-card" onclick="window.location.href='/title/{{ $movie->tconst }}'">
                    <img src="https://image.tmdb.org/t/p/w500/{{ $movie->poster_path ?? '' }}" 
                        alt="{{ $movie->primaryTitle }}" 
                        class="movie-poster"
                        onerror="this.src='https://via.placeholder.com/300x450/111/fff?text=No+Poster'">
                    
                    <div class="card-overlay">
                        <h4 class="card-title">{{ $movie->primaryTitle }}</h4>
                        <div class="card-meta">
                            <span>{{ $movie->startYear }}</span>
                            <span class="card-rating"><i class="fas fa-star"></i> {{ $movie->averageRating }}</span>
                        </div>
                    </div>

                    <div class="play-btn-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    <section class="content-section">
        <div class="section-header">
            <h2 class="section-title">Popular <span>TV Shows</span></h2>
            <a href="#" class="see-all">Lihat Semua <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="slider-container">
            @foreach($topShows as $show)
                <div class="movie-card" onclick="window.location.href='/title/{{ $show->tconst }}'">
                    <img src="https://image.tmdb.org/t/p/w500/{{ $show->poster_path ?? '' }}" 
                        class="movie-poster"
                        onerror="this.src='https://via.placeholder.com/300x450/111/fff?text=No+Poster'">
                    
                    <div class="card-overlay">
                        <h4 class="card-title">{{ $show->primaryTitle }}</h4>
                        <div class="card-meta">
                            <span>{{ $show->startYear }}</span>
                            <span class="card-rating"><i class="fas fa-star"></i> {{ $show->averageRating }}</span>
                        </div>
                    </div>
                    
                    <div class="play-btn-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    <script>
        function toggleFilter() {
            const panel = document.getElementById('filterPanel');
            panel.classList.toggle('active');
        }
    </script>

@endsection