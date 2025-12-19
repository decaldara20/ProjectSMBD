import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// KOMPONEN KPI CARD
const KPICard = ({ title, value, subtext, icon, color }) => (
    <div className="relative overflow-hidden bg-[#121212] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300">
        <div className={`absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color} text-9xl pointer-events-none`}>
            <span className="material-symbols-outlined transform rotate-12" style={{ fontSize: '120px' }}>{icon}</span>
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 border border-white/5`}>
                    <span className={`material-symbols-outlined text-2xl ${color.replace('bg-', 'text-')}`}>{icon}</span>
                </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            {subtext && (
                <div className="mt-3 flex items-center gap-1 text-xs font-bold">
                    <span className={subtext.includes('+') ? 'text-green-400' : 'text-red-400'}>
                        {subtext}
                    </span>
                    <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    </div>
);

// KOMPONEN INSIGHT ROW
const InsightRow = ({ term, count }) => (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">priority_high</span>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-200 group-hover:text-white">{term}</p>
                <p className="text-[10px] text-gray-500">Not found in DB</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-white">{count}</p>
            <p className="text-[10px] text-red-400">High Demand</p>
        </div>
    </div>
);

export default function Dashboard({ kpi, charts, bi, filters }) {

    // 1. VALIDASI DATA (Mencegah Crash jika data kosong)
    if (!kpi) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-2">sync</span>
                    <p>Loading Dashboard Data...</p>
                </div>
            </DashboardLayout>
        );
    }

    // 2. HANDLE FILTER
    const handleFilter = (range) => {
        router.get('/executive/dashboard', { range }, { preserveState: true, preserveScroll: true });
    };

    // 3. CHART DATA
    const growthData = {
        labels: charts?.growth?.map(d => d.startYear) || [],
        datasets: [{
            label: 'Releases',
            data: charts?.growth?.map(d => d.total_titles) || [],
            borderColor: '#06b6d4',
            borderWidth: 3,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 350);
                gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }]
    };

    const genreData = {
        labels: charts?.genres?.map(g => g.genre_name) || [],
        datasets: [{
            label: 'Total Votes',
            data: charts?.genres?.map(g => g.total_votes) || [],
            backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f43f5e'],
            borderRadius: 6,
            barThickness: 40,
            hoverBackgroundColor: '#fff'
        }]
    };

    const platformData = {
        labels: charts?.platforms?.map(p => p.network_name) || [],
        datasets: [{
            data: charts?.platforms?.map(p => p.total_shows) || [],
            backgroundColor: ['#E50914', '#00A8E1', '#113CCF', '#1CE783', '#FFF'],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        layout: { padding: 10 }
    };

    return (
        <DashboardLayout>
            <Head title="Executive Suite" />

            <div className="space-y-8 pb-12">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-1">
                            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Suite</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Welcome back, analyze your platform's performance metrics.</p>
                    </div>
                    
                    {/* Filter */}
                    <div className="bg-[#121212] p-1 rounded-xl border border-white/10 flex items-center">
                        {['30d', '1y', 'all'].map((range) => (
                            <button
                                key={range}
                                onClick={() => handleFilter(range)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    filters?.range === range 
                                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {range === '30d' ? '30 Days' : range === '1y' ? 'This Year' : 'Max'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard title="Total Titles" value={kpi.total_titles || 0} subtext="+12% Growth" icon="movie" color="text-cyan-400" />
                    <KPICard title="Global IMDb Rating" value={kpi.avg_rating || 0} subtext="Quality Index" icon="star" color="text-yellow-400" />
                    <KPICard title="Industry Pros" value={kpi.total_pros || 0} subtext="Talent Pool" icon="person_search" color="text-pink-400" />
                    <KPICard title="TV Series Catalog" value={kpi.total_tv || 0} subtext="Episodes Tracked" icon="live_tv" color="text-purple-400" />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Growth Chart */}
                    <div className="lg:col-span-2 bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white">Content Release Velocity</h3>
                                <p className="text-xs text-gray-500">Yearly content acquisition trend</p>
                            </div>
                            <Link href="/executive/trends" className="text-cyan-400 hover:text-white text-xs font-bold uppercase flex items-center gap-1 transition-colors">
                                Full Report <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="h-[280px] relative z-10">
                            <Line data={growthData} options={{...commonOptions, scales: { y: { display: true, grid: { color: '#222' } } }}} />
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    </div>

                    {/* Platform Share */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center justify-center relative">
                        <h3 className="text-lg font-bold text-white mb-6 w-full text-left">Network Market Share</h3>
                        <div className="w-[200px] h-[200px] relative mb-4">
                            <Doughnut data={platformData} options={{ cutout: '80%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">{charts?.platforms?.length || 0}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Networks</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {charts?.platforms?.slice(0, 3).map((p, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platformData.datasets[0].backgroundColor[i] }}></span>
                                    <span className="text-[10px] font-bold text-gray-300">{p.network_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Genre Chart */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white">Top Genres (By Votes)</h3>
                            <p className="text-xs text-gray-500">Audience engagement analysis</p>
                        </div>
                        <div className="h-[250px]">
                            <Bar 
                                data={genreData} 
                                options={{
                                    ...commonOptions,
                                    scales: { 
                                        x: { display: true, grid: { display: false }, ticks: { color: '#666', font: { size: 10 } } },
                                        y: { display: false } 
                                    }
                                }} 
                            />
                        </div>
                    </div>

                    {/* BI Widget */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                                    Content Gaps
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Items searched but <span className="text-red-400 font-bold">not found</span>.</p>
                            </div>
                            <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col space-y-1 mb-4">
                            {bi?.failed_searches && bi.failed_searches.length > 0 ? (
                                bi.failed_searches.map((item, idx) => (
                                    <InsightRow key={idx} term={item.term} count={item.count} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">check_circle</span>
                                    <p className="text-xs">No missing content reported.</p>
                                </div>
                            )}
                        </div>

                        <button className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-red-600/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-600/20 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_task</span> Assign Acquisition Team
                        </button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}