@extends('layouts.app')

@section('title', 'Watch History')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-[#121212] py-10 transition-colors duration-300">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-3">
                <span class="material-symbols-outlined text-cyan-600 dark:text-neon-cyan text-4xl">history</span>
                Your History
            </h1>

            @if(count($history) > 0)
            <form action="{{ route('history.clear') }}" method="POST">
                @csrf
                <button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                    <i class="fas fa-trash-alt"></i> Clear History
                </button>
            </form>
            @endif
        </div>

        @if(count($history) == 0)
            <div class="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <i class="fas fa-history text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400">Belum ada riwayat yang dilihat.</p>
                <a href="/" class="mt-4 text-cyan-500 hover:underline">Mulai Menjelajah &rarr;</a>
            </div>
        @else
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                @foreach($history as $item)
                @php
                    // Tentukan Link berdasarkan tipe
                    $link = '#';
                    if($item->type == 'movie') $link = route('title.detail', $item->id);
                    elseif($item->type == 'tv') $link = route('tv.detail', $item->id);
                    elseif($item->type == 'person') $link = route('person.detail', $item->id);
                @endphp

                <a href="{{ $link }}" class="flex flex-col gap-3 group cursor-pointer relative">
                    
                    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1A1A1A] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/50 border border-gray-200 dark:border-white/5">
                        
                        <img src="https://via.placeholder.com/300x450?text=Loading..." 
                             data-id="{{ $item->id }}" 
                             data-type="{{ $item->type }}"
                             alt="{{ $item->title }}"
                             class="tmdb-poster w-full h-full object-cover transition-opacity duration-500 opacity-0"
                             onload="this.classList.remove('opacity-0')">

                        <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10">
                            {{ $item->type == 'tv' ? 'TV Series' : ucfirst($item->type) }}
                        </div>

                        @if($item->type != 'person' && $item->rating)
                        <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                            <i class="fas fa-star text-[10px]"></i> {{ number_format($item->rating, 1) }}
                        </div>
                        @endif
                    </div>

                    <div class="px-1">
                        <h3 class="text-gray-900 dark:text-gray-200 text-sm font-semibold truncate group-hover:text-cyan-600 dark:group-hover:text-neon-cyan transition-colors">
                            {{ $item->title }}
                        </h3>
                        <p class="text-gray-500 text-xs mt-1">
                            {{ $item->year ? $item->year : 'Seen just now' }}
                        </p>
                    </div>
                </a>
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
            if (type === 'tv' && !isNaN(id)) {
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            } else {
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }
            
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let path = null;
                    if (type === 'person') {
                        if (data.person_results?.length > 0) path = data.person_results[0].profile_path;
                    } else if (type === 'tv' && !isNaN(id)) {
                        path = data.poster_path;
                    } else {
                        if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                    }

                    if (path) {
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                    } else {
                        // Fallback jika gambar tidak ketemu
                        if(type === 'person') {
                            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt)}&background=random`;
                            img.classList.remove('opacity-0');
                        } else {
                            img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                            img.classList.remove('opacity-0');
                        }
                    }
                });
        });
    });
</script>
@endsection