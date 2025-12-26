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

// --- KOMPONEN: KPI CARD ---
const StatCard = ({ title, value, subtext, icon, color }) => {
    const glowColors = {
        'text-cyan-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] hover:border-cyan-500/30',
        'text-yellow-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(250,204,21,0.3)] hover:border-yellow-500/30',
        'text-pink-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(244,114,182,0.3)] hover:border-pink-500/30',
        'text-purple-400': 'group-hover:shadow-[0_0_40px_-10px_rgba(192,132,252,0.3)] hover:border-purple-500/30',
    };
    const activeGlow = glowColors[color] || 'hover:border-white/20';

    return (
        <div className={`relative group p-6 rounded-3xl bg-[#151515] border border-white/5 transition-all duration-500 ease-out hover:-translate-y-2 ${activeGlow}`}>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 bg-linear-to-br ${color.replace('text-', 'from-')} to-transparent`}></div>
            <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-125`}>
                <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>{icon}</span>
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
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

// --- KOMPONEN: LIST ITEM ---
const TalentListItem = ({ rank, name, role, rating, isAsset }) => {
    const percentage = (rating / 10) * 100;

    // Tentukan Warna Ranking
    const getRankStyle = (r) => {
        if (r === 1) return {
            bg: 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30',
            text: 'text-yellow-400',
            badge: 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]',
            icon: 'emoji_events'
        };
        if (r === 2) return {
            bg: 'bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30',
            text: 'text-gray-300',
            badge: 'bg-gray-300 text-black shadow-[0_0_10px_rgba(209,213,219,0.3)]',
            icon: 'military_tech'
        };
        if (r === 3) return {
            bg: 'bg-gradient-to-r from-orange-700/20 to-transparent border-orange-700/30',
            text: 'text-orange-400',
            badge: 'bg-orange-600 text-white shadow-[0_0_10px_rgba(194,65,12,0.3)]',
            icon: 'military_tech'
        };
        return {
            bg: 'hover:bg-white/5 border-transparent',
            text: 'text-white',
            badge: 'bg-[#222] text-gray-400 border border-white/10',
            icon: null
        };
    };

    const style = getRankStyle(rank);
    
    return (
        <div className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-300 ${style.bg} hover:border-white/10`}>
            
            {/* RANK BADGE */}
            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-sm md:text-base ${style.badge}`}>
                {style.icon ? <span className="material-symbols-outlined text-base md:text-lg">{style.icon}</span> : `#${rank}`}
            </div>

            {/* INFO CONTENT */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm md:text-base font-bold truncate ${rank <= 3 ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {name}
                    </h4>
                    
                    {/* RATING BADGE */}
                    <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-md border border-white/5">
                        <span className="material-symbols-outlined text-[10px] md:text-xs text-yellow-500">star</span>
                        <span className="text-xs md:text-sm font-bold text-yellow-400">{Number(rating).toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[10px] md:text-xs text-gray-500 mb-1.5">
                    <span className="uppercase tracking-wider font-medium">{role}</span>
                    {rank <= 3 && <span className="text-[9px] text-yellow-500/70 font-mono hidden md:inline-block">TOP RATED</span>}
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-1 md:h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            isAsset 
                            ? 'bg-linear-to-r from-purple-600 to-pink-500' // Warna Studio (Ungu/Pink)
                            : 'bg-linear-to-r from-cyan-600 to-blue-500'   // Warna Global (Biru/Cyan)
                        }`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

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

export default function Dashboard({ kpi, charts, bi, filters, topTalent, isCompanyMode }) {

    if (!kpi) return null;

    const handleFilter = (range) => {
        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get('company_id');
        
        const data = { range };
        if (companyId) data.company_id = companyId;

        router.get('/executive/dashboard', data, { preserveState: true, preserveScroll: true });
    };

    // --- CHART DATA SETUP ---
    const growthChartData = {
        labels: charts?.growth?.map(d => d.startYear) || [],
        datasets: [{
            label: 'Titles Released',
            data: charts?.growth?.map(d => d.total_released) || [],
            borderColor: '#22d3ee',
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
            fill: true,
        }]
    };

    const platformChartData = {
        labels: charts?.platforms?.map(p => p.network_name) || [],
        datasets: [{
            data: charts?.platforms?.map(p => p.total_shows) || [],
            // Warna beda untuk Genre (Mode Company) vs Platform (Mode Global)
            backgroundColor: isCompanyMode 
                ? ['#a855f7', '#d946ef', '#f43f5e', '#f97316', '#eab308'] // Nuansa Ungu/Pink untuk Genre
                : ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#64748b'], // Nuansa Biru untuk Platform
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    const getStudioInsights = () => {
        if (!isCompanyMode || !charts?.growth || !charts?.platforms) return null;

        // 1. Peak Year (Productivity)
        const growth = charts.growth;
        const peak = growth.reduce((max, curr) => {
            const currVal = parseInt(curr.total_released);
            const maxVal = parseInt(max.total_released);
            return currVal > maxVal ? curr : max;
        }, growth[0] || {startYear: '-', total_released: 0});

        // 2. Core Genre (Identity)
        const topGenre = charts.platforms[0] || {network_name: '-', total_shows: 0};
        const totalTitlesInt = parseInt(kpi.total_titles.replace(/\./g, '')) || 1;
        const genreShare = ((topGenre.total_shows / totalTitlesInt) * 100).toFixed(0);

        // 3. Legacy / Active Years (Experience)
        // Mengambil tahun pertama dan terakhir dari grafik growth
        const startYear = parseInt(growth[0]?.startYear) || new Date().getFullYear();
        const endYear = parseInt(growth[growth.length - 1]?.startYear) || new Date().getFullYear();
        const activeYears = endYear - startYear;

        // NEW: Avg Market Impact (Engagement Efficiency)
        // Total Votes / Total Titles
        const totalVotesInt = parseInt(kpi.total_pros.replace(/\./g, '')) || 0; // total_pros dipinjam utk Votes
        const avgImpact = (totalVotesInt / totalTitlesInt).toLocaleString('id-ID'); // Format angka ribuan

        return { peak, topGenre, genreShare, activeYears, avgImpact };
    };

    const insights = getStudioInsights();

    return (
        <DashboardLayout>
            <Head title={isCompanyMode ? "Studio Overview" : "Executive Overview"} />

            <div className="min-h-screen pb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-10">
                    <div>
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                            {isCompanyMode ? 'Studio Analytics' : 'Real-time Analytics'}
                        </h2>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            {isCompanyMode ? (
                                <>Madhouse <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">Inc.</span></>
                            ) : (
                                <>Executive <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">Suite</span></>
                            )}
                        </h1>
                    </div>

                    {/* Filter Pills (Disembunyikan di Mode Company karena datanya statis sejarah) */}
                    {/* {!isCompanyMode && (
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
                    )} */}
                </div>

                {/* --- KPI GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Library" 
                        value={kpi.total_titles} 
                        subtext={kpi.growth_txt} 
                        icon="movie_filter" 
                        color="text-cyan-400" 
                    />
                    <StatCard 
                        title="Avg Quality" 
                        value={kpi.avg_rating} 
                        subtext={isCompanyMode ? "Studio Avg" : "Global Avg"} 
                        icon="hotel_class" 
                        color="text-yellow-400" 
                    />
                    {/* Di Mode Company: Total Pros -> Total Votes/Engagement */}
                    <StatCard 
                        title={isCompanyMode ? "Total Engagement" : "Talent Pool"} 
                        value={kpi.total_pros} 
                        subtext={isCompanyMode ? "Audience Votes" : "+12 New"} 
                        icon={isCompanyMode ? "thumb_up" : "groups"} 
                        color="text-pink-400" 
                    />
                    {/* Di Mode Company: Total TV -> Total Seasons */}
                    <StatCard 
                        title={isCompanyMode ? "Total Seasons" : "TV Series"} 
                        value={kpi.total_tv} 
                        subtext={isCompanyMode ? "Produced" : "On Air"} 
                        icon={isCompanyMode ? "layers" : "live_tv"} 
                        color="text-purple-400" 
                    />
                </div>

                {/* --- MAIN CHARTS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    {/* Left: Growth Chart */}
                    <div className="lg:col-span-2 bg-linear-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {isCompanyMode ? "Production History" : "Acquisition Velocity"}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                        isCompanyMode 
                                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
                                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                                    }`}>
                                        YEARLY
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {isCompanyMode ? "Titles released per year (1970 - 2023)" : "Content released per year based on database entry"}
                                </p>
                            </div>
                            
                            <Link href="/executive/trends" className={`text-xs font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg border border-transparent ${
                                isCompanyMode 
                                ? 'text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20' 
                                : 'text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/20'
                            }`}>
                                FULL REPORT <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Chart Container */}
                        <div className="h-[300px] w-full relative z-10">
                            <Line 
                                data={{
                                    ...growthChartData,
                                    datasets: [{
                                        ...growthChartData.datasets[0],
                                        // Dynamic Color based on Mode
                                        borderColor: isCompanyMode ? '#c084fc' : '#22d3ee', // Purple vs Cyan
                                        backgroundColor: (context) => {
                                            const ctx = context.chart.ctx;
                                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                            if (isCompanyMode) {
                                                gradient.addColorStop(0, 'rgba(192, 132, 252, 0.4)'); // Purple
                                                gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
                                            } else {
                                                gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)'); // Cyan
                                                gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                                            }
                                            return gradient;
                                        },
                                        pointBorderColor: isCompanyMode ? '#c084fc' : '#22d3ee',
                                    }]
                                }} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: '#000', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#333', borderWidth: 1 } },
                                    scales: {
                                        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#666', font: { size: 10, family: 'monospace' } }, border: { display: false } },
                                        x: { grid: { display: false }, ticks: { color: '#666', font: { size: 10, family: 'monospace' } }, border: { display: false } }
                                    },
                                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                                }} 
                            />
                        </div>

                        {/* Ambient Glow Effect */}
                        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 ${
                            isCompanyMode ? 'bg-purple-500' : 'bg-cyan-500'
                        }`}></div>
                    </div>

                    {/* Right: Pie Chart */}
                    <div className="bg-linear-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col relative overflow-hidden">
                        
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-1">
                                {isCompanyMode ? "Genre Distribution" : "Market Share"}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">pie_chart</span>
                                {isCompanyMode ? "Top genres produced" : "Top performing networks"}
                            </p>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
                            <div className="w-[200px] h-[200px] relative z-10">
                                <Doughnut 
                                    data={platformChartData} 
                                    options={{ 
                                        cutout: '80%', 
                                        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#000', bodyFont: { size: 12 } } },
                                        borderWidth: 0,
                                    }} 
                                />
                            </div>
                            
                            {/* Center Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                                <span className="text-4xl font-black text-white tracking-tighter">
                                    {charts?.platforms?.length || 0}
                                </span>
                                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${
                                    isCompanyMode ? 'text-purple-400' : 'text-cyan-400'
                                }`}>
                                    {isCompanyMode ? "Genres" : "Networks"}
                                </span>
                            </div>
                        </div>

                        {/* Compact Legend (Updated to show Top 5) */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {/* UBAH DARI slice(0, 4) MENJADI slice(0, 5) */}
                            {charts?.platforms?.slice(0, 5).map((p, i) => (
                                <div key={i} className="group flex items-center gap-2 px-3 py-1.5 bg-white/3 hover:bg-white/8 rounded-lg border border-white/5 transition-all cursor-default">
                                    {/* Dot Warna */}
                                    <div 
                                        className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                                        style={{ 
                                            // Fallback warna jika data lebih dari 5 (biar tidak error)
                                            backgroundColor: platformChartData.datasets[0].backgroundColor[i] || '#666',
                                            color: platformChartData.datasets[0].backgroundColor[i] || '#666'
                                        }}
                                    ></div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-300 leading-none group-hover:text-white">
                                            {p.network_name}
                                        </span>
                                    </div>
                                    
                                    {/* Jumlah Angka */}
                                    <span className="text-[10px] font-mono text-gray-500 pl-2 border-l border-white/10 group-hover:text-gray-300">
                                        {p.total_shows}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* LEFT SIDE: LIST (Top Performing Assets) */}
                    <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 shadow-xl flex flex-col h-full overflow-hidden">
                        
                        {/* HEADER (Margin bawah dikurangi) */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-lg">trophy</span>
                                    {isCompanyMode ? "Top Assets" : "Top Stars"}
                                </h3>
                            </div>
                            
                            <Link href="/executive/talents" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                                VIEW ALL 
                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </Link>
                        </div>

                        {/* LIST CONTENT */}
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1.5">
                            {topTalent && topTalent.length > 0 ? (
                                topTalent.map((person, idx) => (
                                    <TalentListItem 
                                        key={idx}
                                        rank={idx + 1}
                                        name={person.primaryName}
                                        role={person.primaryProfession}
                                        rating={person.AverageRating}
                                        isAsset={isCompanyMode}
                                    />
                                ))
                            ) : (
                                <div className="h-32 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/10 rounded-lg bg-white/3">
                                    <span className="text-xs italic">No data available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isCompanyMode ? (
                        // --- GLOBAL MODE: MARKET PULSE (Cyan Theme) ---
                        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col h-full relative overflow-hidden">
                            
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [bg-size:16px_16px] opacity-20 pointer-events-none"></div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Global Market Pulse</h3>
                                    <p className="text-xs text-cyan-400 font-medium mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                        Real-time Industry Stats
                                    </p>
                                </div>
                                <div className="p-2.5 bg-linear-to-br from-cyan-500/20 to-cyan-900/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                                    <span className="material-symbols-outlined text-cyan-400">public</span>
                                </div>
                            </div>

                            {/* Insight Grid (4 Kotak) */}
                            <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
                                
                                {/* 1. Peak Production (Global) */}
                                <div className="p-5 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300 min-h-[140px]">
                                    <div className="absolute top-3 right-3 text-white/20 group-hover:text-cyan-400 transition-colors">
                                        <span className="material-symbols-outlined text-lg">arrow_outward</span>
                                    </div>
                                    <span className="absolute -right-8 -bottom-8 text-[9rem] text-white/3 group-hover:text-cyan-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        factory
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Peak Output</span>
                                        <div className="text-4xl font-black text-white tracking-tight leading-none">{bi?.market_insights?.peak?.startYear || '-'}</div>
                                    </div>
                                    <div className="relative z-10 mt-4">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-sm text-cyan-400">production_quantity_limits</span>
                                            <span className="text-[11px] font-bold text-cyan-200">{bi?.market_insights?.peak?.total_released || 0} Titles</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Dominant Genre (Global) */}
                                <div className="p-5 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/30 hover:bg-white/8 transition-all duration-300 min-h-[140px]">
                                    <div className="absolute top-3 right-3 text-white/20 group-hover:text-teal-400 transition-colors">
                                        <span className="material-symbols-outlined text-lg">arrow_outward</span>
                                    </div>
                                    <span className="absolute -right-8 -bottom-8 text-[9rem] text-white/3 group-hover:text-teal-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        theater_comedy
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Global Trend</span>
                                        <div className="text-2xl font-black text-white leading-tight tracking-tight line-clamp-2" title={bi?.market_insights?.topGenre?.network_name}>
                                            {bi?.market_insights?.topGenre?.network_name || '-'}
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-2">
                                        <div className="flex items-end gap-1">
                                            <span className="text-3xl font-black text-teal-500 leading-none">{bi?.market_insights?.genreShare || 0}%</span>
                                            <span className="text-[10px] text-gray-500 font-medium mb-1">Market Share</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(bi?.market_insights?.genreShare || 0, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Industry History */}
                                <div className="p-5 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30 hover:bg-white/8 transition-all duration-300 min-h-[140px]">
                                    <div className="absolute top-3 right-3 text-white/20 group-hover:text-blue-400 transition-colors">
                                        <span className="material-symbols-outlined text-lg">arrow_outward</span>
                                    </div>
                                    <span className="absolute -right-8 -bottom-8 text-[9rem] text-white/3 group-hover:text-blue-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        public
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Data History</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-white tracking-tight">{bi?.market_insights?.activeYears || 0}</span>
                                            <span className="text-sm font-bold text-gray-500">Years</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-2">
                                        <div className="flex items-center gap-2 text-[10px] text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-fit">
                                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                            Global Archives
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Global Avg Impact */}
                                <div className="p-5 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30 hover:bg-white/8 transition-all duration-300 min-h-[140px]">
                                    <div className="absolute top-3 right-3 text-white/20 group-hover:text-indigo-400 transition-colors">
                                        <span className="material-symbols-outlined text-lg">arrow_outward</span>
                                    </div>
                                    <span className="absolute -right-8 -bottom-8 text-[9rem] text-white/3 group-hover:text-indigo-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        bar_chart
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Avg. Global Votes</span>
                                        <div className="text-3xl font-black text-white tracking-tight truncate" title={bi?.market_insights?.avgImpact}>
                                            {bi?.market_insights?.avgImpact || 0}
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-2">
                                        <p className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 mb-1">
                                            <span className="material-symbols-outlined text-sm">groups</span>
                                            Audience Volume
                                        </p>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                                            <span className="material-symbols-outlined text-[10px] text-indigo-400">equalizer</span>
                                            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wide">Standard Metric</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // --- MODE COMPANY: STUDIO DNA ---
                        <div className="bg-[#1A1A1A] rounded-2xl p-4 md:p-5 border border-white/5 shadow-xl flex flex-col h-full relative overflow-hidden">
                            
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [bg-size:16px_16px] opacity-20 pointer-events-none"></div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-white tracking-tight">Studio DNA</h3>
                                    <p className="text-[10px] text-purple-400 font-medium mt-0.5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                        Key Performance Markers
                                    </p>
                                </div>
                                <div className="p-1.5 bg-linear-to-br from-purple-500/20 to-purple-900/10 rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <span className="material-symbols-outlined text-purple-400 text-lg">insights</span>
                                </div>
                            </div>

                            {/* Insight Grid (4 Kotak - Compact) */}
                            <div className="grid grid-cols-2 gap-3 flex-1 relative z-10">
                                
                                {/* 1. Peak Year */}
                                <div className="p-3 md:p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 hover:bg-white/8 transition-all duration-300 min-h-[110px] md:min-h-[130px]">
                                    
                                    <div className="absolute top-2 right-2 text-white/20 group-hover:text-purple-400 transition-colors">
                                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                                    </div>

                                    {/* WATERMARK (Kecilin dikit) */}
                                    <span className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-[4rem] md:text-[7rem] text-white/3 group-hover:text-purple-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        calendar_month
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Peak Output</span>
                                        {/* Font lebih kecil dan rapat */}
                                        <div className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{insights?.peak?.startYear || '-'}</div>
                                    </div>

                                    <div className="relative z-10 mt-2">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-xs text-purple-400">stacked_bar_chart</span>
                                            <span className="text-[9px] font-bold text-purple-200">{insights?.peak?.total_released || 0} Titles</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Core Genre */}
                                <div className="p-3 md:p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-pink-500/30 hover:bg-white/8 transition-all duration-300 min-h-[110px] md:min-h-[130px]">
                                    
                                    <div className="absolute top-2 right-2 text-white/20 group-hover:text-pink-400 transition-colors">
                                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                                    </div>

                                    <span className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-[4rem] md:text-[7rem] text-white/3 group-hover:text-pink-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        category
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Core Genre</span>
                                        <div className="text-lg md:text-xl font-black text-white leading-tight tracking-tight line-clamp-2 pr-4" title={insights?.topGenre?.network_name}>
                                            {insights?.topGenre?.network_name || '-'}
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-2">
                                        <div className="flex items-end gap-1">
                                            <span className="text-xl md:text-2xl font-black text-pink-500 leading-none">{insights?.genreShare || 0}%</span>
                                            <span className="text-[9px] text-gray-500 font-medium mb-0.5">of Library</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-pink-600 to-pink-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(insights?.genreShare || 0, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Active Era */}
                                <div className="p-3 md:p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30 hover:bg-white/8 transition-all duration-300 min-h-[110px] md:min-h-[130px]">
                                    
                                    <div className="absolute top-2 right-2 text-white/20 group-hover:text-blue-400 transition-colors">
                                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                                    </div>

                                    <span className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-[4rem] md:text-[7rem] text-white/3 group-hover:text-blue-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        history
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Active Era</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{insights?.activeYears || 0}</span>
                                            <span className="text-[10px] md:text-xs font-bold text-gray-500">Years</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10 mt-2">
                                        <div className="flex items-center gap-1.5 text-[9px] text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-fit">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                            Since {new Date().getFullYear() - (insights?.activeYears || 0)}
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Market Impact */}
                                <div className="p-3 md:p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500/30 hover:bg-white/8 transition-all duration-300 min-h-[110px] md:min-h-[130px]">
                                    
                                    <div className="absolute top-2 right-2 text-white/20 group-hover:text-yellow-400 transition-colors">
                                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                                    </div>

                                    <span className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-[4rem] md:text-[7rem] text-white/3 group-hover:text-yellow-500/8 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 material-symbols-outlined pointer-events-none select-none">
                                        trending_up
                                    </span>
                                    
                                    <div className="relative z-10">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Avg. Impact</span>
                                        <div className="text-2xl md:text-3xl font-black text-white tracking-tight truncate" title={insights?.avgImpact}>
                                            {insights?.avgImpact || 0}
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-2">
                                        <p className="text-[9px] text-yellow-500 font-bold flex items-center gap-1 mb-1">
                                            <span className="material-symbols-outlined text-xs">bolt</span>
                                            Votes / Title
                                        </p>
                                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
                                            <span className="material-symbols-outlined text-[9px] text-yellow-400">verified</span>
                                            <span className="text-[8px] font-bold text-yellow-200 uppercase tracking-wide">High Engagement</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}