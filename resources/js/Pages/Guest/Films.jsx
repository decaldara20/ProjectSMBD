import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

// --- KOMPONEN KARTU FILM ---
const FilmCard = ({ film }) => {
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        // Gunakan endpoint FIND karena kita punya ID IMDb (tt...)
        const url = `https://api.themoviedb.org/3/find/${film.tconst}?api_key=${TMDB_KEY}&external_source=imdb_id`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // Ambil poster dari hasil movie
                const path = data.movie_results?.[0]?.poster_path;
                if (path) setPoster(path);
            })
            .catch(err => console.error(err));
    }, [film.tconst]);

    return (
        <Link 
            href={`/title/${film.tconst}`}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5 flex flex-col h-full"
        >
            {/* Poster Image */}
            <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                {poster ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${poster}`} 
                        alt={film.primaryTitle} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-50">
                        <i className="fas fa-film text-4xl"></i>
                    </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <i className="fas fa-star text-yellow-500 text-[10px]"></i>
                    <span className="text-xs font-bold text-white">{film.averageRating ? Number(film.averageRating).toFixed(1) : 'N/A'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm font-bold leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                        {film.primaryTitle}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {film.startYear || '-'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

// --- HALAMAN UTAMA FILMS ---
export default function Films({ films, genres, currentGenre }) {
    
    // Handler saat ganti Genre
    const handleGenreChange = (e) => {
        router.get('/films', { genre: e.target.value }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Films Catalog" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    {/* Header & Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 font-display">
                                Films <span className="text-cyan-600 dark:text-cyan-400">Catalog</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Discover thousands of movies from various genres.
                            </p>
                        </div>

                        {/* Genre Filter */}
                        <div className="relative w-full md:w-64">
                            <select 
                                value={currentGenre || ''} 
                                onChange={handleGenreChange}
                                className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block p-3 pr-10 appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">All Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            {/* Icon Panah Custom */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    {/* Grid Content */}
                    {films.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {films.data.map((film) => (
                                <FilmCard key={film.tconst} film={film} />
                            ))}
                        </div>
                    ) : (
                        // Tampilan Kosong
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <i className="fas fa-film text-6xl mb-4 text-gray-600"></i>
                            <p className="text-xl font-bold text-gray-400">No films found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                        {films.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span 
                                    key={i}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                ></span>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}