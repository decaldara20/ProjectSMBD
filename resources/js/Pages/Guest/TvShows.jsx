import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

// --- KOMPONEN KARTU TV ---
const TvCard = ({ show }) => {
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const id = show.tconst;
        let url = '';

        // LOGIKA FETCHING PINTAR (Angka vs String)
        // Jika ID murni angka (1399), tembak endpoint TV langsung
        if (!isNaN(id) && !id.toString().startsWith('tt')) {
            url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}`;
        } else {
            // Jika ID string (tt0944947), tembak endpoint Find
            url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_KEY}&external_source=imdb_id`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                let path = null;
                // Handling Respon
                if (!isNaN(id) && !id.toString().startsWith('tt')) {
                    path = data.poster_path; // Direct TV endpoint
                } else {
                    path = data.tv_results?.[0]?.poster_path; // Find endpoint
                }
                
                if (path) setPoster(path);
            })
            .catch(err => console.error(err));
    }, [show.tconst]);

    return (
        <Link 
            href={`/tv/${show.tconst}`}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5 flex flex-col h-full"
        >
            {/* Poster Image */}
            <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                {poster ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${poster}`} 
                        alt={show.primaryTitle} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-50">
                        <i className="fas fa-tv text-4xl"></i>
                    </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <i className="fas fa-star text-yellow-500 text-[10px]"></i>
                    <span className="text-xs font-bold text-white">{show.averageRating ? Number(show.averageRating).toFixed(1) : 'N/A'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm font-bold leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                        {show.primaryTitle}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{show.startYear ? show.startYear.toString().substring(0, 4) : '-'}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-500/80 border border-purple-500/20 px-1.5 rounded">TV Series</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- HALAMAN UTAMA TV SHOWS ---
export default function TvShows({ tvShows }) {
    return (
        <MainLayout>
            <Head title="TV Shows Catalog" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 font-display">
                                <span className="text-purple-600 dark:text-purple-500">Explore</span> TV Shows
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Binge-watch your favorite series from around the world.
                            </p>
                        </div>
                    </div>

                    {/* Grid Content */}
                    {tvShows.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {tvShows.data.map((show) => (
                                <TvCard key={show.tconst} show={show} />
                            ))}
                        </div>
                    ) : (
                        // Tampilan Kosong
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <i className="fas fa-tv text-6xl mb-4 text-gray-600"></i>
                            <p className="text-xl font-bold text-gray-400">No TV shows found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                        {tvShows.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
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