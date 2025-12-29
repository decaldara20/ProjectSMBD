import React, { useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// --- HELPER: Format Angka ---
const formatNum = (value) => {
    if (value === null || value === undefined) return '0';
    return typeof value === 'number' ? new Intl.NumberFormat('id-ID').format(value) : value;
};

// --- COMPONENT: STAT CARD ---
const StatCard = ({ label, value, icon, color, glow }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 shadow-xl">
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-30 ${glow}`}></div>
        <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/5 ${color} shadow-inner`}>
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div>
                <h4 className="text-3xl font-black text-white tracking-tighter">{formatNum(value)}</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mt-1">{label}</p>
            </div>
        </div>
    </div>
);

// --- COMPONENT: QUICK ACTION BUTTON ---
const QuickActionButton = ({ onClick, icon, title, desc, themeColor }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group text-left">
        <div className={`w-10 h-10 rounded-lg bg-[#181818] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:${themeColor} transition-all shadow-inner border border-white/5`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{title}</h4>
            <p className="text-[10px] text-gray-500">{desc}</p>
        </div>
        <span className="material-symbols-outlined text-gray-600 text-lg ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
            chevron_right
        </span>
    </button>
);

// --- COMPONENT: MODAL ---
const Modal = ({ isOpen, onClose, title, children, themeColor }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 transition-opacity animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                    <h3 className={`text-xl font-black text-white tracking-tight flex items-center gap-2`}>
                        <span className={`w-1.5 h-6 rounded-full ${themeColor.replace('text-', 'bg-')}`}></span>
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- FORM: GENRE (LIVE) ---
const GenreForm = ({ existingGenres }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        genre_name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/production/genres', {
            onSuccess: () => reset(),
            preserveScroll: true
        });
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-xs mb-4 flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                Manage global genre tags in <code>genre_types</code>.
            </div>
            
            <form onSubmit={submit} className="flex gap-2">
                <div className="flex-1">
                    <input 
                        type="text" 
                        value={data.genre_name}
                        onChange={e => setData('genre_name', e.target.value)}
                        placeholder="New Genre Tag..." 
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 outline-none" 
                    />
                    {errors.genre_name && <div className="text-red-500 text-[10px] mt-1">{errors.genre_name}</div>}
                </div>
                <button type="submit" disabled={processing} className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 rounded-lg font-bold disabled:opacity-50">
                    {processing ? '...' : 'Add'}
                </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4 max-h-60 overflow-y-auto custom-scrollbar">
                {existingGenres && existingGenres.map(g => (
                    <span key={g.genre_type_id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center gap-2 group hover:border-red-500/30 transition-colors">
                        {g.genre_name} 
                        <Link 
                            href={`/production/genres/${g.genre_type_id}`} 
                            method="delete" 
                            as="button" 
                            preserveScroll
                            className="hover:text-red-400 text-gray-500 ml-1"
                        >
                            ×
                        </Link>
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- FORM: ANIME / TITLE (DUMMY UI FOR NOW) ---
const AnimeForm = () => (
    <div className="space-y-5">
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Anime Title</label>
            <input type="text" placeholder="e.g. Frieren: Beyond Journey's End" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Original Title (JP)</label>
                <input type="text" placeholder="Sousou no Frieren" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Start Year</label>
                <input type="number" placeholder="2023" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none appearance-none cursor-pointer">
                    <option>TV Series</option>
                    <option>Movie</option>
                    <option>OVA</option>
                    <option>Special</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Is Adult?</label>
                <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none appearance-none cursor-pointer">
                    <option value="0">No (General)</option>
                    <option value="1">Yes (18+)</option>
                </select>
            </div>
        </div>

        <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/20 mt-2 flex justify-center items-center gap-2">
            <span className="material-symbols-outlined">save</span> 
            Save to Registry
        </button>
    </div>
);

// --- FORM: TALENT (DUMMY UI FOR NOW) ---
const TalentForm = () => (
    <div className="space-y-5">
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Name</label>
            <input type="text" placeholder="e.g. Mamoru Hosoda" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Birth Year</label>
                <input type="number" placeholder="1967" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Death Year</label>
                <input type="number" placeholder="-" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none" />
            </div>
        </div>

        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Profession</label>
            <input type="text" placeholder="Director, Writer, Animator" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500 outline-none" />
            <p className="text-[10px] text-gray-600 mt-1">Separate multiple professions with comma</p>
        </div>

        <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/20 mt-2 flex justify-center items-center gap-2">
            <span className="material-symbols-outlined">person_add</span> 
            Register Profile
        </button>
    </div>
);


export default function Dashboard({ stats, charts, recentItems, genres, isCompanyMode }) {
    
    // State Modal
    const [activeModal, setActiveModal] = useState(null);
    const closeModal = () => setActiveModal(null);

    // Safety Check Charts
    const safeCharts = charts || { status: [], secondary: [] };

    // Theme Engine
    const theme = isCompanyMode ? {
        primary: 'text-orange-500',
        bg: 'bg-orange-500',
        chartColors: ['#f97316', '#fbbf24', '#ef4444', '#10b981', '#64748b'],
        actionHover: 'bg-orange-600'
    } : {
        primary: 'text-emerald-500',
        bg: 'bg-emerald-500',
        chartColors: ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'],
        actionHover: 'bg-emerald-600'
    };

    // Chart Configs
    const donutData = {
        labels: safeCharts.status?.map(d => d.status_name) || [],
        datasets: [{
            data: safeCharts.status?.map(d => d.count) || [],
            backgroundColor: theme.chartColors,
            borderColor: '#1A1A1A',
            borderWidth: 4,
            hoverOffset: 10
        }]
    };

    const barData = {
        labels: safeCharts.secondary?.map(d => d.label) || [],
        datasets: [{
            label: 'Total',
            data: safeCharts.secondary?.map(d => d.count) || [],
            backgroundColor: isCompanyMode ? '#fbbf24' : '#10b981',
            borderRadius: 4,
            barThickness: 12,
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#666', font: {size: 9} } },
            y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#888', font: {size: 9} } }
        }
    };

    return (
        <DashboardLayout>
            <Head title="Production Dashboard" />

            <div className="space-y-8 pb-16 font-sans">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`flex h-2.5 w-2.5 relative`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.bg}`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${theme.bg}`}></span>
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${theme.primary} opacity-90`}>
                                {isCompanyMode ? 'Studio Operations' : 'Master Registry'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Production <span className={`text-transparent bg-clip-text bg-linear-to-r ${isCompanyMode ? 'from-orange-400 to-red-500' : 'from-emerald-400 to-cyan-500'}`}>Console</span>
                        </h1>
                    </div>
                    
                    {/* NEW ENTRY BUTTON (COMPANY ONLY) */}
                    {isCompanyMode && (
                        <button 
                            onClick={() => setActiveModal('movie')}
                            className="group relative px-6 py-3 bg-[#f0f0f0] hover:bg-white text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className={`material-symbols-outlined text-lg ${theme.primary}`}>add_circle</span> 
                                NEW ENTRY
                            </span>
                        </button>
                    )}
                </div>

                {/* --- 1. KPI STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((card, index) => (
                        <StatCard 
                            key={index}
                            label={card.label} 
                            value={card.value} 
                            icon={card.icon} 
                            color={card.color} 
                            glow={card.glow}
                        />
                    ))}
                </div>

                {/* --- 2. MAIN CONTENT SPLIT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    
                    {/* LEFT COLUMN: Visuals & Actions (1/3 Width) */}
                    <div className="flex flex-col gap-6 w-full">
                        
                        {/* CHART 1 */}
                        <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/5">
                                {isCompanyMode ? 'Production Status' : 'Content Types'}
                            </h3>
                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="w-[120px] h-[120px] relative shrink-0">
                                    <Doughnut data={donutData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="material-symbols-outlined text-2xl text-gray-600">pie_chart</span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    {safeCharts.status?.slice(0, 4).map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-[10px]">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }}></span>
                                                <span className="text-gray-400 font-medium truncate max-w-[80px]">{d.status_name}</span>
                                            </div>
                                            <span className="font-bold text-white">{formatNum(d.count)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CHART 2 */}
                        <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/5">
                                {isCompanyMode ? 'Top Languages' : 'Top Genres'}
                            </h3>
                            <div className="w-full h-[150px]">
                                <Bar data={barData} options={{...commonOptions, indexAxis: 'y', maintainAspectRatio: false}} />
                            </div>
                        </div>

                        {/* QUICK ACTIONS (HANYA MUNCUL DI COMPANY MODE) */}
                        {isCompanyMode ? (
                            <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 p-6 shadow-xl">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <QuickActionButton onClick={() => setActiveModal('movie')} icon="movie_edit" title="Input New Anime" desc="Add metadata manually" themeColor={theme.actionHover} />
                                    <QuickActionButton onClick={() => setActiveModal('talent')} icon="person_add" title="Register Talent" desc="Cast & crew" themeColor={theme.actionHover} />
                                    <QuickActionButton onClick={() => setActiveModal('genre')} icon="label" title="Genre Tags" desc="Manage categories" themeColor={theme.actionHover} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-cyan-900/10 rounded-3xl border border-cyan-500/20 p-6 shadow-xl">
                                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                    <span className="material-symbols-outlined text-2xl">public</span>
                                    <h3 className="text-sm font-bold uppercase tracking-widest">Global View</h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    You are viewing the global database registry. Editing is restricted to verified studio accounts.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Recent Table (2/3 Width) */}
                    <div className="lg:col-span-2 w-full h-full">
                        {/* H-FULL akan memaksa kontainer ini mengikuti tinggi kolom kiri (Layout Grid Stretch) */}
                        <div className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col h-full max-h-[750px]">
                            
                            <div className="p-6 border-b border-white/5 bg-[#161616] flex justify-between items-center shrink-0">
                                <h3 className="font-bold text-white text-base flex items-center gap-2">
                                    <span className={`w-1.5 h-4 rounded-full ${theme.bg}`}></span>
                                    {isCompanyMode ? 'Recent Productions' : 'Latest Entries'}
                                </h3>
                                <div className="text-[10px] font-mono text-gray-500">
                                    Displaying latest {recentItems.length} records
                                </div>
                            </div>
                            
                            {/* SCROLLABLE AREA */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-[#181818] text-[10px] uppercase font-bold text-gray-500 tracking-wider sticky top-0 z-10 shadow-lg">
                                        <tr>
                                            <th className="px-6 py-4 bg-[#181818]">Title Metadata</th>
                                            <th className="px-6 py-4 text-center bg-[#181818]">Format</th>
                                            <th className="px-6 py-4 text-center bg-[#181818]">{isCompanyMode ? 'Volume' : 'Released'}</th>
                                            <th className="px-6 py-4 text-right bg-[#181818]">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {recentItems.length > 0 ? (
                                            recentItems.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-white/0.02 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-xs font-bold text-gray-600 border border-white/5 group-hover:border-white/20 group-hover:text-white transition-colors">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className={`font-bold text-white text-base group-hover:${theme.primary} transition-colors truncate max-w-[250px] md:max-w-xs`}>
                                                                    {item.title}
                                                                </div>
                                                                <div className="mt-0.5 text-[10px] text-gray-500 truncate max-w-[200px]">
                                                                    {item.extra || 'No extra info'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                                            item.type === 'movie' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                                            'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        }`}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-mono text-gray-300 text-xs">
                                                        {item.date || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-1.5 font-bold font-mono text-yellow-500 bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10">
                                                            <span className="material-symbols-outlined text-[10px] filled">star</span>
                                                            {item.rating ? Number(item.rating).toFixed(1) : 'N/A'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-600 italic">
                                                    No recent entries found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            {isCompanyMode && (
                <>
                    <Modal isOpen={activeModal === 'movie'} onClose={closeModal} title="Input New Anime" themeColor={theme.primary}>
                        <AnimeForm />
                    </Modal>
                    <Modal isOpen={activeModal === 'talent'} onClose={closeModal} title="Register Talent" themeColor={theme.primary}>
                        <TalentForm />
                    </Modal>
                    <Modal isOpen={activeModal === 'genre'} onClose={closeModal} title="Manage Genre Tags" themeColor={theme.primary}>
                        <GenreForm existingGenres={genres} />
                    </Modal>
                </>
            )}

        </DashboardLayout>
    );
}