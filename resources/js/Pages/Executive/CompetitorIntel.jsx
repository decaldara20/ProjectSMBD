import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bubble, Bar } from 'react-chartjs-2';

// Register Chart Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function CompetitorIntel({ stats }) {
    const { myData, chartData, kpi } = stats;

    // Helper: Cari vote tertinggi untuk normalisasi ukuran bubble
    const maxVotes = Math.max(...chartData.map(c => c.total_votes || 0));

    // --- CHART 1: BUBBLE CHART (3D Market Analysis) ---
    // X: Quantity, Y: Quality, Radius: Popularity (Votes)
    const bubbleConfig = {
        datasets: [
            {
                label: 'Rival Studios',
                data: chartData.filter(c => c.id != myData.id).map(c => ({
                    x: c.total_titles,
                    y: c.avg_rating,
                    r: c.total_votes ? (c.total_votes / maxVotes) * 25 + 4 : 4, // Normalisasi radius (min 4px, max 30px)
                    name: c.name,
                    votes: c.total_votes
                })),
                backgroundColor: 'rgba(56, 189, 248, 0.4)', // Sky Blue Transparan
                borderColor: 'rgba(56, 189, 248, 0.8)',
                hoverBackgroundColor: 'rgba(56, 189, 248, 0.8)',
                borderWidth: 1,
            },
            {
                label: 'Madhouse Inc.',
                data: [{
                    x: myData?.total_titles || 0,
                    y: myData?.avg_rating || 0,
                    r: myData?.total_votes ? (myData.total_votes / maxVotes) * 25 + 4 : 4,
                    name: myData?.name,
                    votes: myData?.total_votes
                }],
                backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red Neon
                borderColor: '#FFF',
                borderWidth: 2,
                hoverBackgroundColor: '#EF4444',
                shadowBlur: 15,
                shadowColor: 'red'
            }
        ]
    };

    const bubbleOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                labels: { color: '#94a3b8', font: { family: 'monospace' } },
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#F8FAFC',
                bodyColor: '#CBD5E1',
                padding: 12,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => {
                        const raw = ctx.raw;
                        return `${raw.name}: ${Number(raw.y).toFixed(1)} ★ | ${raw.x} Titles | ${Number(raw.votes).toLocaleString()} Votes`;
                    }
                }
            }
        },
        scales: {
            x: { 
                title: { display: true, text: 'Production Volume (Quantity)', color: '#64748b' },
                grid: { color: '#1e293b' }, 
                ticks: { color: '#64748b' } 
            },
            y: { 
                title: { display: true, text: 'Market Quality (Avg Rating)', color: '#64748b' },
                grid: { color: '#1e293b' }, 
                ticks: { color: '#64748b' },
                min: 5, // Zoom in ke area rating relevan
                max: 9.5
            }
        }
    };

    // --- CHART 2: BAR CHART (Volume Leaderboard) ---
    const sortedRivals = [...chartData].sort((a, b) => b.total_titles - a.total_titles).slice(0, 10);
    
    const barConfig = {
        labels: sortedRivals.map(c => c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name),
        datasets: [{
            label: 'Titles',
            data: sortedRivals.map(c => c.total_titles),
            backgroundColor: sortedRivals.map(c => c.id == myData.id ? '#EF4444' : 'rgba(56, 189, 248, 0.2)'),
            borderColor: sortedRivals.map(c => c.id == myData.id ? '#EF4444' : 'rgba(56, 189, 248, 0.5)'),
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 15,
        }]
    };

    return (
        <DashboardLayout isSwitcherDisabled={true}>
            <Head title="Competitor Intelligence" />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="relative bg-[#0f172a] border border-white/5 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <span className="material-symbols-outlined text-[150px] text-red-500">radar</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-xs font-mono text-red-400 uppercase tracking-[0.2em]">War Room &bull; Live Data</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                            Competitor <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-500 to-amber-500">Intel</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed border-l-2 border-red-500/30 pl-4">
                            Comparing <strong>Madhouse Inc.</strong> against {kpi.total_competitors.toLocaleString('id-ID')} global entities. 
                            Analysis based on production throughput (Quantity), audience reception (Quality), and market engagement (Votes).
                        </p>
                    </div>
                </div>

                {/* --- KPI STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPI 1 */}
                    <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Volume Rank</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">#{kpi.rank_volume}</span>
                                <span className="text-xs text-slate-500">/ {kpi.total_competitors}</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">leaderboard</span>
                        </div>
                    </div>

                    {/* KPI 2 */}
                    <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Quality Rank</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">#{kpi.rank_quality}</span>
                                <span className="text-xs text-slate-500">/ {kpi.total_competitors}</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">stars</span>
                        </div>
                    </div>

                    {/* KPI 3 (Highlight) */}
                    <div className="bg-linear-to-br from-red-900/40 to-black border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                M
                            </div>
                            <div>
                                <p className="text-xs text-red-200 uppercase font-bold">Your Positioning</p>
                                <div className="flex gap-4 mt-1">
                                    <div>
                                        <span className="block text-xl font-bold text-white">{myData?.total_titles}</span>
                                        <span className="text-[10px] text-red-300/50 uppercase">Titles</span>
                                    </div>
                                    <div className="w-px bg-red-500/30"></div>
                                    <div>
                                        <span className="block text-xl font-bold text-white">{Number(myData?.avg_rating).toFixed(2)}</span>
                                        <span className="text-[10px] text-red-300/50 uppercase">Rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CHARTS AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                    {/* BUBBLE CHART (Main) */}
                    <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl relative">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-400">bubble_chart</span>
                                    Market Impact Analysis
                                </h3>
                                <p className="text-xs text-slate-500">Correlating Quantity, Quality, and Popularity (Bubble Size)</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <Bubble data={bubbleConfig} options={bubbleOptions} />
                        </div>
                    </div>

                    {/* BAR CHART (Side) */}
                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-400">bar_chart</span>
                            Volume Leaders
                        </h3>
                        <div className="flex-1 w-full min-h-0">
                            <Bar 
                                data={barConfig} 
                                options={{
                                    responsive: true, 
                                    maintainAspectRatio: false, 
                                    indexAxis: 'y',
                                    plugins: { legend: { display: false } },
                                    scales: { 
                                        x: { display: false }, 
                                        y: { ticks: { color: '#94a3b8', font: {size: 11} }, grid: {display: false} } 
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* --- DETAILED TABLE --- */}
                <div className="bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <h3 className="font-bold text-white text-lg">Top 15 Strategic Rivals</h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] uppercase text-slate-500 font-bold self-center mr-2">Legend:</span>
                            <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">Madhouse</span>
                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">Competitor</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="bg-[#0a0a0a] text-xs uppercase text-slate-300 font-bold tracking-wider">
                                <tr>
                                    <th className="px-8 py-4">Rank & Studio</th>
                                    <th className="px-6 py-4 text-center">Volume</th>
                                    <th className="px-6 py-4 text-center">Quality (Avg)</th>
                                    <th className="px-8 py-4 text-right">Market Share (Votes)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {chartData.slice(0, 15).map((studio, idx) => {
                                    const isMe = studio.id == myData.id;
                                    return (
                                        <tr key={studio.id} className={`transition-colors ${isMe ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-white/5'}`}>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <span className={`font-mono w-6 text-center ${idx < 3 ? 'text-yellow-500 font-bold' : 'text-slate-600'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className={`font-bold ${isMe ? 'text-red-400' : 'text-white'}`}>{studio.name}</p>
                                                        {isMe && <span className="text-[9px] bg-red-500 text-black font-bold px-1.5 py-0.5 rounded mt-1 inline-block">IDENTIFIED</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-mono text-white">{studio.total_titles.toLocaleString('id-ID')}</span>
                                                <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                                                    <div 
                                                        className={`h-full ${isMe ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                        style={{ width: `${(studio.total_titles / sortedRivals[0].total_titles) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                                                    studio.avg_rating >= 8.0 ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                    studio.avg_rating >= 7.0 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                                }`}>
                                                    <span className="font-bold">{Number(studio.avg_rating).toFixed(2)}</span>
                                                    <span className="material-symbols-outlined text-[10px]">star</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <p className="font-mono text-white">{studio.total_votes ? Number(studio.total_votes).toLocaleString('id-ID') : '0'}</p>
                                                <p className="text-[10px] text-slate-500">votes captured</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}