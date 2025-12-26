import React, { useMemo } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// --- HELPER: FORMAT ANGKA INDONESIA (Titik untuk ribuan) ---
const formatNum = (num) => new Intl.NumberFormat('id-ID').format(num);

// --- COMPONENT: STAT CARD (Executive Style) ---
const StatCard = ({ label, value, subtext, icon, trend, theme }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group hover:border-white/20 transition-all duration-300 shadow-xl">
        {/* Ambient Glow */}
        <div className={`absolute -right-6 -top-6 w-40 h-40 bg-gradient-to-br ${theme.gradient} opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${theme.text} backdrop-blur-md`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${
                        trend > 0 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        <span className="material-symbols-outlined text-[14px]">
                            {trend > 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        {Math.abs(trend).toString().replace('.', ',')}% YoY
                    </div>
                )}
            </div>
            
            <h4 className="text-4xl font-black text-white tracking-tight">
                {typeof value === 'number' ? formatNum(value) : value}
            </h4>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
            <p className={`text-xs ${theme.text} opacity-70 mt-2 font-medium`}>{subtext}</p>
        </div>
    </div>
);

export default function Trends({ reports, isCompanyMode }) {

    // --- 1. THEME ENGINE ---
    const theme = isCompanyMode ? {
        mode: 'Studio',
        primary: '#c084fc',
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        gradient: 'from-purple-600 to-pink-500',
        chartColor: { solid: '#c084fc', fade: 'rgba(192, 132, 252, 0.2)' }
    } : {
        mode: 'Global',
        primary: '#22d3ee',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500',
        gradient: 'from-cyan-500 to-blue-600',
        chartColor: { solid: '#22d3ee', fade: 'rgba(34, 211, 238, 0.2)' }
    };

    // --- 2. DATA PREPARATION ---
    const { history, genres, insights } = useMemo(() => {
        const rawHistory = reports?.growth_history || [];
        const rawGenres = reports?.genre_stats || [];
        
        return {
            history: rawHistory,
            genres: rawGenres,
            insights: reports?.insights || { volume_yoy: 0, quality_yoy: 0, current_year_vol: 0, current_year_rating: 0 }
        };
    }, [reports]);

    // --- 3. CHART CONFIG: DUAL AXIS ---
    const velocityData = {
        labels: history.map(d => d.startYear),
        datasets: [
            {
                type: 'line',
                label: 'Avg Rating',
                data: history.map(d => d.avg_rating),
                borderColor: '#fbbf24', 
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#1A1A1A',
                pointBorderColor: '#fbbf24',
                pointBorderWidth: 2,
                yAxisID: 'y1',
                order: 1
            },
            {
                type: 'bar',
                label: 'Releases',
                data: history.map(d => d.total_released),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 450); // Adjusted for taller chart
                    gradient.addColorStop(0, theme.chartColor.solid);
                    gradient.addColorStop(1, theme.chartColor.fade);
                    return gradient;
                },
                borderRadius: 4,
                barThickness: 'flex',
                maxBarThickness: 50, // Sedikit lebih tebal
                yAxisID: 'y',
            }
        ]
    };

    const dualAxisOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: true, labels: { color: '#fff', font: { family: 'Inter', size: 11 } } },
            tooltip: {
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: (ctx) => {
                        let val = ctx.raw;
                        if(ctx.dataset.type === 'line') return ` Rating: ${Number(val).toLocaleString('id-ID')}/10`;
                        return ` Released: ${Number(val).toLocaleString('id-ID')} Titles`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#666', font: { size: 10 } } },
            y: { 
                type: 'linear', display: true, position: 'left', 
                grid: { color: 'rgba(255,255,255,0.03)' }, 
                ticks: { color: '#666' },
                title: { display: true, text: 'Volume', color: '#444', font: {size: 10} }
            },
            y1: { 
                type: 'linear', display: true, position: 'right', 
                grid: { display: false }, 
                ticks: { color: '#fbbf24' },
                min: 0, max: 10,
                title: { display: true, text: 'Quality Score', color: '#fbbf24', font: {size: 10} }
            },
        }
    };

    return (
        <DashboardLayout>
            <Head title={`${theme.mode} Intelligence`} />

            <div className="min-h-screen pb-12 space-y-8">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`flex h-3 w-3 relative`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.bg}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.bg}`}></span>
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-[0.3em] ${theme.text}`}>
                                Strategic Intelligence
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            {theme.mode} <span className="text-gray-400">Performance</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2">
                        <span className="material-symbols-outlined text-gray-400 text-sm">calendar_month</span>
                        <span className="text-sm font-semibold text-white">Last 15 Years</span>
                    </div>
                </div>

                {/* --- KPI CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        label="Production Vol." 
                        value={insights.current_year_vol}
                        subtext="Titles released this year"
                        icon="movie_filter"
                        trend={insights.volume_yoy}
                        theme={theme}
                    />
                    <StatCard 
                        label="Avg Quality" 
                        value={insights.current_year_rating}
                        subtext="Weighted average rating"
                        icon="star_half"
                        trend={insights.quality_yoy}
                        theme={{...theme, text: 'text-amber-400', gradient: 'from-amber-500 to-orange-500'}}
                    />
                     <StatCard 
                        label="Peak Year" 
                        value={history.length > 0 ? [...history].sort((a,b)=>b.total_released - a.total_released)[0]?.startYear : '-'}
                        subtext="Highest production output"
                        icon="history_toggle_off"
                        theme={{...theme, text: 'text-gray-400', gradient: 'from-gray-700 to-gray-500'}}
                    />
                    <StatCard 
                        label="Top Genre" 
                        value={genres.length > 0 ? genres[0].genre_name : '-'}
                        subtext="Most voted category"
                        icon="category"
                        theme={{...theme, text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-500'}}
                    />
                </div>

                {/* --- MAIN ANALYSIS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT: VELOCITY & QUALITY CHART (Tinggi dinaikkan jadi 450px) --- */}
                    <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Production Velocity vs Quality</h3>
                                <p className="text-xs text-gray-500">Correlation between output volume and audience reception</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg">
                                <span className="material-symbols-outlined text-gray-400">ssid_chart</span>
                            </div>
                        </div>
                        {/* REVISI: Tinggi diubah dari 350px menjadi 450px */}
                        <div className="h-[450px] w-full">
                            <Bar data={velocityData} options={dualAxisOptions} />
                        </div>
                    </div>

                    {/* RIGHT: TOP GENRES (Menyesuaikan tinggi container kiri) --- */}
                    <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col h-[580px]"> {/* Set Fixed Height to match left side roughly */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white">Genre Dominance</h3>
                            <p className="text-xs text-gray-500">Top 10 genres by total engagement (votes)</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {/* REVISI: Spacing diperbesar (space-y-5) agar mengisi ruang vertikal */}
                            <div className="space-y-6">
                                {genres.map((genre, idx) => (
                                    <div key={idx} className="group relative">
                                        <div className="flex justify-between text-xs mb-1.5 text-gray-300 font-medium relative z-10">
                                            <span>{idx + 1}. {genre.genre_name}</span>
                                            <span className="opacity-60">{formatNum(genre.total_votes)} votes</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${isCompanyMode ? 'bg-pink-500' : 'bg-blue-500'} group-hover:brightness-125 transition-all duration-500`}
                                                style={{ width: `${(genre.total_votes / genres[0].total_votes) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mini Quality Insight Footer */}
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-amber-500/10">
                                    <span className="material-symbols-outlined text-amber-500 text-sm">workspace_premium</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Highest Rated Genre</p>
                                    <p className="text-sm font-bold text-white">
                                        {genres.length > 0 ? [...genres].sort((a,b)=>b.avg_rating - a.avg_rating)[0]?.genre_name : '-'}
                                        <span className="text-amber-500 ml-1">
                                            ({genres.length > 0 ? Number([...genres].sort((a,b)=>b.avg_rating - a.avg_rating)[0]?.avg_rating).toLocaleString('id-ID') : 0})
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}