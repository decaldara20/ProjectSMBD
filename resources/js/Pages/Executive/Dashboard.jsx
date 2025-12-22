import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement, 
    ArcElement, 
    Title, 
    Tooltip, 
    Legend, 
    Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- KOMPONEN: MODERN KPI CARD ---
const StatCard = ({ title, value, subtext, icon, color }) => {
    // Mapping warna untuk background glow agar tidak error di Tailwind JIT
    const glowColors = {
        'text-cyan-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] hover:border-cyan-500/30',
        'text-yellow-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(250,204,21,0.3)] hover:border-yellow-500/30',
        'text-pink-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(244,114,182,0.3)] hover:border-pink-500/30',
        'text-purple-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(192,132,252,0.3)] hover:border-purple-500/30',
    };

    const activeGlow = glowColors[color] || 'hover:border-white/20';

    return (
        <div className={`relative group p-6 rounded-3xl bg-[#151515] border border-white/5 transition-all duration-500 ease-out hover:-translate-y-2 ${activeGlow}`}>
            
            {/* Background Gradient Splash (Hidden by default, visible on hover) */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 bg-linear-to-br ${color.replace('text-', 'from-')} to-transparent`}></div>

            {/* Floating Big Icon (Watermark) */}
            <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-125`}>
                <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>{icon}</span>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Header: Icon & Badge */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3.5 rounded-2xl bg-[#0F0F0F] border border-white/5 shadow-inner group-hover:bg-white/5 transition-colors">
                        <span className={`material-symbols-outlined text-2xl ${color}`}>{icon}</span>
                    </div>
                    
                    {subtext && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${
                            subtext.includes('+') 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-white/5 text-gray-400 border-white/10'
                        }`}>
                            {subtext.includes('+') && <span className="material-symbols-outlined text-[10px]">trending_up</span>}
                            {subtext}
                        </div>
                    )}
                </div>

                {/* Body: Value & Title */}
                <div>
                    <h3 className="text-4xl font-black text-white tracking-tight mb-1 group-hover:translate-x-1 transition-transform duration-300">
                        {value}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-0.5 group-hover:text-gray-300 transition-colors">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN: TALENT LIST ITEM (With Visual Bar) ---
const TalentListItem = ({ rank, name, role, rating }) => {
    // Hitung persentase rating (asumsi max 10)
    const percentage = (rating / 10) * 100;
    
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default border border-transparent hover:border-white/5">
            {/* Rank Badge */}
            <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs ${
                rank === 1 ? 'bg-linear-to-br from-yellow-400 to-orange-600 text-black shadow-lg shadow-orange-500/20' 
                : rank === 2 ? 'bg-gray-300 text-black'
                : rank === 3 ? 'bg-orange-300 text-black'
                : 'bg-white/5 text-gray-500'
            }`}>
                #{rank}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                        {name}
                    </h4>
                    <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">star</span>
                        {Number(rating).toFixed(1)}
                    </span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1.5">
                    <span className="uppercase tracking-wider">{role ? role.split(',')[0] : 'Artist'}</span>
                </div>

                {/* Rating Bar Visual */}
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-linear-to-r from-yellow-600 to-yellow-400 rounded-full" 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN: FAILED SEARCH ITEM ---
const SearchGapItem = ({ term, count, trend }) => (
    <div className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-red-500/5 transition-colors rounded-lg group">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div>
                <p className="text-sm font-bold text-gray-300 group-hover:text-white">{term}</p>
                <p className="text-[10px] text-gray-600">Missing from catalog</p>
            </div>
        </div>
        <div className="text-right">
            <span className="block text-sm font-bold text-white">{count}</span>
            <span className={`text-[9px] uppercase tracking-wider font-bold ${
                trend === 'Critical Demand' ? 'text-red-500' : 'text-red-300'
            }`}>
                {trend}
            </span>
        </div>
    </div>
);

export default function Dashboard({ kpi, charts, bi, filters, topTalent }) {

    if (!kpi) return null;

    const handleFilter = (range) => {
        router.get('/executive/dashboard', { range }, { preserveState: true, preserveScroll: true });
    };

    // --- CHART CONFIGURATION ---
    const growthChartData = {
        labels: charts?.growth?.map(d => d.startYear) || [],
        datasets: [{
            label: 'Titles Released',
            data: charts?.growth?.map(d => d.total_released) || [],
            borderColor: '#22d3ee', // Cyan-400
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
                gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                return gradient;
            },
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: '#000',
            pointBorderColor: '#22d3ee',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
        }]
    };

    const platformChartData = {
        labels: charts?.platforms?.map(p => p.network_name) || [],
        datasets: [{
            data: charts?.platforms?.map(p => p.total_shows) || [],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#64748b'],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Executive Overview" />

            <div className="min-h-screen pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-10">
                    <div>
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Real-time Analytics</h2>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Executive <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">Suite</span>
                        </h1>
                    </div>

                    {/* Filter Pills */}
                    <div className="bg-[#1A1A1A] p-1.5 rounded-xl border border-white/10 flex shadow-lg">
                        {['30d', '1y', 'all'].map((range) => (
                            <button
                                key={range}
                                onClick={() => handleFilter(range)}
                                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                    filters?.range === range 
                                    ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {range === '30d' ? '30 Days' : range === '1y' ? 'This Year' : 'All Time'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- KPI GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Library" 
                        value={kpi.total_titles} 
                        subtext={kpi.growth_txt} // Contoh output: "+5.2% YoY"
                        icon="movie_filter" 
                        color="text-cyan-400" 
                    />
                    <StatCard 
                        title="Avg Quality (IMDb)" 
                        value={kpi.avg_rating} 
                        subtext="Global Avg" // Text biasa (tanpa +) jadi abu-abu
                        icon="hotel_class" 
                        color="text-yellow-400" 
                    />
                    <StatCard 
                        title="Talent Pool" 
                        value={kpi.total_pros} 
                        subtext="+12 New" // Contoh ada tanda +, jadi hijau
                        icon="groups" 
                        color="text-pink-400" 
                    />
                    <StatCard 
                        title="TV Series" 
                        value={kpi.total_tv} 
                        subtext="On Air" 
                        icon="live_tv" 
                        color="text-purple-400" 
                    />
                </div>

                {/* --- MAIN CHARTS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    {/* Left: Growth Chart */}
                    <div className="lg:col-span-2 bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white">Acquisition Velocity</h3>
                                <p className="text-xs text-gray-500 mt-1">Content released per year based on database entry</p>
                            </div>
                            <Link href="/executive/trends" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                                DETAILED REPORT <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="h-[300px] w-full relative z-10">
                            <Line 
                                data={growthChartData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                                    scales: {
                                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666', font: { size: 10 } } },
                                        x: { grid: { display: false }, ticks: { color: '#666', font: { size: 10 } } }
                                    },
                                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                                }} 
                            />
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    </div>

                    {/* Right: Platform Share */}
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col relative overflow-hidden">
                        <h3 className="text-xl font-bold text-white mb-2">Market Share</h3>
                        <p className="text-xs text-gray-500 mb-6">Top performing networks</p>
                        
                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="w-[220px] h-[220px]">
                                <Doughnut 
                                    data={platformChartData} 
                                    options={{ cutout: '75%', plugins: { legend: { display: false } } }} 
                                />
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-white">{charts?.platforms?.length || 0}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Networks</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {charts?.platforms?.slice(0, 4).map((p, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platformChartData.datasets[0].backgroundColor[i] }}></div>
                                    <span className="text-[10px] font-bold text-gray-300">{p.network_name}</span>
                                    <span className="text-[10px] text-gray-500 border-l border-gray-700 pl-1.5 ml-1">{p.total_shows}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: TALENT & INSIGHTS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Top Talent Leaderboard */}
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-500">trophy</span>
                                Bankable Stars
                            </h3>
                            <Link href="/executive/talents" className="text-xs text-gray-500 hover:text-white transition-colors">View All</Link>
                        </div>
                        <div className="space-y-1">
                            {topTalent && topTalent.length > 0 ? (
                                topTalent.map((person, idx) => (
                                    <TalentListItem 
                                        key={idx}
                                        rank={idx + 1}
                                        name={person.primaryName}
                                        role={person.primaryProfession}
                                        rating={person.AverageRating}
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-600 text-sm italic">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Content Gaps / Failed Searches */}
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col border-t-4 border-t-red-500/50">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white text-red-100">Content Demand Gaps</h3>
                                <p className="text-xs text-red-400/70 mt-1">High volume searches with 0 results</p>
                            </div>
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col space-y-1">
                            {bi?.failed_searches && bi.failed_searches.length > 0 ? (
                                bi.failed_searches.map((item, idx) => (
                                    <SearchGapItem key={idx} term={item.term} count={item.count} trend={item.trend} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50">
                                    <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                    <p className="text-xs">No critical gaps found</p>
                                </div>
                            )}
                        </div>

                        <button className="mt-6 w-full py-3 rounded-xl bg-linear-to-r from-red-600 to-red-800 text-white font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_task</span> Initiate Acquisition
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}