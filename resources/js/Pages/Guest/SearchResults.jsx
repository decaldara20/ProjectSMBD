import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

// KOMPONEN KARTU HASIL PENCARIAN
const SearchCard = ({ item }) => {
    const [posterUrl, setPosterUrl] = useState(null);
    const [imageStatus, setImageStatus] = useState('loading');

    // Helper Link
    const getLinkHref = () => {
        if (item.type === 'person') return `/person/${item.id}`;
        if (item.type === 'tvSeries') return `/tv/${item.id}`;
        return `/title/${item.id}`;
    };

    // Helper Warna Badge
    const getBadgeStyle = (type) => {
        switch (type) {
            case 'movie': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
            case 'tvSeries': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            case 'person': return 'bg-pink-500/20 text-pink-400 border border-pink-500/30';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    // Helper Label
    const getTypeLabel = (type) => {
        switch (type) {
            case 'movie': return 'FILM';
            case 'tvSeries': return 'TV SHOW';
            case 'person': return 'ARTIST';
            default: return 'UNKNOWN';
        }
    };

    useEffect(() => {
        let isMounted = true;
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

        if (!item.id || !TMDB_KEY) {
            if (isMounted) setImageStatus('error');
            return;
        }

        const url = `https://api.themoviedb.org/3/find/${item.id}?api_key=${TMDB_KEY}&external_source=imdb_id`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => {
                if (!isMounted) return;

                let path = null;
                if (item.type === 'person') path = data.person_results?.[0]?.profile_path;
                else if (item.type === 'movie') path = data.movie_results?.[0]?.poster_path;
                else if (item.type === 'tvSeries') path = data.tv_results?.[0]?.poster_path;

                if (path) {
                    setPosterUrl(`https://image.tmdb.org/t/p/w500${path}`);
                } else {
                    setImageStatus('error');
                }
            })
            .catch(() => {
                if (isMounted) setImageStatus('error');
            });

        return () => { isMounted = false; };
    }, [item.id, item.type]);

    return (
        <Link 
            href={getLinkHref()} 
            className="group relative flex flex-col h-full bg-[#161616] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            {/* BADGE */}
            <div className={`absolute top-2 left-2 z-20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-md ${getBadgeStyle(item.type)}`}>
                {getTypeLabel(item.type)}
            </div>

            {/* CONTAINER GAMBAR */}
            <div className="relative w-full aspect-2/3 bg-gray-900 overflow-hidden">
                
                {/* A. GAMBAR ASLI */}
                {posterUrl && imageStatus !== 'error' && (
                    <img 
                        src={posterUrl} 
                        alt={item.title} 
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageStatus('loaded')}
                        onError={() => setImageStatus('error')}
                    />
                )}

                {/* B. LOADING SKELETON (Muncul saat status 'loading') */}
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-gray-700 text-3xl animate-bounce">image</span>
                    </div>
                )}

                {/* C. FALLBACK / NO IMAGE (Muncul saat status 'error') */}
                {imageStatus === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] p-4 text-center z-0">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
                            <i className={`fas ${item.type === 'person' ? 'fa-user' : 'fa-film'} text-xl text-gray-600`}></i>
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">No Poster</span>
                    </div>
                )}

                {/* OVERLAY HOVER */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* INFO TEXT */}
            <div className="p-4 flex flex-col flex-1 justify-between bg-[#161616] relative z-10">
                <div>
                    <h3 className="text-gray-100 font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">
                        {item.title || item.name}
                    </h3>
                    
                    {item.type === 'person' ? (
                        <p className="text-xs text-gray-500 italic line-clamp-1">
                            {item.known_for || 'Artist'}
                        </p>
                    ) : (
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500 font-mono">{item.startYear || 'N/A'}</span>
                            {item.averageRating && (
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold border border-yellow-500/10">
                                    <i className="fas fa-star"></i> {Number(item.averageRating).toFixed(1)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

// HALAMAN UTAMA SEARCH RESULTS
export default function SearchResults({ results, queryParams, correctedQuery, suggestion }) { // <--- Terima props suggestion
    const isAutoCorrected = !!correctedQuery;
    const hasResults = results && results.length > 0;
    
    return (
        <MainLayout>
            <Head title={`Search: ${queryParams.q || ''}`} />

            <div className="pt-32 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen relative bg-[#0a0a0a]">
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-900/10 blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    
                    {/* HEADER */}
                    <div className="mb-10">
                        {isAutoCorrected ? (
                            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 md:p-8 text-center md:text-left animate-fade-in-up">
                                <p className="text-red-400 text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <i className="fas fa-times-circle"></i>
                                    No results found for <span className="line-through font-mono opacity-70">"{queryParams.q}"</span>
                                </p>
                                <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                                    Showing results for <span className="text-cyan-400 italic underline decoration-cyan-500/30">"{correctedQuery}"</span>
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Search instead for 
                                    <Link href={`/search?q=${queryParams.q}`} className="text-gray-400 hover:text-white underline ml-1 transition-colors">
                                        "{queryParams.q}"
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            // MODE NORMAL
                            <div className="text-center md:text-left animate-fade-in-up">
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                                    Search <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">Results</span>
                                </h1>
                                <p className="text-gray-400 text-lg">
                                    We found <span className="text-white font-bold">{results.length}</span> matches for 
                                    <span className="ml-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-mono text-base">
                                        "{queryParams.q}"
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SUGGESTION BOX (FALLBACK) */}
                    {!hasResults && suggestion && (
                        <div className="mb-12 animate-fade-in-up delay-100">
                            <div className="bg-linear-to-r from-cyan-900/20 to-transparent border-l-4 border-cyan-500 p-6 rounded-r-xl flex items-start gap-4 backdrop-blur-sm">
                                <div className="mt-1 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Suggestion</p>
                                    <p className="text-white text-xl">
                                        Did you mean 
                                        <Link 
                                            href={`/search?q=${suggestion.title}`} 
                                            className="ml-2 font-bold text-cyan-400 hover:text-cyan-300 italic hover:underline transition-all"
                                        >
                                            {suggestion.title}?
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GRID HASIL */}
                    {hasResults ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8 animate-fade-in-up delay-100">
                            {results.map((item, index) => (
                                <SearchCard key={`${item.id}-${index}`} item={item} />
                            ))}
                        </div>
                    ) : (
                        // EMPTY STATE
                        !suggestion && (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-80 animate-fade-in-up">
                                <div className="w-32 h-32 bg-linear-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-8 shadow-inner border border-white/5">
                                    <i className="fas fa-search text-5xl text-gray-700"></i>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3">No results found</h2>
                                <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg">
                                    We couldn't find anything matching "<span className="text-white">{queryParams.q}</span>". 
                                    <br/>Try different keywords or check for typos.
                                </p>
                                <Link 
                                    href="/" 
                                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 hover:scale-105 transition-all shadow-lg shadow-white/10"
                                >
                                    Back to Homepage
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </MainLayout>
    );
}