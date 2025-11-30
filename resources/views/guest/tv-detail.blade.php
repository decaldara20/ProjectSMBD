@extends('layouts.app')

@section('title', $tvShow->primaryTitle ?? 'TV Show Detail')

@section('content')

<div class="relative w-full min-h-[85vh]">
    
    <div class="absolute inset-0 bg-cover bg-center opacity-30 tmdb-backdrop" 
         data-id="{{ $tvShow->show_id }}" 
         data-type="tv"
         style="background-image: url('https://via.placeholder.com/1920x800/1a1a1a/333');">
    </div>
    
    <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/70 to-transparent"></div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-10 items-start">
        
        <div class="w-full md:w-[300px] shrink-0 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 group perspective">
            <img src="https://via.placeholder.com/300x450/1a1a1a/666?text=Loading..." 
                 data-id="{{ $tvShow->show_id }}" 
                 data-type="tv"
                 alt="{{ $tvShow->primaryTitle }}"
                 class="tmdb-poster w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105">
        </div>

        <div class="flex-1 space-y-6 text-white">
            
            <div>
                <div class="flex items-center gap-3 mb-2">
                    @if($tvShow->status_name == 'Returning Series' || $tvShow->status_name == 'In Production')
                        <span class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider animate-pulse">
                            {{ $tvShow->status_name }}
                        </span>
                    @elseif($tvShow->status_name == 'Ended')
                        <span class="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                            Ended
                        </span>
                    @else
                        <span class="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs font-bold uppercase tracking-wider">
                            {{ $tvShow->status_name }}
                        </span>
                    @endif
                </div>
                
                <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none font-display">
                    {{ $tvShow->primaryTitle }}
                </h1>
                @if($tvShow->original_name != $tvShow->primaryTitle)
                    <p class="text-gray-400 text-sm italic mt-1">Original Title: {{ $tvShow->original_name }}</p>
                @endif
            </div>

            <div class="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                <div class="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                    <i class="fas fa-star"></i> 
                    <span class="text-lg font-bold">{{ number_format($tvShow->averageRating, 1) }}</span>
                </div>
                
                <span>{{ \Carbon\Carbon::parse($tvShow->startYear)->format('Y') }}</span>
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                
                <span class="text-white">{{ $tvShow->number_of_seasons }} Seasons</span>
                <span class="text-gray-500">({{ $tvShow->number_of_episodes }} Episodes)</span>
                
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span class="border border-gray-600 px-2 py-0.5 rounded text-xs">TV-MA</span>
            </div>

            <div class="flex flex-wrap gap-2">
                @if($tvShow->Genres_List)
                    @foreach(explode(',', $tvShow->Genres_List) as $genre)
                        <a href="/search?genre={{ trim($genre) }}" class="px-4 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-purple-400 text-xs font-bold uppercase tracking-wider transition-all">
                            {{ trim($genre) }}
                        </a>
                    @endforeach
                @endif
            </div>

            <div class="flex flex-wrap gap-4 pt-4">
                <form action="{{ route('favorites.toggle') }}" method="POST">
                    @csrf
                    <input type="hidden" name="id" value="{{ $tvShow->show_id }}">
                    <input type="hidden" name="type" value="tv">
                    <input type="hidden" name="title" value="{{ $tvShow->primaryTitle }}">
                    <input type="hidden" name="year" value="{{ \Carbon\Carbon::parse($tvShow->startYear)->format('Y') }}">
                    <input type="hidden" name="rating" value="{{ $tvShow->averageRating }}">
                    
                    <button type="submit" class="flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] hover:bg-pink-600 text-white font-bold rounded-full border border-white/10 hover:border-pink-500 transition-all shadow-lg hover:shadow-pink-500/30 group">
                        <i class="fas fa-heart group-hover:animate-pulse"></i> 
                        <span>Add to Favorites</span>
                    </button>
                </form>

                @if($tvShow->homepage)
                    <a href="{{ $tvShow->homepage }}" target="_blank" class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:-translate-y-1">
                        <i class="fas fa-external-link-alt"></i> Official Site
                    </a>
                @endif
            </div>

            <div class="pt-4 max-w-3xl">
                <h3 class="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">Overview</h3>
                <p class="text-lg text-gray-300 leading-relaxed">
                    {{ $tvShow->overview ?? 'Sinopsis belum tersedia.' }}
                </p>
            </div>

            <div class="pt-6 border-t border-white/10">
                <h4 class="text-gray-500 text-xs uppercase font-bold mb-2">Created By</h4>
                <div class="flex flex-wrap gap-4">
                    @if($tvShow->Creators_List)
                        @foreach(explode(',', $tvShow->Creators_List) as $creator)
                            <div class="flex items-center gap-2 text-white font-medium bg-white/5 px-3 py-1 rounded-lg">
                                <i class="fas fa-pen-nib text-gray-400 text-xs"></i> {{ trim($creator) }}
                            </div>
                        @endforeach
                    @else
                        <span class="text-gray-500 italic">Data kreator tidak tersedia</span>
                    @endif
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

        posters.forEach(img => {
            const id = img.getAttribute('data-id');
            // Endpoint KHUSUS TV (pake ID angka)
            const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    // Set Poster
                    if (data.poster_path) {
                        img.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                    }
                    
                    // Set Backdrop
                    if (data.backdrop_path) {
                        backdrops.forEach(bg => {
                            bg.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${data.backdrop_path}')`;
                        });
                    }
                });
        });
    });
</script>

@endsection