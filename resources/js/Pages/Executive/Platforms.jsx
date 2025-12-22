import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// --- COMPONENT: STAT CARD ---
const PlatformStatCard = ({ label, value, icon, textColor, glowColor }) => (
    <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 shadow-xl">
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-40 ${glowColor}`}></div>
        
        <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/5 ${textColor} shadow-inner`}>
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div>
                <h4 className="text-2xl font-black text-white tracking-tighter truncate max-w-[180px]" title={value}>
                    {value}
                </h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mt-1">{label}</p>
            </div>
        </div>
    </div>
);

export default function Platforms({ kpi, data }) {

    // 1. Chart Data: Market Share (Volume)
    // Menggunakan data asli (urut berdasarkan Total Titles terbanyak)
    const shareData = {
        labels: data.map(d => d.network_name),
        datasets: [{
            data: data.map(d => d.total_titles),
            backgroundColor: [
                '#3b82f6', '#06b6d4', '#8b5cf6', '#6366f1', '#14b8a6', 
                '#f43f5e', '#f59e0b', '#10b981', '#64748b', '#475569'
            ],
            borderColor: '#121212',
            borderWidth: 4,
            hoverOffset: 20
        }]
    };

    // 2. Chart Data: Quality Comparison (Avg Rating)
    // PENTING: Kita buat array baru yang di-sort khusus berdasarkan Rating (Tinggi ke Rendah)
    // agar Bar Chart terlihat rapi (seperti tangga turun).
    const sortedByQuality = [...data].sort((a, b) => b.avg_rating - a.avg_rating);

    const qualityData = {
        labels: sortedByQuality.map(d => d.network_name), // Label ikut urutan rating
        datasets: [{
            label: 'Avg Rating',
            data: sortedByQuality.map(d => d.avg_rating), // Data ikut urutan rating
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 300, 0);
                gradient.addColorStop(0, '#0891b2'); // Cyan-600
                gradient.addColorStop(1, '#22d3ee'); // Cyan-400
                return gradient;
            },
            borderRadius: 6,
            barThickness: 24
        }]
    };

    // Common Chart Options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 15, 15, 0.95)',
                titleColor: '#fff',
                bodyColor: '#a3a3a3',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: { 
            x: { 
                min: 0, 
                max: 7, 
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#666', font: {family: 'Inter'} }
            }, 
            y: { 
                grid: { display: false },
                ticks: { color: '#fff', font: { weight: 'bold', family: 'Inter' } }
            } 
        }
    };

    return (
        <DashboardLayout>
            <Head title="Platform Intelligence" />

            <div className="space-y-10 pb-16">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Competitor Analysis</h2>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Platform <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">Intel</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 max-w-xl">
                            Deep dive into streaming wars: Market share volume, content quality benchmarks, and catalog depth.
                        </p>
                    </div>
                    <button className="group bg-[#1A1A1A] hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-xl hover:shadow-blue-500/20 flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg group-hover:animate-bounce">download</span> 
                        DOWNLOAD REPORT
                    </button>
                </div>

                {/* --- 1. KPI SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PlatformStatCard 
                        label="Dominant Network" 
                        value={kpi.dominant_network} 
                        icon="trophy" 
                        textColor="text-blue-500" 
                        glowColor="bg-blue-500"
                    />
                    <PlatformStatCard 
                        label="Highest Quality" 
                        value={kpi.highest_quality} 
                        icon="verified" 
                        textColor="text-cyan-400" 
                        glowColor="bg-cyan-400"
                    />
                    <PlatformStatCard 
                        label="Active Networks" 
                        value={kpi.total_networks.toLocaleString()} 
                        icon="hub" 
                        textColor="text-indigo-500" 
                        glowColor="bg-indigo-500"
                    />
                </div>

                {/* --- 2. CHART SPLIT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Market Share (Doughnut) */}
                    <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white w-full mb-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-600 rounded-full"></span> 
                            Market Share
                        </h3>
                        <div className="w-240px h-240px relative z-10">
                            <Doughnut 
                                data={shareData} 
                                options={{ 
                                    cutout: '80%', 
                                    plugins: { legend: { display: false } } 
                                }} 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">{data.length}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Networks</span>
                            </div>
                        </div>
                        {/* Simple Legend */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {data.slice(0, 4).map((d, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-[10px] text-gray-400">
                                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: shareData.datasets[0].backgroundColor[i]}}></span>
                                    {d.network_name}
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 right-0 w-full h-full bg-linear-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Quality Comparison (Bar) */}
                    <div className="lg:col-span-2 bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-cyan-400 rounded-full"></span> 
                                Quality Benchmark (Avg Rating)
                            </h3>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <Bar 
                                data={qualityData} 
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 3. DETAILED TABLE --- */}
                <div className="bg-[#121212] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 bg-[#161616]">
                        <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-500">table_chart</span>
                            Network Performance Matrix
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1a1a1a] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-12 text-center">#</th>
                                    <th className="px-6 py-4">Network Name</th>
                                    <th className="px-6 py-4 text-center">Total Shows</th>
                                    <th className="px-6 py-4 text-center">Total Seasons</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4 text-center">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {data.map((net, idx) => {
                                    const visualPercentage = Math.min(100, (net.avg_rating / 7) * 100);
                                
                                    return (
                                        <tr key={idx} className="hover:bg-white/0.02 transition-colors group">
                                            <td className="px-6 py-4 text-center font-mono text-gray-600">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                                                    {net.network_name}
                                                </div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                                                    {net.tier || (net.avg_rating >= 6 ? 'Top Tier' : 'Standard')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono text-gray-400">
                                                {net.total_titles.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-500">
                                                {net.total_seasons || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-xs ${
                                                    // Sesuaikan warna threshold dengan realita data (6.0 itu udah bagus banget disini)
                                                    net.avg_rating >= 6.0 
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                    : net.avg_rating >= 4.0
                                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                                }`}>
                                                    {Number(net.avg_rating).toFixed(1)} <span className="material-symbols-outlined text-[10px]">star</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center align-middle">
                                                <div className="w-24 h-1.5 bg-gray-800 rounded-full mx-auto overflow-hidden relative">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            net.avg_rating >= 6 ? 'bg-emerald-500' : 'bg-blue-500'
                                                        }`}
                                                        style={{ width: `${visualPercentage}%` }}
                                                    ></div>
                                                </div>
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