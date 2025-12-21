import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// --- KOMPONEN KECIL: SUMMARY CARD ---
const InsightCard = ({ label, value, subtext, icon, color, gradient }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 group hover:border-white/10 transition-all duration-300">
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-linear-to-br ${gradient} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <h4 className="text-2xl font-black text-white">{value}</h4>
            <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>
        </div>
    </div>
);

export default function Trends({ reports }) {

    // --- 1. DATA PREPARATION ---
    const latestGrowth = reports.growth[reports.growth.length - 1] || {};
    const topPopGenre = reports.popular_genres[0] || {};
    const topQualGenre = reports.quality_genres[0] || {};

    // --- 2. CHART CONFIGURATIONS ---
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false }, // Legend global dimatikan (biar bersih)
            tooltip: {
                backgroundColor: 'rgba(15, 15, 15, 0.95)',
                titleColor: '#fff',
                bodyColor: '#a3a3a3',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true, // PENTING: Aktifkan kotak warna di tooltip untuk Movies/TV
                callbacks: {
                    label: (ctx) => {
                        let val = Number(ctx.raw).toLocaleString();
                        
                        // Logic Label Custom
                        if (ctx.chart.canvas.id === 'popChart') return ` ${val} Votes`;
                        if (ctx.chart.canvas.id === 'qualChart') return ` ⭐ ${Number(ctx.raw).toFixed(1)} Rating`;
                        
                        // Default untuk Growth Chart (Movies vs TV)
                        // Akan muncul: "Movies: 1,200 Titles"
                        return ` ${ctx.dataset.label}: ${val} Titles`;
                    }
                }
            }
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { color: '#525252', font: { size: 10, family: 'Inter' } } 
            },
            y: { 
                grid: { color: 'rgba(255,255,255,0.03)' }, 
                ticks: { color: '#525252', font: { size: 10, family: 'Inter' } },
                border: { display: false }
            }
        },
        layout: { padding: 0 }
    };

    // --- DATA: INDUSTRY GROWTH (DOUBLE LINE: MOVIES vs TV) ---
    const growthData = {
        labels: reports.growth.map(d => d.startYear),
        datasets: [
            // DATASET 1: MOVIES
            {
                label: 'Movies',
                data: reports.growth.map(d => d.total_movies || 0), 
                borderColor: '#c084fc', // Purple Neon
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(192, 132, 252, 0.4)'); 
                    gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                
                // Styling Titik (Hollow Dots)
                pointRadius: 4, 
                pointHoverRadius: 7,
                pointBackgroundColor: '#121212', // Tengahnya hitam
                pointBorderColor: '#c084fc',     // Pinggirnya ungu
                pointBorderWidth: 2,
            },
            // DATASET 2: TV SHOWS
            {
                label: 'TV Shows',
                data: reports.growth.map(d => d.total_tv || 0), 
                borderColor: '#22d3ee', // Cyan Neon
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)'); 
                    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                
                // Styling Titik (Hollow Dots)
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: '#121212',
                pointBorderColor: '#22d3ee',
                pointBorderWidth: 2,
            }
        ]
    };

    // --- DATA: POPULAR GENRE (BAR) ---
    const popularGenreData = {
        labels: reports.popular_genres.map(g => g.genre_name),
        datasets: [{
            data: reports.popular_genres.map(g => g.total_votes),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 300, 0); 
                gradient.addColorStop(0, '#2563eb'); // Blue-600
                gradient.addColorStop(1, '#60a5fa'); // Blue-400
                return gradient;
            },
            borderRadius: 4,
            barThickness: 20,
        }]
    };

    // --- DATA: QUALITY GENRE (BAR) ---
    const qualityGenreData = {
        labels: reports.quality_genres.map(g => g.genre_name),
        datasets: [{
            data: reports.quality_genres.map(g => g.avg_rating),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 300, 0);
                gradient.addColorStop(0, '#059669'); // Emerald-600
                gradient.addColorStop(1, '#34d399'); // Emerald-400
                return gradient;
            },
            borderRadius: 4,
            barThickness: 20,
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Market Trends" />

            <div className="min-h-screen pb-12 space-y-8">
                
                {/* --- HEADER & SUMMARY --- */}
                <div className="flex flex-col gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Market Intelligence</h2>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Trend <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Analysis</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                            Monitoring historical content velocity, genre popularity shifts, and critical reception metrics to guide acquisition strategy.
                        </p>
                    </div>

                    {/* AT A GLANCE (3 KOLOM) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InsightCard 
                            label="Current Velocity" 
                            value={latestGrowth.total_released || 0} 
                            subtext={`New Titles in ${latestGrowth.startYear}`}
                            icon="rocket_launch" 
                            color="text-purple-400"
                            gradient="from-purple-500 to-pink-500"
                        />
                        <InsightCard 
                            label="Dominant Genre" 
                            value={topPopGenre.genre_name || '-'} 
                            subtext="Most Voted by Audience"
                            icon="campaign" 
                            color="text-blue-400"
                            gradient="from-blue-500 to-cyan-500"
                        />
                        <InsightCard 
                            label="Premium Niche" 
                            value={topQualGenre.genre_name || '-'} 
                            subtext={`Avg Rating: ${topQualGenre.avg_rating}`}
                            icon="diamond" 
                            color="text-emerald-400"
                            gradient="from-emerald-500 to-green-500"
                        />
                    </div>
                </div>

                {/* --- MAIN CHART: GROWTH (MOVIES vs TV) --- */}
                <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 material-symbols-outlined text-lg">stacked_line_chart</span>
                                Content Production Velocity
                            </h3>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 10 Years</span>
                        </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        {/* ID growthChart dihapus karena logic tooltip sudah general */}
                        <Line data={growthData} options={commonOptions} />
                    </div>

                    {/* Background Ambient Glow */}
                    <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[150%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
                </div>

                {/* --- GRID: GENRES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Popularity Card */}
                    <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl hover:border-white/10 transition-all">
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-blue-400 material-symbols-outlined">trending_up</span>
                                    Most Popular Genres
                                </h3>
                                <p className="text-xs text-gray-500 ml-8 mt-1">Based on total audience votes</p>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <Bar 
                                id="popChart"
                                data={popularGenreData} 
                                options={{
                                    ...commonOptions,
                                    indexAxis: 'y',
                                    scales: {
                                        x: { display: false },
                                        y: { grid: { display: false }, ticks: { color: '#a3a3a3', font: { weight: '600' } } }
                                    }
                                }} 
                            />
                        </div>
                    </div>

                    {/* Quality Card */}
                    <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl hover:border-white/10 transition-all">
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-emerald-400 material-symbols-outlined">verified</span>
                                    Critical Acclaim
                                </h3>
                                <p className="text-xs text-gray-500 ml-8 mt-1">Genres with highest average ratings</p>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <Bar 
                                id="qualChart"
                                data={qualityGenreData} 
                                options={{
                                    ...commonOptions,
                                    indexAxis: 'y',
                                    scales: {
                                        x: { display: false, min: 0, max: 10 }, 
                                        y: { grid: { display: false }, ticks: { color: '#a3a3a3', font: { weight: '600' } } }
                                    }
                                }} 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}