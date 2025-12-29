import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

// --- COMPONENT: MODAL FORM (Create/Edit) ---
const TvShowModal = ({ isOpen, onClose, mode, showData, companyId }) => {
    const isEdit = mode === 'edit';
    
    // Inisialisasi Form Inertia
    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: showData?.primaryTitle || '',
        overview: showData?.overview || '',
        seasons: showData?.number_of_seasons || 1,
        episodes: showData?.number_of_episodes || 12,
        company_id: companyId
    });

    // Reset form saat modal dibuka/data berubah
    useEffect(() => {
        if (isOpen) {
            setData({
                name: showData?.primaryTitle || '',
                overview: showData?.overview || '',
                seasons: showData?.number_of_seasons || 1,
                episodes: showData?.number_of_episodes || 12,
                company_id: companyId
            });
        }
    }, [showData, isOpen]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/production/tv-shows/${showData.tconst}`, {
                onSuccess: () => { onClose(); reset(); }
            });
        } else {
            post('/production/tv-shows', {
                onSuccess: () => { onClose(); reset(); }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 transition-opacity animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] scale-100 transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className={`w-1.5 h-6 rounded-full ${isEdit ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                        {isEdit ? 'Edit Production' : 'New TV Show'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <form onSubmit={submit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Input Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Series Title</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                            placeholder="e.g. Hunter x Hunter"
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    {/* Input Overview */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Synopsis</label>
                        <textarea 
                            rows="3"
                            value={data.overview}
                            onChange={e => setData('overview', e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none resize-none transition-colors"
                            placeholder="Brief storyline..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Input Seasons */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Seasons</label>
                            <input 
                                type="number" 
                                value={data.seasons}
                                onChange={e => setData('seasons', e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                            />
                        </div>
                        {/* Input Episodes */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Episodes</label>
                            <input 
                                type="number" 
                                value={data.episodes}
                                onChange={e => setData('episodes', e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {processing ? (
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-xl">save</span>
                            )}
                            {processing ? 'Saving...' : (isEdit ? 'Update Changes' : 'Create Show')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function TvShowIndex({ shows, filters, isCompanyMode, companyId }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [selectedShow, setSelectedShow] = useState(null);

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/tv-shows', 
                    { search, company_id: companyId }, 
                    { preserveState: true, replace: true }
                );
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // Actions
    const openCreateModal = () => {
        setModalMode('create');
        setSelectedShow(null);
        setIsModalOpen(true);
    };

    const openEditModal = (show) => {
        setModalMode('edit');
        setSelectedShow(show);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this show from the database? This action cannot be undone.')) {
            router.delete(`/production/tv-shows/${id}`, { preserveScroll: true });
        }
    };

    // Helper: Rating Color
    const getRatingColor = (rating) => {
        if (!rating) return 'text-gray-600';
        if (rating >= 8.0) return 'text-purple-400';
        if (rating >= 6.0) return 'text-blue-400';
        return 'text-rose-400';
    };

    return (
        <DashboardLayout>
            <Head title="TV Shows Registry" />

            <div className="space-y-6 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isCompanyMode ? 'bg-purple-500' : 'bg-cyan-500'}`}></span>
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${isCompanyMode ? 'text-purple-400' : 'text-cyan-400'}`}>
                                {isCompanyMode ? 'Madhouse Studio Database' : 'Global Market Data'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            TV Shows <span className={`text-transparent bg-clip-text bg-linear-to-r ${isCompanyMode ? 'from-purple-400 to-pink-500' : 'from-cyan-400 to-blue-500'}`}>Registry</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                            {isCompanyMode 
                                ? "Manage your studio's active productions, update episode counts, and track ratings."
                                : "Browse global television database for market analysis and benchmarking."}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full xl:w-auto">
                        {/* Search Bar */}
                        <div className="relative group flex-1 sm:w-80">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-white material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search shows..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-white/30 outline-none transition-all shadow-inner text-sm placeholder-gray-600"
                            />
                        </div>

                        {/* BUTTON CREATE (HANYA DI COMPANY MODE) */}
                        {isCompanyMode && (
                            <button 
                                onClick={openCreateModal}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl">add_box</span> 
                                <span className="whitespace-nowrap">New Show</span>
                            </button>
                        )}
                        
                        {/* READ ONLY BADGE (GLOBAL MODE) */}
                        {!isCompanyMode && (
                            <div className="bg-white/5 border border-white/10 text-gray-400 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-default select-none">
                                <span className="material-symbols-outlined text-lg">public</span>
                                <span className="whitespace-nowrap text-xs uppercase tracking-wider">Read Only</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative flex flex-col min-h-[500px]">
                    <div className={`absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent ${isCompanyMode ? 'via-purple-500/50' : 'via-cyan-500/50'} to-transparent`}></div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b border-white/5 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Title Info</th>
                                    <th className="px-6 py-4">Start Year</th>
                                    <th className="px-6 py-4 text-center">Seasons</th>
                                    <th className="px-6 py-4 text-center">Episodes</th>
                                    <th className="px-6 py-4 text-center">Rating</th>
                                    {isCompanyMode && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shows.data.length > 0 ? (
                                    shows.data.map((show) => (
                                        <tr key={show.tconst} className="hover:bg-white/0.02 transition-colors group">
                                            
                                            {/* Column 1: Title */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#222] border border-white/5 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                                        {show.primaryTitle.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-white text-base truncate max-w-[250px] ${isCompanyMode ? 'group-hover:text-purple-400' : 'group-hover:text-cyan-400'} transition-colors`}>
                                                            {show.primaryTitle}
                                                        </div>
                                                        <div className="text-[10px] text-gray-600 font-mono mt-0.5 bg-white/5 px-1.5 rounded inline-block">
                                                            {show.tconst}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Year */}
                                            <td className="px-6 py-4 font-mono text-gray-400">
                                                {show.startYear || '-'}
                                            </td>

                                            {/* Column 3: Seasons */}
                                            <td className="px-6 py-4 text-center">
                                                {show.number_of_seasons ? <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{show.number_of_seasons}</span> : '-'}
                                            </td>

                                            {/* Column 4: Episodes */}
                                            <td className="px-6 py-4 text-center">
                                                {show.number_of_episodes ? <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{show.number_of_episodes}</span> : '-'}
                                            </td>

                                            {/* Column 5: Rating */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`flex items-center gap-1 font-bold font-mono ${getRatingColor(show.averageRating)}`}>
                                                        {show.averageRating ? Number(show.averageRating).toFixed(1) : '-'}
                                                        <span className="material-symbols-outlined text-sm filled">star</span>
                                                    </div>
                                                    {show.numVotes > 0 && (
                                                        <span className="text-[9px] text-gray-600 uppercase tracking-wide mt-0.5">
                                                            {Number(show.numVotes).toLocaleString('id-ID')} Votes
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            {/* Column 6: Actions (Company Mode Only) */}
                                            {isCompanyMode && (
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => openEditModal(show)}
                                                            className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all" 
                                                            title="Edit Metadata"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(show.tconst)}
                                                            className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" 
                                                            title="Delete from Database"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isCompanyMode ? 6 : 5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <span className="material-symbols-outlined text-4xl opacity-30 mb-2">live_tv</span>
                                                <p className="text-gray-400 font-bold">No series found</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {isCompanyMode ? "Start adding your productions!" : "Try adjusting your search query."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 bg-[#161616] flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 z-10">
                        <div className="text-xs text-gray-500 font-mono">
                            Showing <span className="text-white">{shows.from || 0}</span> - <span className="text-white">{shows.to || 0}</span> of <span className="text-white">{shows.total.toLocaleString('id-ID')}</span> series
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide">
                            {shows.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`} 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                    />
                                ) : <span key={i} className="px-3 py-1.5 text-xs text-gray-700 cursor-not-allowed opacity-30 whitespace-nowrap" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Modal */}
            <TvShowModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
                showData={selectedShow}
                companyId={companyId}
            />

        </DashboardLayout>
    );
}