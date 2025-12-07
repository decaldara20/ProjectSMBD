@extends('layouts.app')

@section('title', $person->primaryName)

@section('content')

<div class="relative w-full min-h-[80vh] bg-[#121212] overflow-hidden">
    
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[150px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24 flex flex-col md:flex-row gap-12 items-center md:items-start">
        
        <div class="w-64 md:w-[350px] shrink-0 relative group">
            <div class="relative rounded-full overflow-hidden aspect-square shadow-[0_0_60px_rgba(139,92,246,0.3)] border-4 border-[#1A1A1A] bg-[#1A1A1A] ring-1 ring-white/10">
                
                <img src="https://ui-avatars.com/api/?name={{ urlencode($person->primaryName) }}&size=500&background=random&color=fff" 
                        data-id="{{ $person->nconst }}" 
                        data-type="person"
                        alt="{{ $person->primaryName }}"
                        class="tmdb-poster w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-0"
                        onload="this.classList.remove('opacity-0')">
            </div>
            
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-bold shadow-lg md:hidden whitespace-nowrap">
                {{ $person->primaryName }}
            </div>
        </div>

        <div class="flex-1 space-y-8 text-center md:text-left">
            
            <div class="animate-fade-in-up">
                <h1 class="hidden md:block text-5xl md:text-7xl font-black tracking-tighter leading-none font-display text-white drop-shadow-lg mb-4">
                    {{ $person->primaryName }}
                </h1>
                
                <div class="flex flex-wrap justify-center md:justify-start gap-2">
                    @foreach(explode(',', $person->profession) as $prof)
                        <span class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-bold uppercase tracking-wider hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/50 transition-all cursor-default">
                            {{ trim($prof) }}
                        </span>
                    @endforeach
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6 border-y border-white/5 py-8 bg-white/5 rounded-2xl px-6 backdrop-blur-sm">
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Born</p>
                    <p class="text-xl md:text-2xl font-bold text-white font-display">{{ $person->birthYear ?? 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Died</p>
                    <p class="text-xl md:text-2xl font-bold text-gray-300 font-display">{{ $person->deathYear ?? '-' }}</p>
                </div>
                <div>
                    <p class="text-gray-500 text-xs uppercase font-bold mb-1 tracking-widest">Credits</p>
                    <p class="text-xl md:text-2xl font-bold text-cyan-400 font-display">{{ $person->Total_Credits ?? 0 }}</p>
                </div>
            </div>

            <div class="space-y-4 text-left">
                <h3 class="text-lg font-bold text-white flex items-center gap-3">
                    <div class="w-1 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
                    Biography
                </h3>
                <div class="relative">
                    <p class="text-gray-400 text-lg leading-relaxed tmdb-bio line-clamp-6 transition-all duration-500">
                        Loading biography information from external database...
                    </p>
                    <button onclick="this.previousElementSibling.classList.remove('line-clamp-6'); this.remove()" class="text-cyan-500 text-sm font-bold hover:underline mt-2 hidden bio-read-more">
                        Read Full Bio
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<section class="py-16 px-4 md:px-10 bg-[#0F0F0F]">
    <div class="w-full max-w-7xl mx-auto">
        <div class="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
            <span class="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <i class="fas fa-film text-xl"></i>
            </span>
            <div>
                <h2 class="text-3xl font-bold text-white font-display">Filmography</h2>
                <p class="text-gray-500 text-sm">Known for {{ $filmography->count() }} titles</p>
            </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            @foreach($filmography as $movie)
                <a href="{{ str_starts_with($movie->tconst, 'tt') ? route('title.detail', $movie->tconst) : '#' }}" 
                   class="group flex flex-col gap-3 cursor-pointer">
                    
                    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/30 group-hover:border-purple-500/30">
                        <img src="https://via.placeholder.com/300x450/1a1a1a/666?text=Loading..." 
                             data-id="{{ $movie->tconst }}" 
                             data-type="movie" 
                             alt="{{ $movie->primaryTitle }}"
                             class="tmdb-poster w-full h-full object-cover opacity-0 transition-opacity duration-500"
                             onload="this.classList.remove('opacity-0')">
                        
                        <div class="absolute top-2 left-2">
                            <span class="bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10 shadow-sm">
                                {{ $movie->category ?? 'Cast' }}
                            </span>
                        </div>
                    </div>

                    <div class="px-1">
                        <h3 class="text-white text-sm font-semibold truncate group-hover:text-purple-400 transition-colors">
                            {{ $movie->primaryTitle }}
                        </h3>
                        <p class="text-gray-500 text-xs mt-1 font-medium">{{ $movie->startYear ?? '-' }}</p>
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
        const readMoreBtn = document.querySelector('.bio-read-more');
        
        // 1. Load Images & Bio
        posters.forEach(img => {
            const id = img.getAttribute('data-id');
            const type = img.getAttribute('data-type');
            
            if (!id) return;

            const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let path = null;
                    
                    if (type === 'person') {
                        if (data.person_results?.length > 0) {
                            const person = data.person_results[0];
                            path = person.profile_path;
                            
                            // Fetch Bio Detail jika ini profil utama
                            if (bioText && person.id) fetchBio(person.id);
                        }
                    } else {
                        // Logic Poster Film
                        if (data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                    }

                    if (path) {
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                    } else {
                         // Fallback jika gambar tidak ada
                         if(type !== 'person') {
                            img.src = `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent(img.alt)}`;
                            img.classList.remove('opacity-0');
                         } else {
                            // Jika foto orang gagal load, biarkan UI Avatar default
                            img.classList.remove('opacity-0');
                         }
                    }
                })
                .catch(console.error);
        });

        // 2. Helper: Fetch Biography Text
        function fetchBio(tmdbId) {
            fetch(`https://api.themoviedb.org/3/person/${tmdbId}?api_key=${TMDB_API_KEY}`)
                .then(r => r.json())
                .then(data => {
                    if (data.biography) {
                        bioText.textContent = data.biography;
                        // Tampilkan tombol Read More jika teks panjang
                        if(data.biography.length > 300 && readMoreBtn) {
                            readMoreBtn.classList.remove('hidden');
                        }
                    } else {
                        bioText.textContent = "Biography details are not available for this artist.";
                    }
                });
        }
    });
</script>

@endsection