import React, { useEffect } from 'react'; // Import useEffect
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

// --- CONFIG API KEY ---
// Pastikan VITE_TMDB_API_KEY ada di file .env Anda: VITE_TMDB_API_KEY=f19a5ce3a90ddee4579a9f37d5927676
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'f19a5ce3a90ddee4579a9f37d5927676'; 

export default function Homepage({ topMovies, topShows, topArtists }) {

    // --- MESIN PENCARI GAMBAR OTOMATIS (Added Logic) ---
    useEffect(() => {
        // Ambil semua kartu yang butuh gambar
        const cards = document.querySelectorAll('.tmdb-loading-card');
        
        cards.forEach(card => {
            const id = card.getAttribute('data-tmdb-id');
            const type = card.getAttribute('data-tmdb-type');
            const img = card.querySelector('img');

            if (!id || !type || !img) return;
            // Jika gambar sudah diload sebelumnya, skip
            if (img.src && !img.src.includes('placeholder')) return;

            let url = '';
            // LOGIKA: TV Angka -> Detail TV. Lainnya -> Find External ID.
            if (type === 'tv' && !String(id).startsWith('tt')) {
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            } else {
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    let path = null;
                    if (type === 'tv' && !String(id).startsWith('tt')) {
                        path = data.poster_path;
                    } else {
                        if (type === 'movie' && data.movie_results?.length > 0) path = data.movie_results[0].poster_path;
                        else if (type === 'tv' && data.tv_results?.length > 0) path = data.tv_results[0].poster_path;
                        else if (type === 'person' && data.person_results?.length > 0) path = data.person_results[0].profile_path;
                    }

                    if (path) {
                        // Ganti sumber gambar dengan Poster HD
                        img.src = `https://image.tmdb.org/t/p/w500${path}`;
                        // Efek fade-in agar mulus (Hapus class opacity-0 jika ada)
                        img.classList.remove('opacity-0');
                        img.classList.add('opacity-100');
                    }
                })
                .catch(err => console.error("Gagal load gambar:", err));
        });
        
        // --- LOGIKA BACKGROUND HERO ---
        // Cari elemen background hero
        const heroBg = document.getElementById('heroBackground');
        // Ambil ID film hero dari properti pertama (asumsi index 0 adalah hero)
        // Atau Anda bisa kirim prop khusus 'heroMovie' dari controller
        // Di sini saya pakai logika sederhana: Cari gambar untuk background
        // (Anda bisa sesuaikan jika ada prop heroMovie)
        
    }, [topMovies, topShows, topArtists]); // Jalankan ulang jika data berubah

    const scrollToTrending = (e) => {
        e.preventDefault();
        const element = document.getElementById('trending');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const bgLight = "linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.8) 100%), url('/images/hero-bg(1).png')";
    const bgDark = "linear-gradient(rgba(18, 18, 18, 0.4) 0%, rgba(18, 18, 18, 0.8) 100%), url('/images/hero-bg.png')";

    return (
        <MainLayout>
            <Head title="Homepage" />

            {/* --- HERO SECTION --- */}
            <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-32 overflow-hidden group/hero">
                
                {/* Background Layer */}
                <div 
                    id="heroBackground" 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out scale-110 bg-[image:var(--bg-light)] dark:bg-[image:var(--bg-dark)]"
                    style={{ '--bg-light': bgLight, '--bg-dark': bgDark }}
                ></div>

                {/* Overlay Hitam Tipis & Gradient Bawah */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-linear-to-t from-[#f5f8f8] dark:from-[#121212] to-transparent pointer-events-none z-10"></div>
                            
                {/* Konten Teks */}
                <div className="relative z-20 flex flex-col gap-4 max-w-5xl p-4 text-center">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h1 
                            className="text-white text-6xl md:text-8xl font-black leading-tight tracking-tighter drop-shadow-2xl font-display mb-2"
                            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
                        >
                            Track Films, <br /> 
                            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">Discover Shows</span>
                        </h1>
                        
                        <h2 className="text-gray-200 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg opacity-90">
                            Your ultimate guide to the world of cinema. <br className="hidden md:block" /> Join now to create your personalized watchlist.
                        </h2>
                    </div>

                    {/* Tombol Scroll Down */}
                    <div className="mt-12 animate-bounce text-white/50">
                        <a 
                            href="#trending" 
                            onClick={scrollToTrending}
                            className="cursor-pointer hover:text-cyan-400 transition-colors flex flex-col items-center no-underline">
                            <span className="text-xs font-bold tracking-widest uppercase block mb-2">Scroll Down</span>
                            <i className="fas fa-chevron-down text-2xl"></i>
                        </a>
                    </div>
                </div>
            </section>

            {/* --- SLIDER 1: TRENDING MOVIES --- */}
            <section id="trending" className="py-12 md:py-20 px-4 sm:px-8 md:px-10 lg:px-20 scroll-mt-24 relative z-20">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></span>
                            Trending Movies
                        </h2>
                        <Link href="/films" className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors flex items-center gap-1 group">
                            View All <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                    
                    <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-8 pt-2 snap-x snap-mandatory px-2">
                        <div className="flex items-stretch gap-5 md:gap-6">
                            {topMovies?.map((movie) => (
                                <Link 
                                    key={movie.tconst} 
                                    href={`/title/${movie.tconst}`} 
                                    className="tmdb-loading-card relative flex w-40 md:w-[200px] flex-col gap-0 rounded-2xl overflow-hidden bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-500 group shrink-0 snap-start border border-gray-100 dark:border-white/5 hover:-translate-y-2"
                                    data-tmdb-id={movie.tconst}
                                    data-tmdb-type="movie"
                                >
                                    <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                                        <img 
                                            src="https://via.placeholder.com/300x450?text=..." 
                                            alt={movie.primaryTitle} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 transition-opacity duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-20 -z-10">
                                            <i className="fas fa-film text-4xl"></i>
                                        </div>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 justify-between p-4 bg-white dark:bg-[#1A1A1A] relative z-10">
                                        <div>
                                            <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2">
                                                {movie.primaryTitle}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#888888]">
                                                <span>{movie.startYear ?? '-'}</span>
                                                <div className="flex items-center gap-1 text-yellow-500 font-medium bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                                    <i className="fas fa-star text-[10px]"></i> 
                                                    {movie.averageRating ?? 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SLIDER 2: POPULAR TV SHOWS --- */}
            <section className="py-12 md:py-20 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50 dark:bg-[#121212]/50 relative z-20">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
                            Popular TV Shows
                        </h2>
                        <Link href="/tv-shows" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors flex items-center gap-1 group">
                            View All <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                    
                    <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-8 pt-2 snap-x snap-mandatory px-2">
                        <div className="flex items-stretch gap-5 md:gap-6">
                            {topShows?.map((show) => (
                                <Link 
                                    key={show.show_id || show.tconst}
                                    href={`/tv/${show.tconst || show.show_id}`}
                                    className="tmdb-loading-card relative flex w-40 md:w-[200px] flex-col gap-0 rounded-2xl overflow-hidden bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500 group shrink-0 snap-start border border-gray-100 dark:border-white/5 hover:-translate-y-2"
                                    data-tmdb-id={show.tconst || show.show_id}
                                    data-tmdb-type="tv"
                                >
                                    <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                                        <img 
                                            src="https://via.placeholder.com/300x450?text=..." 
                                            alt={show.primaryTitle} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 transition-opacity duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-20 -z-10"><i className="fas fa-tv text-4xl"></i></div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 justify-between p-4 bg-white dark:bg-[#1A1A1A] relative z-10">
                                        <div>
                                            <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-purple-500 transition-colors mb-2">
                                                {show.primaryTitle}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#888888]">
                                                <span>
                                                    {show.startYear ? show.startYear.toString().substring(0, 4) : '-'}
                                                </span>
                                                <div className="flex items-center gap-1 text-yellow-500 font-medium bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                                    <i className="fas fa-star text-[10px]"></i> 
                                                    {show.averageRating ? Number(show.averageRating).toFixed(1) : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SLIDER 3: TOP ARTISTS --- */}
            <section className="py-12 md:py-20 px-4 sm:px-8 md:px-10 lg:px-20 relative z-20">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></span>
                            Top Artists
                        </h2>
                        <Link href="/artist" className="text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-500 transition-colors flex items-center gap-1 group">
                            View All <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                    
                    <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-8 pt-2 snap-x snap-mandatory px-2">
                        <div className="flex items-stretch gap-6 md:gap-8">
                            {topArtists?.map((artist) => (
                                <Link 
                                    key={artist.nconst}
                                    href={`/person/${artist.nconst}`} 
                                    className="tmdb-loading-card flex w-36 md:w-44 flex-col gap-4 group shrink-0 snap-start items-center text-center no-underline hover:-translate-y-2 transition-transform duration-300"
                                    data-tmdb-id={artist.nconst}
                                    data-tmdb-type="person"
                                >
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-[#222] relative overflow-hidden border-4 border-transparent group-hover:border-pink-500 transition-all duration-300 shadow-md group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                                        <img 
                                            src="https://via.placeholder.com/300x450?text=..." 
                                            alt={artist.primaryName} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0 transition-opacity duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <p className="text-gray-900 dark:text-[#EAEAEA] text-sm md:text-base font-bold leading-tight truncate max-w-[140px] group-hover:text-pink-500 transition-colors">
                                            {artist.primaryName}
                                        </p>
                                        <p className="text-gray-500 dark:text-[#888888] text-xs uppercase tracking-wide truncate max-w-[120px]">
                                            {artist.primaryProfession ? artist.primaryProfession.replace(/_/g, ' ') : 'Artist'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
        </MainLayout>
    );
}