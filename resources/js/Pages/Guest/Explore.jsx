import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

// --- KOMPONEN KARTU (Internal) ---
const ExploreCard = ({ item }) => {
    const [poster, setPoster] = useState(null);
    
    // Cek apakah ini TV (untuk link & API)
    const isTv = item.titleType === 'tvSeries';
    const linkHref = isTv ? `/tv/${item.tconst}` : `/title/${item.tconst}`;

    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        let url = '';

        if (isTv && !isNaN(item.tconst)) {
            // Khusus TV dengan ID Angka
            url = `https://api.themoviedb.org/3/tv/${item.tconst}?api_key=${TMDB_KEY}`;
        } else {
            // Sisanya (Movie, Short, Game, TV ID String) cari via FIND
            url = `https://api.themoviedb.org/3/find/${item.tconst}?api_key=${TMDB_KEY}&external_source=imdb_id`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                let path = null;
                if (isTv && !isNaN(item.tconst)) {
                    path = data.poster_path;
                } else {
                    // Coba cari di movie dulu, lalu tv
                    path = data.movie_results?.[0]?.poster_path || data.tv_results?.[0]?.poster_path;
                }
                if (path) setPoster(path);
            })
            .catch(err => console.error(err));
    }, [item.tconst]);

    return (
        <Link 
            href={linkHref}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5 flex flex-col h-full"
        >
            {/* Poster */}
            <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                {poster ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${poster}`} 
                        alt={item.primaryTitle} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-50">
                        <i className={`fas ${isTv ? 'fa-tv' : 'fa-film'} text-4xl`}></i>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <i className="fas fa-star text-yellow-500 text-[10px]"></i>
                    <span className="text-xs font-bold text-white">{item.averageRating ? Number(item.averageRating).toFixed(1) : 'N/A'}</span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-cyan-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {item.titleType}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm font-bold leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                        {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.startYear ? item.startYear.toString().substring(0, 4) : '-'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

// --- HALAMAN UTAMA EXPLORE ---
export default function Explore({ items, filters = {} }) { 
    
    // Ambil type dari filters, default ke 'multi'
    const currentType = filters.type || 'multi';

    const currentGenre = filters.genre;

    const handleTypeChange = (type) => {
        router.get('/explore', { type }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Explore Content" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    {/* Header & Tabs */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 font-display">
                                {currentGenre ? (
                                    <>
                                        <span className="text-cyan-500">{currentGenre}</span> Content
                                    </>
                                ) : (
                                    <>
                                        Explore <span className="text-cyan-500">Catalog</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Browse our complete database of movies, shows, games, and more.
                            </p>
                        </div>

                        {/* Type Switcher */}
                        <div className="flex bg-gray-200 dark:bg-[#1A1A1A] p-1 rounded-xl border border-gray-300 dark:border-white/10 self-start md:self-auto overflow-x-auto">
                            <button 
                                onClick={() => handleTypeChange('multi')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${currentType === 'multi' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => handleTypeChange('movie')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${currentType === 'movie' ? 'bg-white dark:bg-cyan-600 text-cyan-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Movies
                            </button>
                            <button 
                                onClick={() => handleTypeChange('tvSeries')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${currentType === 'tvSeries' ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                TV Shows
                            </button>
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {items.data && items.data.map((item) => (
                            <ExploreCard key={item.tconst} item={item} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                        {items.links && items.links.map((link, i) => (
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