@extends('layouts.app')

@section('title', 'Popular Artists')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-[#121212] py-10 transition-colors duration-300">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display">
                <span class="text-pink-500">Explore</span> 
                {{ ucfirst($currentProfession == 'All' ? 'Artists' : $currentProfession . 's') }}
            </h1>
            
            <form action="{{ route('artists.index') }}" method="GET" class="relative">
                <input type="text" name="q" value="{{ request('q') }}" 
                       placeholder="Find an artist..." 
                       class="pl-10 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 rounded-full text-sm focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white w-64 transition-all">
                <i class="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
            </form>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
            @foreach($artists as $artist)
            <a href="{{ route('person.detail', $artist->nconst) }}" class="group flex flex-col items-center text-center gap-4">
                
                <div class="relative w-32 h-32 md:w-40 md:h-40 p-[3px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-pink-500/30">
                    
                    <div class="w-full h-full rounded-full bg-cover bg-center border-4 border-white dark:border-[#121212] overflow-hidden relative"
                         style="background-image: url('https://ui-avatars.com/api/?name={{ urlencode($artist->primaryName) }}&background=random&size=200');">
                         
                         <img src="https://via.placeholder.com/200x200" 
                              data-id="{{ $artist->nconst }}" 
                              data-type="person"
                              alt="{{ $artist->primaryName }}"
                              class="tmdb-poster absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
                              onload="this.classList.remove('opacity-0')">
                    </div>
                </div>

                <div>
                    <h3 class="text-gray-900 dark:text-gray-100 font-semibold text-base md:text-lg group-hover:text-pink-500 transition-colors line-clamp-1">
                        {{ $artist->primaryName }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-medium">
                        {{ number_format($artist->TotalNumVotes) }} Votes
                    </p>
                </div>
            </a>
            @endforeach
        </div>

        <div class="mt-16">
            {{ $artists->appends(request()->query())->links('pagination::tailwind') }}
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
            
            // Cari Person di TMDb
            const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    if (data.person_results?.length > 0 && data.person_results[0].profile_path) {
                        img.src = `https://image.tmdb.org/t/p/w400${data.person_results[0].profile_path}`;
                    }
                });
        });
    });
</script>
@endsection