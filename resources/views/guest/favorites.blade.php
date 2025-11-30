@extends('layouts.app')

@section('title', 'My Favorites')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-[#121212] py-10 transition-colors duration-300">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div class="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-3">
                <span class="material-symbols-outlined text-pink-500 text-4xl">favorite</span>
                My Favorites
            </h1>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1A1A1A] px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                {{ count($favorites) }} Items Saved
            </span>
        </div>

        @if(count($favorites) == 0)
            <div class="flex flex-col items-center justify-center py-32 text-center">
                <div class="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span class="material-symbols-outlined text-5xl text-gray-400">favorite_border</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Belum ada favorit</h2>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Simpan film dan serial TV yang ingin Anda tonton nanti dengan menekan tombol hati pada halaman detail.
                </p>
                <a href="{{ route('movies.index') }}" class="mt-8 px-8 py-3 bg-cyan-600 dark:bg-neon-cyan text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-cyan-500/50">
                    Mulai Menjelajah
                </a>
            </div>
        @else
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                @foreach($favorites as $item)
                @php
                    // Tentukan Link berdasarkan tipe
                    $link = '#';
                    if($item->type == 'movie') $link = route('title.detail', $item->id);
                    elseif($item->type == 'tv') $link = route('tv.detail', $item->id);
                    elseif($item->type == 'person') $link = route('person.detail', $item->id);
                @endphp

                <div class="relative group">
                    <a href="{{ $link }}" class="flex flex-col gap-3 cursor-pointer">
                        
                        <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1A1A1A] shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-pink-500/30 border border-gray-200 dark:border-white/5">
                            
                            <img src="https://via.placeholder.com/300x450?text=Loading..." 
                                 data-id="{{ $item->id }}" 
                                 data-type="{{ $item->type }}"
                                 alt="{{ $item->title }}"
                                 class="tmdb-poster w-full h-full object-cover transition-opacity duration-500 opacity-0"
                                 onload="this.classList.remove('opacity-0')">

                            <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10 shadow-sm">
                                {{ $item->type == 'tv' ? 'TV Show' : ucfirst($item->type) }}
                            </div>

                            @if($item->type != 'person' && isset($item->rating))
                            <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1 shadow-sm">
                                <i class="fas fa-star text-[10px]"></i> {{ number_format($item->rating, 1) }}
                            </div>
                            @endif
                            
                            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div class="px-1">
                            <h3 class="text-gray-900 dark:text-gray-200 text-sm font-semibold truncate group-hover:text-pink-500 transition-colors">
                                {{ $item->title }}
                            </h3>
                            <p class="text-gray-500 text-xs mt-1">
                                {{ isset($item->year) ? $item->year : 'Saved recently' }}
                            </p>
                        </div>
                    </a>
                    
                    <form action="{{ route('favorites.toggle') }}" method="POST" class="absolute -top-3 -right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-1">
                        @csrf
                        <input type="hidden" name="id" value="{{ $item->id }}">
                        <input type="hidden" name="type" value="{{ $item->type }}">
                        <input type="hidden" name="title" value="{{ $item->title }}">
                        
                        <button type="submit" class="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" title="Remove from Favorites">
                            <span class="material-symbols-outlined text-sm font-bold">close</span>
                        </button>
                    </form>
                </div>
                @endforeach
            </div>
        @endif
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 
    document.addEventListener("DOMContentLoaded", function() {
        const posters = document.querySelectorAll('.tmdb-poster');
        posters.forEach(img => {
            const id = img.getAttribute('data-id');
            const type = img.getAttribute('data-type');
            if (!id) return;
            
            let url = '';
            // Logika URL sama seperti homepage
            if (type === 'tv' && !isNaN(id)) url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            else url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            
            fetch(url).then(r => r.json()).then(data => {
                let path = null;
                if (type === 'person') { if (data.person_results?.length > 0) path = data.person_results[0].profile_path; }
                else if (type === 'tv' && !isNaN(id)) { path = data.poster_path; }
                else { 
                    if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path; 
                    else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path; 
                }

                if (path) img.src = `https://image.tmdb.org/t/p/w500${path}`;
                else {
                    // Fallback Image
                    if(type === 'person') img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt)}&background=random`;
                    else img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                    img.classList.remove('opacity-0');
                }
            });
        });
    });
</script>
@endsection