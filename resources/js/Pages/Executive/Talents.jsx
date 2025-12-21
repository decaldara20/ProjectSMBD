import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- COMPONENT: MODERN KPI CARD ---
const TalentStatCard = ({ label, value, icon, color }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 shadow-xl">
        {/* Ambient Glow */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-40 ${color.replace('text-', 'bg-')}`}></div>
        
        <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/5 ${color} shadow-inner`}>
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div>
                <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mt-1">{label}</p>
            </div>
        </div>
    </div>
);

// --- COMPONENT: RISING STAR ITEM (LEADERBOARD STYLE) ---
const RisingStarItem = ({ rank, name, role, rating, year }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group cursor-default">
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg shadow-orange-500/20' : 
            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black shadow-lg' : 
            rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-black shadow-lg' : 'bg-[#222] text-gray-500'
        }`}>
            {rank}
        </div>
        
        {/* Avatar */}
        <div className="relative">
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-b from-white/20 to-transparent">
                <img src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`} className="w-full h-full rounded-full object-cover" alt={name} />
            </div>
            {rank <= 3 && <div className="absolute -top-1 -right-1 text-xs animate-bounce">👑</div>}
        </div>

        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-pink-400 transition-colors">{name}</h4>
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

export default function Talents({ kpi, charts, risingStars, bankable }) {

    // Chart Data Config
    const distData = {
        labels: charts.distribution.map(d => d.primaryProfession.replace(/_/g, ' ')),
        datasets: [{
            data: charts.distribution.map(d => d.total_count),
            backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
            borderColor: '#121212',
            borderWidth: 4,
            hoverOffset: 20
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Talent Analytics" />

            <div className="space-y-10 pb-16">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Human Resources</h2>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Talent <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Analytics</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-xl">
                            Identifying high-value professionals and emerging stars to optimize casting and production recruitment.
                        </p>
                    </div>
                    <button className="group bg-[#1A1A1A] hover:bg-pink-600 border border-white/10 hover:border-pink-500 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-xl hover:shadow-pink-500/20 flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg group-hover:animate-pulse">print</span> 
                        EXPORT REPORT
                    </button>
                </div>

                {/* --- 1. KPI SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TalentStatCard label="Total Actors" value={kpi.total_actors.toLocaleString()} icon="theater_comedy" color="text-pink-500" />
                    <TalentStatCard label="Directing Talent" value={kpi.total_directors.toLocaleString()} icon="videocam" color="text-purple-500" />
                    <TalentStatCard label="Avg Star Power" value={kpi.avg_pro_rating} icon="hotel_class" color="text-yellow-500" />
                </div>

                {/* --- 2. ANALYTICS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* A. Profession Distribution (Pie) */}
                    <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white w-full mb-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-500 rounded-full"></span> 
                            Talent Composition
                        </h3>
                        
                        <div className="w-[240px] h-[240px] relative z-10">
                            <Doughnut data={distData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">{charts.distribution.length}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Roles</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4">
                            {charts.distribution.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: distData.datasets[0].backgroundColor[i], color: distData.datasets[0].backgroundColor[i] }}></span>
                                        <span className="text-[10px] font-bold text-gray-400 capitalize">{d.primaryProfession.split(',')[0]}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-600">{d.total_count}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Background Effect */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                    </div>

                    {/* B. Rising Stars (Leaderboard) */}
                    <div className="lg:col-span-2 bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-400">trending_up</span> 
                                    Rising Stars
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Breakout talents (Debut &gt; 2015) with exceptional ratings</p>
                            </div>
                            <button className="text-[10px] font-bold text-pink-500 uppercase hover:text-pink-400 transition-colors">View All Candidates</button>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-2">
                            {risingStars.map((star, idx) => (
                                <RisingStarItem 
                                    key={idx}
                                    rank={idx + 1}
                                    name={star.primaryName}
                                    role={star.primaryProfession}
                                    rating={star.averageRating}
                                    year={star.startYear}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 3. BANKABLE TABLE --- */}
                <div className="bg-[#121212] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    {/* Table Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161616]">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-pink-500/10 text-pink-500 material-symbols-outlined text-lg">verified</span>
                                Top Bankable Professionals
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 ml-11">Highly rated veterans with proven track record</p>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-lg group-focus-within:text-pink-500 transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                className="bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none w-64 transition-all" 
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1a1a1a] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
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
                                    <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-center font-mono text-gray-600 text-xs">
                                            #{index + 1 + (bankable.current_page - 1) * bankable.per_page}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white group-hover:text-pink-400 transition-colors text-base">
                                                {person.primaryName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wide border border-white/5">
                                                {person.primaryProfession ? person.primaryProfession.replace(/_/g, ' ').split(',')[0] : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-cyan-400 font-bold">
                                            {(person.TotalNumVotes / 1000).toFixed(1)}k
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs">
                                                <span>{parseFloat(person.AverageRating).toFixed(1)}</span>
                                                <span className="material-symbols-outlined text-[10px]">star</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
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
                        <span className="text-xs text-gray-500 font-medium">
                            Showing <span className="text-white">{bankable.from}</span> to <span className="text-white">{bankable.to}</span> of {bankable.total} results
                        </span>
                        <div className="flex gap-2">
                            {bankable.links.map((link, i) => (
                                link.url ? (
                                    <Link 
                                        key={i} href={link.url}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            link.active 
                                            ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-600/20' 
                                            : 'bg-[#1A1A1A] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : <span key={i} className="px-3 py-1.5 text-xs text-gray-700 opacity-50 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}