@extends('layouts.app')

@section('title', 'Search Results')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-[#121212] py-10 transition-colors duration-300">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div class="mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Search Results For</p>
            <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white font-display">
                "{{ $query }}"
            </h1>
            <div class="mt-4 flex flex-wrap gap-2">
                @if(request('type'))
                    <span class="px-3 py-1 rounded-full bg-cyan-100 dark:bg-neon-cyan/10 text-cyan-700 dark:text-neon-cyan text-xs font-bold border border-cyan-200 dark:border-neon-cyan/30">
                        Type: {{ ucfirst(request('type') == 'multi' ? 'All' : request('type')) }}
                    </span>
                @endif
                @if(request('genre'))
                    <span class="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-500/30">
                        Genre: {{ request('genre') }}
                    </span>
                @endif
                @if(request('year_min') || request('year_max'))
                    <span class="px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold border border-gray-300 dark:border-white/20">
                        Year: {{ request('year_min') ?? '...' }} - {{ request('year_max') ?? '...' }}
                    </span>
                @endif
            </div>
        </div>

        @if($results->isEmpty())
            <div class="flex flex-col items-center justify-center py-32 text-center">
                <div class="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-5xl text-gray-400">search_off</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No results found</h2>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Kami tidak dapat menemukan apa pun untuk "{{ $query }}". Coba gunakan kata kunci lain atau kurangi filter.
                </p>
                <a href="/" class="mt-8 px-8 py-3 bg-cyan-600 dark:bg-neon-cyan text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                    Back to Home
                </a>
            </div>
        @else
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                @foreach($results as $item)
                    @php
                        // Tentukan Link berdasarkan tipe data
                        $link = '#';

                        // 1. FILM & TV (Sumber IMDb) -> Arahkan ke rute 'title.detail'
                        // Tambahkan 'tvSeries_imdb' di sini agar tidak mati link-nya
                        if($item->type == 'movie' || $item->type == 'tvSeries_imdb') {
                            $link = route('title.detail', $item->id);
                        }
                        // 2. TV SHOW (Sumber TV Dataset) -> Arahkan ke rute 'tv.detail'
                        elseif($item->type == 'tv' || $item->type == 'tvSeries') {
                            $link = route('tv.detail', $item->id);
                        }
                        // 3. ORANG -> Arahkan ke rute 'person.detail'
                        elseif($item->type == 'person') {
                            $link = route('person.detail', $item->id);
                        }
                    @endphp

                    <a href="{{ $link }}" class="group flex flex-col gap-3 cursor-pointer relative">
                        
                        <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1A1A1A] shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/30 border border-gray-200 dark:border-white/5">
                            
                            <img src="https://via.placeholder.com/300x450?text=Loading..." 
                                data-id="{{ $item->id }}" 
                                data-type="{{ $item->type == 'tvSeries' ? 'tv' : $item->type }}"
                                alt="{{ $item->title }}"
                                class="tmdb-poster w-full h-full object-cover transition-opacity duration-500 opacity-0"
                                onload="this.classList.remove('opacity-0')">

                            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10">
                                {{ $item->type == 'tvSeries' ? 'TV' : ucfirst($item->type) }}
                            </div>

                            @if($item->type != 'person' && isset($item->averageRating))
                                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1 shadow-sm">
                                    <i class="fas fa-star text-[10px]"></i> {{ number_format($item->averageRating, 1) }}
                                </div>
                            @endif
                        </div>

                        <div class="px-1">
                            <h3 class="text-gray-900 dark:text-gray-200 text-sm font-semibold truncate group-hover:text-cyan-600 dark:group-hover:text-neon-cyan transition-colors">
                                {{ $item->title }}
                            </h3>
                            <p class="text-gray-500 text-xs mt-1">
                                @if($item->type == 'person')
                                    {{ $item->known_for ?? 'Artist' }}
                                @else
                                    {{ $item->startYear ?? '-' }}
                                @endif
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
            if (type === 'tv' && !isNaN(id)) url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            else url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            
            fetch(url).then(r => r.json()).then(data => {
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
                    // Fallback Images
                    if(type === 'person') img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt)}&background=random`;
                    else img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                    img.classList.remove('opacity-0');
                }
            });
        });
    });
</script>
@endsection