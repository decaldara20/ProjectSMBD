import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

// --- COMPONENT: MODAL FORM ---
const PersonModal = ({ isOpen, onClose, mode, personData, isCompanyMode }) => {
    const isEdit = mode === 'edit';
    
    const { data, setData, post, put, processing, reset, errors } = useForm({
        primaryName: personData?.primaryName || '',
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                primaryName: personData?.primaryName || '',
            });
        }
    }, [personData, isOpen]);

    const submit = (e) => {
        e.preventDefault();
        // Route CRUD People
        if (isEdit) {
            put(`/production/people/${personData.nconst}`, {
                onSuccess: () => { onClose(); reset(); }
            });
        } else {
            post('/production/people', {
                onSuccess: () => { onClose(); reset(); }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 transition-opacity animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col scale-100 transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className={`w-1.5 h-6 rounded-full ${isEdit ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                        {isEdit ? 'Edit Creator' : 'Register Creator'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <form onSubmit={submit} className="p-6 space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            value={data.primaryName}
                            onChange={e => setData('primaryName', e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none transition-colors placeholder-gray-600"
                            placeholder="e.g. Masao Maruyama"
                        />
                        {errors.primaryName && <div className="text-red-500 text-xs mt-1">{errors.primaryName}</div>}
                    </div>

                    {/* Info Section: ID Handling */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-amber-500 shrink-0">
                            <span className="material-symbols-outlined text-lg">fingerprint</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-200">Auto-Generated ID</h4>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                The System ID for this creator will be assigned automatically by the database upon registration. You don't need to input it manually.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-xl">save</span>
                            )}
                            {processing ? 'Saving...' : (isEdit ? 'Save Changes' : 'Register Creator')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function PeopleIndex({ people, filters, isCompanyMode }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedPerson, setSelectedPerson] = useState(null);

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/production/people', { search, company_id: isCompanyMode ? '9538' : '' }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this creator record? This will remove them from the database.')) {
            router.delete(`/production/people/${id}`, { preserveScroll: true });
        }
    };

    return (
        <DashboardLayout>
            <Head title={isCompanyMode ? "Studio Creators" : "Global Talent Registry"} />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isCompanyMode ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${isCompanyMode ? 'text-amber-400' : 'text-cyan-400'}`}>
                                {isCompanyMode ? 'Studio Key Persons' : 'Global Talent Pool'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            {isCompanyMode ? 'Show' : 'Global'} <span className={`text-transparent bg-clip-text bg-linear-to-r ${isCompanyMode ? 'from-amber-400 to-orange-500' : 'from-cyan-400 to-blue-500'}`}>
                                {isCompanyMode ? 'Creators' : 'People'}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
                            {isCompanyMode 
                                ? `Manage the ${people.total.toLocaleString('id-ID')} creators & showrunners registered in Madhouse productions.`
                                : `Search ${people.total.toLocaleString('id-ID')} professionals from the global database registry.`
                            }
                        </p>
                    </div>

                    <div className="flex gap-3 w-full xl:w-auto">
                        {/* Search Bar */}
                        <div className="relative group flex-1 md:w-72">
                            <span className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-white material-symbols-outlined transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder={isCompanyMode ? "Find creator..." : "Search global talent..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-white/30 outline-none transition-all shadow-inner text-sm placeholder-gray-600"
                            />
                        </div>

                        {/* Button Add (Company Only) */}
                        {isCompanyMode && (
                            <button 
                                onClick={() => { setModalMode('create'); setIsModalOpen(true); }}
                                className="bg-amber-600 hover:bg-amber-500 text-black font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl">person_add</span> 
                                <span className="whitespace-nowrap">Add New</span>
                            </button>
                        )}
                        
                        {/* Read Only Badge */}
                        {!isCompanyMode && (
                            <div className="bg-white/5 border border-white/10 text-gray-400 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-default select-none">
                                <span className="material-symbols-outlined text-lg">lock</span>
                                <span className="whitespace-nowrap text-xs uppercase tracking-wider">Read Only</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                {people.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {people.data.map((person) => (
                            <div key={person.nconst} className="group relative bg-[#121212] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1">
                                
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-linear-to-br ${isCompanyMode ? 'from-amber-500/5 to-transparent' : 'from-cyan-500/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none`}></div>

                                {/* Header: Avatar & Name */}
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-black shrink-0 shadow-lg ${isCompanyMode ? 'bg-amber-500' : 'bg-cyan-500'}`}>
                                        {person.primaryName ? person.primaryName.substring(0, 1).toUpperCase() : '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className={`font-bold truncate pr-2 transition-colors text-base ${isCompanyMode ? 'text-white group-hover:text-amber-400' : 'text-white group-hover:text-cyan-400'}`}>
                                            {person.primaryName}
                                        </h3>
                                        {/* ID Badge */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 truncate">
                                                ID: {person.nconst}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Body: Details */}
                                <div className="relative z-10 mt-5 pt-4 border-t border-white/5">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">
                                            {isCompanyMode ? 'Role / Profession' : 'Known For'}
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-1.5 h-14 overflow-hidden content-start">
                                            {person.professions ? (
                                                person.professions.split(', ').slice(0, 3).map((prof, i) => (
                                                    <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-[#1A1A1A] text-gray-300 border border-white/5 tracking-wide">
                                                        {prof}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-gray-700 italic flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                    Not specified
                                                </span>
                                            )}
                                        </div>

                                        {/* Global Mode: Years Info */}
                                        {!isCompanyMode && (person.birthYear || person.deathYear) && (
                                            <div className="text-xs text-gray-500 font-mono mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                                {person.birthYear || '?'} — {person.deathYear || 'Present'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions (Company Mode Only) - Muncul saat Hover */}
                                {isCompanyMode && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
                                        <button 
                                            onClick={() => { setModalMode('edit'); setSelectedPerson(person); setIsModalOpen(true); }}
                                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                                            title="Edit Details"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(person.nconst)}
                                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                                            title="Remove"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-600">person_search</span>
                        </div>
                        <p className="text-gray-300 font-bold text-lg">No records found</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">
                            {isCompanyMode ? "Start building your creator database by adding new entries." : "We couldn't find anyone matching your search criteria."}
                        </p>
                        {isCompanyMode && (
                            <button 
                                onClick={() => { setModalMode('create'); setIsModalOpen(true); }}
                                className="mt-6 text-amber-500 hover:text-amber-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline decoration-amber-500/50 underline-offset-4"
                            >
                                <span className="material-symbols-outlined">add</span> Create New Entry
                            </button>
                        )}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {people.data.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4">
                        <div className="text-xs text-gray-500 font-mono">
                            Page <span className="text-white font-bold">{people.current_page}</span> of <span className="text-white">{people.last_page}</span>
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
                            {people.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} 
                                        href={link.url} 
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            link.active 
                                            ? (isCompanyMode ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/20' : 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20')
                                            : 'bg-[#121212] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : <span key={i} className="px-4 py-2 text-xs text-gray-700 cursor-not-allowed opacity-50" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            <PersonModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
                personData={selectedPerson}
                isCompanyMode={isCompanyMode} 
            />
        </DashboardLayout>
    );
}