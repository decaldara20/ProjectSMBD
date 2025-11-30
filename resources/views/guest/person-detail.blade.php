@extends('layouts.app')

@section('title', $person->primaryName)

@section('content')

<div class="relative w-full min-h-[80vh] bg-[#121212]">
    
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-20 flex flex-col md:flex-row gap-12 items-start">
        
        <div class="w-full md:w-[350px] shrink-0 group perspective">
            <div class="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#1A1A1A]">
                <img src="https://ui-avatars.com/api/?name={{ urlencode($person->primaryName) }}&size=500&background=random" 
                     data-id="{{ $person->nconst }}" 
                     data-type="person"
                     alt="{{ $person->primaryName }}"
                     class="tmdb-poster w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105">
            </div>
        </div>

        <div class="flex-1 space-y-8 text-white">
            
            <div class="animate-fade-in-up">
                <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none font-display mb-4 text-white">
                    {{ $person->primaryName }}
                </h1>
                <div class="flex flex-wrap gap-2">
                    @if($person->Professions_List)
                        @foreach(explode(',', $person->Professions_List) as $prof)
                            <span class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                                {{ trim($prof) }}
                            </span>
                        @endforeach
                    @endif
                </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 border-y border-white/10 py-8">
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Born</p>
                    <p class="text-2xl font-medium text-white font-display">{{ $person->birthYear ?? 'N/A' }}</p>
                </div>
                @if($person->deathYear)
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Died</p>
                    <p class="text-2xl font-medium text-red-400 font-display">{{ $person->deathYear }}</p>
                </div>
                @endif
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Total Credits</p>
                    <p class="text-2xl font-medium text-cyan-400 font-display">{{ $person->Total_Credits ?? 0 }} Titles</p>
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span class="w-1 h-6 bg-purple-500 rounded-full"></span> Biography
                </h3>
                <p class="text-gray-400 leading-relaxed tmdb-bio text-base">
                    Loading biography...
                </p>
            </div>
        </div>
    </div>
</div>

<section class="py-16 px-4 md:px-10 bg-[#0F0F0F]">
    <div class="w-full max-w-7xl mx-auto">
        <div class="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <span class="material-symbols-outlined text-purple-500 text-3xl">movie_filter</span>
            <h2 class="text-3xl font-bold text-white font-display">Known For</h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            @foreach($filmography as $movie)
                <a href="{{ str_starts_with($movie->tconst, 'tt') ? route('title.detail', $movie->tconst) : '#' }}" 
                   class="group flex flex-col gap-3 cursor-pointer">
                    
                    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/30">
                        <img src="https://via.placeholder.com/300x450/1a1a1a/666?text=Loading..." 
                             data-id="{{ $movie->tconst }}" 
                             data-type="movie" 
                             alt="{{ $movie->primaryTitle }}"
                             class="tmdb-poster w-full h-full object-cover opacity-0 transition-opacity duration-500"
                             onload="this.classList.remove('opacity-0')">
                        
                        <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10">
                            {{ $movie->category ?? 'Crew' }}
                        </div>
                    </div>

                    <div>
                        <h3 class="text-white text-sm font-semibold truncate group-hover:text-purple-400 transition-colors">
                            {{ $movie->primaryTitle }}
                        </h3>
                        <p class="text-gray-500 text-xs mt-1">{{ $movie->startYear ?? '-' }}</p>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 

    document.addEventListener("DOMContentLoaded", function() {
        const posters = document.querySelectorAll('.tmdb-poster');
        const bioText = document.querySelector('.tmdb-bio');
        
        // 1. Load Images (Profile & Movies)
        posters.forEach(img => {
            const id = img.getAttribute('data-id');
            const type = img.getAttribute('data-type');
            
            if (!id) return;

            // Logic URL: Person vs Movie
            const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let path = null;
                    
                    if (type === 'person') {
                        if (data.person_results?.length > 0) {
                            const person = data.person_results[0];
                            path = person.profile_path;
                            // Jika ini profil utama, ambil Biografi sekalian
                            if (bioText && person.id) fetchBio(person.id);
                        }
                    } else {
                        if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                    }

                    if (path) {
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                    } else {
                         // Fallback Image
                         if(type !== 'person') {
                            img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                            img.classList.remove('opacity-0');
                         }
                    }
                })
                .catch(console.error);
        });

        // 2. Helper: Fetch Biography Detail
        function fetchBio(tmdbId) {
            fetch(`https://api.themoviedb.org/3/person/${tmdbId}?api_key=${TMDB_API_KEY}`)
                .then(r => r.json())
                .then(data => {
                    if (data.biography) {
                        // Batasi panjang bio agar tidak terlalu panjang
                        const bio = data.biography.length > 600 ? data.biography.substring(0, 600) + '...' :