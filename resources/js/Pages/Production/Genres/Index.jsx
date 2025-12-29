import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

// --- MODAL FORM ---
const GenreModal = ({ isOpen, onClose, mode, genreData }) => {
    // Mode Add/Edit sama saja karena backend store/update
    const { data, setData, post, processing, reset, errors } = useForm({
        genre_name: genreData?.name || '',
    });

    useEffect(() => {
        if (isOpen) {
            setData('genre_name', genreData?.name || '');
        }
    }, [genreData, isOpen]);

    const submit = (e) => {
        e.preventDefault();
        post('/production/genres', {
            onSuccess: () => { onClose(); reset(); }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 transition-opacity animate-in fade-in">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col transform transition-all scale-100">
                <div className="flex justify-between items-center p-5 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-yellow-500"></span>
                        New Genre Tag
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Genre Name</label>
                        <input 
                            type="text" 
                            value={data.genre_name}
                            onChange={e => setData('genre_name', e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none transition-colors placeholder-gray-600"
                            placeholder="e.g. Cyberpunk"
                        />
                        {errors.genre_name && <div className="text-red-500 text-xs mt-1">{errors.genre_name}</div>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {processing ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : <span className="material-symbols-outlined text-lg">save</span>}
                        {processing ? 'Saving...' : 'Add Genre'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function GenresIndex({ genres, filters, isCompanyMode }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                const params = { search };
                if (isCompanyMode) params.company_id = '9538'; // Kirim ID jika mode company
                router.get('/production/genres', params, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleDelete = (id) => {
        if (confirm('Delete this genre tag? Warning: This will remove the tag from all linked titles.')) {
            router.delete(`/production/genres/${id}`, { preserveScroll: true });
        }
    };

    return (
        <DashboardLayout>
            <Head title={isCompanyMode ? "Studio Genres" : "Master Genre List"} />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isCompanyMode ? 'bg-yellow-500' : 'bg-pink-500'}`}></span>
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${isCompanyMode ? 'text-yellow-400' : 'text-pink-400'}`}>
                                {isCompanyMode ? 'Studio Portfolio Taxonomy' : 'Global Market Taxonomy'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Genre <span className={`text-transparent bg-clip-text bg-linear-to-r ${isCompanyMode ? 'from-yellow-400 to-orange-500' : 'from-pink-400 to-rose-500'}`}>Tags</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-3 max-w-xl">
                            {isCompanyMode 
                                ? `Your studio has actively utilized ${genres.total.toLocaleString('id-ID')} unique genres across all productions.` 
                                : `Browsing the complete master list of ${genres.total.toLocaleString('id-ID')} genres available in the database.`}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-white material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Filter genres..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-white/30 outline-none transition-all shadow-inner text-sm placeholder-gray-600"
                            />
                        </div>
                        
                        {/* Button Add (Muncul di kedua mode karena Genre itu Master Data) */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className={`font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                                isCompanyMode 
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-yellow-900/20' 
                                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/20'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">label</span> 
                            <span className="whitespace-nowrap">Add</span>
                        </button>
                    </div>
                </div>

                {/* --- GENRE GRID --- */}
                {genres.data.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {genres.data.map((genre) => (
                            <div key={genre.id} className="group relative bg-[#121212] border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between min-h-[110px]">
                                
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-linear-to-br ${isCompanyMode ? 'from-yellow-500/10' : 'from-pink-500/10'} to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none`}></div>

                                <div className="relative z-10">
                                    <h3 className={`font-bold text-gray-200 text-lg leading-tight mb-1 truncate transition-colors ${isCompanyMode ? 'group-hover:text-yellow-400' : 'group-hover:text-pink-400'}`}>
                                        {genre.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                                        ID: {genre.id}
                                    </p>
                                </div>

                                <div className="relative z-10 flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-[14px] text-gray-400">movie</span>
                                        <span className="text-xs font-bold text-white">{genre.usage_count.toLocaleString('id-ID')}</span>
                                    </div>

                                    {/* Delete Button (Hover Only) */}
                                    <button 
                                        onClick={() => handleDelete(genre.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                        title="Remove Genre"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-600 opacity-50">label_off</span>
                        </div>
                        <p className="text-gray-300 font-bold text-lg">No genres found</p>
                        <p className="text-sm text-gray-600 mt-1 max-w-xs text-center">
                            {isCompanyMode 
                                ? "No genres are currently linked to your productions." 
                                : "Try creating a new genre tag to start categorizing content."}
                        </p>
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {genres.data.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4">
                        <div className="text-xs text-gray-500 font-mono">
                            Page <span className="text-white font-bold">{genres.current_page}</span> of {genres.last_page}
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
                            {genres.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? (isCompanyMode ? 'bg-yellow-600 text-black' : 'bg-pink-600 text-white') 
                                            : 'bg-[#121212] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : <span key={i} className="px-3.5 py-2 text-xs text-gray-700 cursor-not-allowed opacity-50" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Modal */}
            <GenreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </DashboardLayout>
    );
}