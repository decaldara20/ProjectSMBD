import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Component: KPI Small Card
const TalentKPI = ({ label, value, icon, color }) => (
    <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-xl font-bold`}>
            <span className={`material-symbols-outlined ${color.replace('bg-', 'text-')}`}>{icon}</span>
        </div>
        <div>
            <h4 className="text-2xl font-black text-white">{value}</h4>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        </div>
        <div className={`absolute -right-4 -bottom-4 opacity-10 text-8xl ${color.replace('bg-', 'text-')} transform rotate-12 pointer-events-none`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    </div>
);

export default function Talents({ kpi, charts, risingStars, bankable }) {

    // Chart Data: Profession Distribution
    const distData = {
        labels: charts.distribution.map(d => d.primaryProfession.replace(/_/g, ' ')),
        datasets: [{
            data: charts.distribution.map(d => d.total_count),
            backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Talent Analytics" />

            <div className="space-y-8 pb-12">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Talent <span className="text-pink-500">Analytics</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Discover bankable stars and rising talents.</p>
                    </div>
                    <button className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-pink-500/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">print</span> Print Report 3A
                    </button>
                </div>

                {/* 1. KPI SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TalentKPI label="Total Actors" value={kpi.total_actors.toLocaleString()} icon="groups" color="bg-pink-500" />
                    <TalentKPI label="Total Directors" value={kpi.total_directors.toLocaleString()} icon="videocam" color="bg-purple-500" />
                    <TalentKPI label="Avg Star Power" value={kpi.avg_pro_rating} icon="hotel_class" color="bg-yellow-500" />
                </div>

                {/* 2. SPLIT SECTION: Chart vs Rising Stars */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* A. Profession Distribution Chart */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center justify-center">
                        <h3 className="text-lg font-bold text-white w-full mb-4">Profession Breakdown</h3>
                        <div className="w-[220px] h-[220px] relative">
                            <Doughnut data={distData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-white">{charts.distribution.length}</span>
                                <span className="text-[10px] text-gray-500 uppercase">Roles</span>
                            </div>
                        </div>
                        {/* Custom Legend */}
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {charts.distribution.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: distData.datasets[0].backgroundColor[i] }}></span>
                                    <span className="text-[10px] text-gray-400 capitalize">{d.primaryProfession.split(',')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B. Rising Stars (Top 5 List) */}
                    <div className="lg:col-span-2 bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-400">trending_up</span> 
                                    Rising Stars (2020-2025)
                                </h3>
                                <p className="text-xs text-gray-500">New talents with exceptional ratings.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {risingStars.map((star, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="font-mono text-gray-500 text-sm w-4">#{idx + 1}</div>
                                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${star.primaryName}&background=random`} alt={star.primaryName} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{star.primaryName}</h4>
                                            <p className="text-[10px] text-gray-400 capitalize">{star.primaryProfession.split(',')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end text-yellow-400 font-bold text-sm">
                                            <span className="material-symbols-outlined text-sm">star</span> {star.averageRating}
                                        </div>
                                        <p className="text-[10px] text-gray-500">Debut: {star.startYear}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                    </div>
                </div>

                {/* 3. MAIN TABLE: Laporan 3A (Bankable) */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181818]">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                            Top 50 Bankable Professionals
                        </h3>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Search name..." className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-pink-500 outline-none" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">Rank</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Profession</th>
                                    <th className="px-6 py-4 text-right">Total Votes</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bankable.data.map((person, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-center font-mono text-gray-600">
                                            #{index + 1 + (bankable.current_page - 1) * bankable.per_page}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white group-hover:text-pink-400 transition-colors">
                                            {person.primaryName}
                                        </td>
                                        <td className="px-6 py-4 text-xs uppercase tracking-wide">
                                            {person.primaryProfession ? person.primaryProfession.replace(/_/g, ' ') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-cyan-400">
                                            {(person.TotalNumVotes / 1000).toFixed(1)}k
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md font-bold text-xs border border-yellow-500/20">
                                                {parseFloat(person.AverageRating).toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                                Bankable
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Simple Pagination */}
                    <div className="p-4 border-t border-white/5 flex justify-center gap-2">
                        {bankable.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} href={link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${link.active ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : <span key={i} className="px-3 py-1.5 text-xs text-gray-600 opacity-50" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}