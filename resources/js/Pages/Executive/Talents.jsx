import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- HELPER: FORMAT ANGKA INDONESIA ---
const formatNum = (num) => new Intl.NumberFormat('id-ID').format(num);

// --- COMPONENT: STAT CARD (Dynamic) ---
// Menerima prop 'data' yang berisi { label, value, icon } dari Controller
const TalentStatCard = ({ data, theme, colorClass }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 shadow-xl">
        {/* Glow Effect */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-30 ${colorClass}`}></div>
        
        <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 ${theme.text} shadow-inner`}>
                <span className="material-symbols-outlined text-3xl">{data.icon}</span>
            </div>
            <div>
                <h4 className="text-4xl font-black text-white tracking-tighter">
                    {typeof data.value === 'number' ? formatNum(data.value) : data.value}
                </h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mt-1">{data.label}</p>
            </div>
        </div>
    </div>
);

// --- COMPONENT: RISING STAR ITEM ---
const RisingStarItem = ({ rank, name, role, rating, year, theme }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group cursor-default">
        {/* Rank Badge */}
        <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg shadow-orange-500/20' : 
            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black shadow-lg' : 
            rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-black shadow-lg' : 'bg-[#222] text-gray-500'
        }`}>
            {rank}
        </div>
        
        {/* Avatar Placeholder */}
        <div className="relative">
            <div className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-b ${theme.gradient}`}>
                <img 
                    src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`} 
                    className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-2 border-[#121212]" 
                    alt={name} 
                />
            </div>
            {rank <= 3 && <div className="absolute -top-2 -right-1 text-xs animate-bounce">👑</div>}
        </div>

        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{name}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{role ? role.split(',')[0] : 'Artist'}</p>
        </div>

        <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-yellow-400 font-bold text-sm">
                <span>{Number(rating).toFixed(1)}</span>
                <span className="material-symbols-outlined text-[12px]">star</span>
            </div>
            <p className="text-[10px] text-gray-600">Est. {year}</p>
        </div>
    </div>
);

export default function Talents({ kpi, charts, risingStars, bankable, isCompanyMode }) {

    // --- 1. THEME ENGINE ---
    const theme = isCompanyMode ? {
        mode: 'Studio',
        primary: '#c084fc',
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        gradient: 'from-purple-600 to-pink-500',
        chartColors: ['#c084fc', '#e879f9', '#f472b6', '#fb7185', '#818cf8'] // Purple Spectrum
    } : {
        mode: 'Global',
        primary: '#22d3ee',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500',
        gradient: 'from-cyan-500 to-blue-600',
        chartColors: ['#22d3ee', '#3b82f6', '#0ea5e9', '#6366f1', '#14b8a6'] // Cyan Spectrum
    };

    // Chart Data Config
    const distData = {
        labels: charts.distribution.map(d => d.primaryProfession.replace(/_/g, ' ')),
        datasets: [{
            data: charts.distribution.map(d => d.total_count),
            backgroundColor: theme.chartColors,
            borderColor: '#1A1A1A',
            borderWidth: 5,
            hoverOffset: 10
        }]
    };

    return (
        <DashboardLayout>
            <Head title={`${theme.mode} Talent Analytics`} />

            <div className="min-h-screen pb-12 space-y-8 font-sans">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.bg}`}></span>
                            <span className={`text-xs font-bold uppercase tracking-[0.3em] ${theme.text} opacity-80`}>
                                Human Resources
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            {theme.mode} <span className="text-neutral-500">Talent Analytics</span>
                        </h1>
                        <p className="text-neutral-500 text-sm mt-3 max-w-xl leading-relaxed">
                            {isCompanyMode 
                                ? "Internal assessment of showrunners and creative leads based on production history."
                                : "Identifying high-value professionals and emerging stars to optimize recruitment."}
                        </p>
                    </div>
                    
                    <button className="group bg-[#1A1A1A] border border-white/10 hover:border-white/20 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3">
                        <span className={`material-symbols-outlined text-lg ${theme.text} group-hover:scale-110 transition-transform`}>download</span> 
                        EXPORT DATA
                    </button>
                </div>

                {/* --- 1. KPI SECTION (Dynamic from Controller) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TalentStatCard 
                        data={kpi.card_1}
                        theme={theme}
                        colorClass={isCompanyMode ? "bg-purple-500" : "bg-cyan-500"}
                    />
                    <TalentStatCard 
                        data={kpi.card_2}
                        theme={theme}
                        colorClass={isCompanyMode ? "bg-pink-500" : "bg-blue-500"}
                    />
                    <TalentStatCard 
                        data={kpi.card_3}
                        theme={theme}
                        colorClass={isCompanyMode ? "bg-rose-500" : "bg-teal-500"}
                    />
                </div>

                {/* --- 2. ANALYTICS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* A. Profession / Genre Distribution (Pie) */}
                    <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white w-full mb-6 flex items-center gap-2">
                            <span className={`w-1 h-6 rounded-full ${theme.bg}`}></span> 
                            {/* Judul dinamis: Genre (Company) vs Role (Global) */}
                            {isCompanyMode ? 'Creative Focus (Genres)' : 'Talent Composition'}
                        </h3>
                        
                        <div className="w-[220px] h-[220px] relative z-10">
                            <Doughnut 
                                data={distData} 
                                options={{ 
                                    cutout: '80%', 
                                    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#000', padding: 12 } } 
                                }} 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">{charts.distribution.length}</span>
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                    {isCompanyMode ? 'Genres' : 'Roles'}
                                </span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="mt-8 grid grid-cols-1 gap-3 w-full px-2">
                            {charts.distribution.map((d, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full transition-all group-hover:scale-125" style={{ backgroundColor: distData.datasets[0].backgroundColor[i] }}></span>
                                        <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors capitalize">
                                            {d.primaryProfession.split(',')[0]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: distData.datasets[0].backgroundColor[i] }}></div>
                                        </div>
                                        <span className="text-[10px] font-mono text-neutral-500">{formatNum(d.total_count)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B. Rising Stars (Leaderboard) */}
                    <div className="lg:col-span-2 bg-[#1A1A1A] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-400">trending_up</span> 
                                    Rising Stars
                                </h3>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {isCompanyMode ? 'Top rated internal showrunners since 2015' : 'Breakout talents (Debut > 2015) with exceptional ratings'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-[380px]">
                            {risingStars.map((star, idx) => (
                                <RisingStarItem 
                                    key={idx}
                                    rank={idx + 1}
                                    name={star.primaryName}
                                    role={star.primaryProfession}
                                    rating={star.averageRating}
                                    year={star.startYear}
                                    theme={theme}
                                />
                            ))}
                            {risingStars.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                                    <span className="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
                                    <p className="text-sm">No rising stars data available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- 3. BANKABLE TABLE --- */}
                <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    {/* Table Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161616]">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className={`p-2 rounded-lg bg-white/5 ${theme.text} material-symbols-outlined text-lg`}>verified</span>
                                Top Bankable Professionals
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1 ml-11">
                                Highly rated veterans with proven track record ({theme.mode} Market)
                            </p>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-600 text-lg group-focus-within:text-white transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search talent..." 
                                className="bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:border-white/30 focus:ring-0 outline-none w-64 transition-all placeholder-neutral-700" 
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#141414] text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                                    <th className="px-6 py-4">Professional</th>
                                    <th className="px-6 py-4">Main Role</th>
                                    <th className="px-6 py-4 text-right">Popularity (Votes)</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {bankable.data.map((person, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-center font-mono text-neutral-600 text-xs">
                                            #{index + 1 + (bankable.current_page - 1) * bankable.per_page}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-bold text-white group-hover:${theme.text} transition-colors text-base`}>
                                                {person.primaryName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded bg-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-wide border border-white/5">
                                                {person.primaryProfession ? person.primaryProfession.replace(/_/g, ' ').split(',')[0] : 'N/A'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${isCompanyMode ? 'text-pink-400' : 'text-cyan-400'}`}>
                                            {formatNum(person.TotalNumVotes)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs">
                                                <span>{parseFloat(person.AverageRating).toFixed(1)}</span>
                                                <span className="material-symbols-outlined text-[10px]">star</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Bankable
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-medium">
                            Showing <span className="text-white">{bankable.from}</span> to <span className="text-white">{bankable.to}</span> of {formatNum(bankable.total)} results
                        </span>
                        <div className="flex gap-2">
                            {bankable.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} href={link.url}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            link.active 
                                            ? `${theme.bg} border-transparent text-white shadow-lg` 
                                            : 'bg-[#1A1A1A] border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : <span key={i} className="px-3 py-1.5 text-xs text-neutral-700 opacity-50 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}