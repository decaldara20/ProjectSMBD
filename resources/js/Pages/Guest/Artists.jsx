import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

// --- KOMPONEN KARTU ARTIS ---
const ArtistCard = ({ artist }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        // Gunakan endpoint FIND karena nconst adalah ID IMDb
        const url = `https://api.themoviedb.org/3/find/${artist.nconst}?api_key=${TMDB_KEY}&external_source=imdb_id`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const path = data.person_results?.[0]?.profile_path;
                if (path) setImage(path);
            })
            .catch(err => console.error(err));
    }, [artist.nconst]);

    return (
        <Link 
            href={`/person/${artist.nconst}`}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 dark:hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5 flex flex-col h-full"
        >
            {/* Foto Profil */}
            <div className="w-full aspect-2/3 bg-gray-200 dark:bg-[#2a2a2a] relative overflow-hidden">
                {image ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${image}`} 
                        alt={artist.primaryName} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-50">
                        <i className="fas fa-user text-4xl"></i>
                    </div>
                )}
                
                {/* Overlay Pink saat Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-pink-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Info Teks */}
            <div className="p-4 text-center">
                <h3 className="text-gray-900 dark:text-[#EAEAEA] text-sm font-bold leading-tight truncate group-hover:text-pink-500 transition-colors mb-1">
                    {artist.primaryName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate uppercase tracking-wider">
                    {artist.primaryProfession ? artist.primaryProfession.replace(/_/g, ' ') : 'Artist'}
                </p>
            </div>
        </Link>
    );
};

// --- HALAMAN UTAMA ARTISTS ---
export default function Artists({ artists, filters }) {
    const currentProfession = filters.profession || '';
    const [searchQuery, setSearchQuery] = useState(filters.q || '');

    // Handle Ganti Tab Profesi
    const handleTabChange = (profession) => {
        router.get('/artists', { profession, q: searchQuery }, { preserveScroll: true });
    };

    // Handle Search Enter
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/artists', { profession: currentProfession, q: searchQuery }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Artists & People" />

            <div className="pt-24 pb-20 px-4 sm:px-8 md:px-10 lg:px-20 min-h-screen">
                <div className="w-full max-w-[1400px] mx-auto">
                    
                    {/* Header & Controls */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 font-display">
                                Famous <span className="text-pink-500">People</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Discover the actors, directors, and creators behind your favorite shows.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {/* Filter Tabs */}
                            <div className="flex bg-gray-200 dark:bg-[#1A1A1A] p-1 rounded-xl border border-gray-300 dark:border-white/10 overflow-x-auto w-full md:w-auto">
                                {[
                                    { label: 'All', value: '' },
                                    { label: 'Actors', value: 'actor' },
                                    { label: 'Directors', value: 'director' },
                                    { label: 'Writers', value: 'writer' },
                                    { label: 'Producers', value: 'producer' },
                                ].map((tab) => (
                                    <button 
                                        key={tab.value}
                                        onClick={() => handleTabChange(tab.value)}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${currentProfession === tab.value ? 'bg-white dark:bg-pink-600 text-pink-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar Kecil */}
                            <form onSubmit={handleSearch} className="relative w-full md:w-64">
                                <input 
                                    type="text" 
                                    placeholder="Search name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:ring-pink-500 focus:border-pink-500 transition-all"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <i className="fas fa-search"></i>
                                </span>
                            </form>
                        </div>
                    </div>

                    {/* Grid Content */}
                    {artists.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {artists.data.map((artist) => (
                                <ArtistCard key={artist.nconst} artist={artist} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <i className="fas fa-user-slash text-6xl mb-4 text-gray-600"></i>
                            <p className="text-xl font-bold text-gray-400">No people found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12 flex flex-wrap justify-center gap-2">
                        {artists.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
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