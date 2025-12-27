import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

// --- HELPER: Format Angka ---
const formatNum = (num) => new Intl.NumberFormat('id-ID').format(num);

// --- HELPER: Generate Page Numbers (Smart Pagination) ---
// Logika ini membatasi jumlah tombol agar tidak muncul 1-255 sekaligus
const getPageNumbers = (currentPage, lastPage) => {
    const delta = 2; // Jumlah halaman di kiri/kanan current page
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    // Jika halaman sedikit, tampilkan 1-5 langsung (sesuai request)
    if (lastPage <= 7) {
        for (let i = 2; i <= lastPage; i++) range.push(i);
    } else {
        // Logika "Window" untuk halaman banyak
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < lastPage && i > 1) {
                range.push(i);
            }
        }
        
        // Tambahkan halaman terakhir jika belum ada
        if (lastPage > 1) range.push(lastPage);
        
        // Bias ke halaman awal (jika current page masih di 1-4, tampilkan sampai 5)
        if (currentPage <= 4) {
             // Reset range dan paksa 1,2,3,4,5 ... Last
             range.length = 0;
             for(let i=1; i<=5; i++) range.push(i);
             range.push(lastPage);
        }
    }

    // Tambahkan "..." (dots)
    // Sort & Unique dulu biar aman
    let uniqueRange = [...new Set(range)].sort((a,b) => a-b);
    
    for (let i of uniqueRange) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
};

// --- COMPONENT: STAT CARD ---
const PlatformStatCard = ({ label, value, subtext, icon, theme }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group transition-all duration-300 shadow-xl hover:border-white/10">
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-30 ${theme.glow}`}></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${theme.text} shadow-inner`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
            </div>
            <div>
                <h4 className="text-3xl font-black text-white tracking-tighter truncate" title={value}>
                    {value}
                </h4>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">{label}</p>
                <p className="text-[10px] text-neutral-600 mt-2 font-medium">{subtext}</p>
            </div>
        </div>
    </div>
);

