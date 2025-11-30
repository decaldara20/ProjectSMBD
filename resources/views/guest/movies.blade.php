@extends('layouts.app')

@section('title', 'Movies Catalog')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-[#121212] py-10 transition-colors duration-300">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display">
                <span class="text-cyan-600 dark:text-neon-cyan">Explore</span> Movies
            </h1>
            
            <form action="{{ route('movies.index') }}" method="GET" class="flex gap-2">
                <select name="genre" class="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5">
                    <option value="">All Genres</option>
                    @foreach($genres as $g)
                        <option value="{{ $g }}" {{ request('genre') == $g ? 'selected' : '' }}>{{ $g }}</option>
                    @endforeach
                </select>
                <button type="submit" class="px-4 py-2 bg-cyan-600 dark:bg-neon-cyan text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">
                    Filter
                </button>
            </form>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            @foreach($movies as $movie)
            <a href="{{ isset($movie->tconst) ? '/title/'.$movie->tconst : '#' }}" 
               class="flex flex-col gap-3 group cursor-pointer">
                
                <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1A1A1A] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/50 border border-gray-200 dark:border-white/5">
                    
                    <img src="https://via.placeholder.com/300x450?text=Loading..." 
                         data-id="{{ $movie->tconst }}" 
                         data-type="movie"
                         alt="{{ $movie->primaryTitle }}"
                         class="tmdb-poster w-full h-full object-cover transition-opacity duration-500 opacity-0"
                         onload="this.classList.remove('opacity-0')">

                    <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                        <i class="fas fa-star text-[10px]"></i> {{ $movie->averageRating }}
                    </div>
                </div>

                <div class="px-1">
                    <h3 class="text-gray-900 dark:text-gray-200 text-sm font-semibold truncate group-hover:text-cyan-600 dark:group-hover:text-neon-cyan transition-colors">
                        {{ $movie->primaryTitle }}
                    </h3>
                    <p class="text-gray-500 text-xs mt-1">{{ $movie->startYear }}</p>
                </div>
            </a>
            @endforeach
        </div>

        <div class="mt-12">
            {{ $movies->appends(request()->query())->links('pagination::tailwind') }}
        </div>
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 
    document.addEventListener("DOMContentLoaded", function() {
        const posters = document.querySelectorAll('.tmdb-poster');
        posters.forEach(img => {
            const id = img.getAttribute('data-id');
            if (!id) return;
            const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    if (data.movie_results?.length > 0 && data.movie_results[0].poster_path) {
                        img.src = `https://image.tmdb.org/t/p/w500${data.movie_results[0].poster_path}`;
                    } else {
                        img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                        img.classList.remove('opacity-0');
                    }
                });
        });
    });
</script>
@endsection