export default function Platforms({ kpi, data, isCompanyMode }) {

    // --- 1. THEME ENGINE ---
    const theme = isCompanyMode ? {
        mode: 'Studio',
        primary: '#c084fc',
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        glow: 'bg-purple-500',
        bubble: 'rgba(192, 132, 252, 0.6)',
        bubbleBorder: '#c084fc'
    } : {
        mode: 'Global',
        primary: '#22d3ee',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500',
        glow: 'bg-cyan-500',
        bubble: 'rgba(34, 211, 238, 0.6)',
        bubbleBorder: '#22d3ee'
    };

    // --- 2. CHART CONFIG ---
    const chartData = {
        datasets: [{
            label: isCompanyMode ? 'Partner Networks' : 'Competitor Networks',
            data: data.data.map(item => ({
                x: item.total_titles, 
                y: item.avg_rating,   
                r: Math.max(6, Math.min(40, item.total_votes / 2000)) 
            })),
            backgroundColor: theme.bubble,
            borderColor: theme.bubbleBorder,
            borderWidth: 2,
            hoverBackgroundColor: '#fff',
            hoverBorderColor: '#fff',
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 15, 15, 0.95)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (ctx) => {
                        const item = data.data[ctx.dataIndex];
                        return [
                            ` ${item.network_name}`,
                            ` Titles: ${formatNum(item.total_titles)}`,
                            ` Rating: ${item.avg_rating.toFixed(1)}`,
                            ` Tier: ${item.tier}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Volume (Total Titles)', color: '#555', font: { size: 10, family: 'Inter' } },
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#666', font: {family: 'Inter', size: 10} }
            },
            y: {
                title: { display: true, text: 'Quality (Avg Rating)', color: '#555', font: { size: 10, family: 'Inter' } },
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#666', font: {family: 'Inter', size: 10} },
                min: 4, 
                max: 10
            }
        }
    };

    // --- SMART PAGINATION LINKS ---
    const pageNumbers = getPageNumbers(data.current_page, data.last_page);

    return (
        <DashboardLayout>
            <Head title={`${theme.mode} Platform Intel`} />

            <div className="min-h-screen pb-12 space-y-8 font-sans">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`flex h-3 w-3 relative`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.bg}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.bg}`}></span>
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-[0.3em] ${theme.text} opacity-80`}>
                                Distribution Intel
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            {theme.mode} <span className="text-neutral-500">Networks</span>
                        </h1>
                        <p className="text-neutral-500 text-sm mt-3 max-w-xl leading-relaxed">
                            {isCompanyMode 
                                ? "Evaluating partnership performance. Which networks distribute your highest-rated content?"
                                : "Competitive landscape analysis. Benchmarking top networks by volume and audience reception."}
                        </p>
                    </div>
                    
                    <button className="bg-[#1A1A1A] border border-white/10 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-3 cursor-default shadow-lg backdrop-blur-sm">
                        <span className={`material-symbols-outlined text-lg ${theme.text}`}>hub</span> 
                        {formatNum(kpi.total_coverage)} Networks
                    </button>
                </div>

                {/* --- KPI CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PlatformStatCard 
                        label="Dominant Network" 
                        value={kpi.dominant_network} 
                        subtext="Highest volume of titles"
                        icon="domain" 
                        theme={theme}
                    />
                    <PlatformStatCard 
                        label="Quality Leader" 
                        value={kpi.highest_quality} 
                        subtext="Best average audience rating"
                        icon="hotel_class" 
                        theme={{ ...theme, text: 'text-amber-400', glow: 'bg-amber-500' }}
                    />
                    <PlatformStatCard 
                        label="Network Coverage" 
                        value={formatNum(kpi.total_coverage)} 
                        subtext={isCompanyMode ? "Active distribution partners" : "Total networks analyzed"}
                        icon="public" 
                        theme={{ ...theme, text: 'text-emerald-400', glow: 'bg-emerald-500' }}
                    />
                </div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: MATRIX CHART --- */}
                    <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Performance Matrix</h3>
                                <p className="text-xs text-neutral-500">Correlation: Volume (X) vs Quality (Y)</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] text-gray-400 font-medium">Bubble Size = Popularity</span>
                            </div>
                        </div>
                        <div className="h-[450px] w-full flex-1">
                            <Bubble data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* RIGHT: LEADERBOARD LIST (Fixed Rounded Corners) --- */}
                    <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-xl flex flex-col h-[550px] relative">
                        
                        {/* Header: Rounded Top */}
                        <div className="p-6 border-b border-white/5 bg-[#161616] rounded-t-3xl z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {isCompanyMode ? 'Top Partners' : 'Market Leaders'}
                                <span className="flex h-2 w-2 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.bg}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.bg}`}></span>
                                </span>
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1">Ranked by total volume</p>
                        </div>
                        
                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-[#1A1A1A]">
                            {data.data.map((item, idx) => {
                                const rank = (data.current_page - 1) * data.per_page + idx + 1;
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group cursor-default">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors ${
                                                rank <= 3 
                                                ? `${theme.text} border-${theme.text.split('-')[1]}-500/30 bg-${theme.text.split('-')[1]}-500/10`
                                                : 'text-neutral-500 border-white/5 bg-white/5'
                                            }`}>
                                                {rank <= 3 && <span className="mr-0.5 text-[10px]"></span>}
                                                {rank}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-neutral-300 group-hover:text-white truncate transition-colors" title={item.network_name}>
                                                    {item.network_name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                                                        item.tier === 'Elite' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                        item.tier === 'Mainstream' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                    } font-bold uppercase tracking-wider`}>
                                                        {item.tier}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right shrink-0">
                                            <div className="text-xs font-mono font-bold text-white group-hover:scale-105 transition-transform">{formatNum(item.total_titles)}</div>
                                            <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-500 mt-0.5">
                                                <span className="text-yellow-500 font-bold">{item.avg_rating.toFixed(1)}</span>
                                                <span className="material-symbols-outlined text-[10px] text-yellow-500">star</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer: Rounded Bottom (Fixed Sharp Corners) */}
                        <div className="p-4 border-t border-white/5 bg-[#161616] flex justify-between items-center rounded-b-3xl z-10">
                            <span className="text-[10px] text-neutral-500 font-medium">
                                Page <span className="text-white">{data.current_page}</span> of {data.last_page}
                            </span>
                            
                            {/* SMART PAGINATION CONTROLS */}
                            <div className="flex gap-1">
                                {/* Previous Button */}
                                <Link 
                                    href={data.prev_page_url || '#'}
                                    preserveScroll
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                                        data.prev_page_url 
                                        ? 'bg-[#1A1A1A] border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white' 
                                        : 'opacity-30 cursor-not-allowed text-neutral-600'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </Link>

                                {/* Page Numbers (1 2 ... 225) */}
                                {pageNumbers.map((p, i) => (
                                    p === '...' ? (
                                        <span key={i} className="w-7 h-7 flex items-center justify-center text-[10px] text-neutral-600">...</span>
                                    ) : (
                                        <Link 
                                            key={i} 
                                            href={data.links.find(l => l.label == p)?.url || '#'} // Cari URL yang match dengan nomor halaman
                                            preserveScroll 
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all border ${
                                                p === data.current_page
                                                ? `${theme.bg} border-transparent text-white shadow-lg`
                                                : 'bg-[#1A1A1A] border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            {p}
                                        </Link>
                                    )
                                ))}

                                {/* Next Button */}
                                <Link 
                                    href={data.next_page_url || '#'}
                                    preserveScroll
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                                        data.next_page_url 
                                        ? 'bg-[#1A1A1A] border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white' 
                                        : 'opacity-30 cursor-not-allowed text-neutral-600'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}