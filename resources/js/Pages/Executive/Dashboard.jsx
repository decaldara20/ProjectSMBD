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
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Komponen Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// --- KOMPONEN KARTU KPI (STATISTIK) ---
const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-lg hover:border-white/10 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                {trend && (
                    <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <span className="material-symbols-outlined text-sm">{trend > 0 ? 'trending_up' : 'trending_down'}</span>
                        {Math.abs(trend)}% from last month
                    </p>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
        {/* Background Glow */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-[50px] opacity-10 ${color.replace('text-', 'bg-')}`}></div>
    </div>
);

export default function Dashboard({ stats, charts, topMovies }) {
    
    // 1. Config Chart: Genre Distribution (Doughnut)
    const genreChartData = {
        labels: charts.genres.labels,
        datasets: [{
            data: charts.genres.data,
            backgroundColor: [
                'rgba(6, 182, 212, 0.8)',   // Cyan
                'rgba(168, 85, 247, 0.8)',  // Purple
                'rgba(236, 72, 153, 0.8)',  // Pink
                'rgba(59, 130, 246, 0.8)',  // Blue
                'rgba(16, 185, 129, 0.8)',  // Green
            ],
            borderColor: '#181818',
            borderWidth: 4,
            hoverOffset: 10
        }],
    };

    // 2. Config Chart: Monthly Views (Line/Area)
    const viewsChartData = {
        labels: charts.views.labels,
        datasets: [{
            label: 'Total Views',
            data: charts.views.data,
            borderColor: '#06b6d4',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                return gradient;
            },
            fill: true,
            tension: 0.4, // Garis melengkung halus
            pointBackgroundColor: '#121212',
            pointBorderColor: '#06b6d4',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'bottom', 
                labels: { color: '#9ca3af', font: { size: 11 }, usePointStyle: true, padding: 20 } 
            }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(255,255,255,0.05)' }, 
                ticks: { color: '#6b7280', font: { size: 10 } },
                border: { display: false }
            },
            x: { 
                grid: { display: false }, 
                ticks: { color: '#6b7280', font: { size: 10 } },
                border: { display: false }
            }
        }
    };

    return (
        <DashboardLayout>
            <Head title="Executive Overview" />

            <div className="space-y-8 pb-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Executive <span className="text-cyan-500">Overview</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Real-time performance metrics & platform analytics.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider bg-[#181818] px-3 py-1.5 rounded-lg border border-white/5">
                            Last Updated: {new Date().toLocaleDateString()}
                        </span>
                        <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">download</span> Report
                        </button>
                    </div>
                </div>

                {/* --- 1. KPI CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Movies" 
                        value={stats.total_movies?.toLocaleString() || 0} 
                        icon="movie" 
                        color="text-cyan-400" 
                        trend={12.5}
                    />
                    <StatCard 
                        title="Total TV Shows" 
                        value={stats.total_tv?.toLocaleString() || 0} 
                        icon="live_tv" 
                        color="text-purple-400" 
                        trend={8.2}
                    />
                    <StatCard 
                        title="Active Users" 
                        value={stats.total_users?.toLocaleString() || 0} 
                        icon="group" 
                        color="text-pink-400" 
                        trend={-2.4}
                    />
                    <StatCard 
                        title="Avg Global Rating" 
                        value={stats.avg_rating || 0} 
                        icon="star" 
                        color="text-yellow-400" 
                        trend={0.8}
                    />
                </div>

                {/* --- 2. CHARTS AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Line Chart (Platform Activity) */}
                    <div className="lg:col-span-2 bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-cyan-500 rounded-full"></span> Platform Growth
                            </h3>
                            <select className="bg-[#121212] border border-white/10 text-gray-400 text-xs rounded-lg px-2 py-1 outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-[300px]">
                            <Line data={viewsChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Doughnut Chart (Genre Distribution) */}
                    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-purple-500 rounded-full"></span> Content by Genre
                        </h3>
                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="w-[220px] h-[220px]">
                                <Doughnut 
                                    data={genreChartData} 
                                    options={{ 
                                        cutout: '75%',
                                        plugins: { legend: { position: 'bottom', labels: { color: '#999', boxWidth: 10, padding: 15 } } }
                                    }} 
                                />
                            </div>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <span className="text-3xl font-black text-white">
                                    {charts.genres.data.reduce((a, b) => a + b, 0)}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Total Titles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. TOP RATED TABLE --- */}
                <div className="bg-[#181818] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-5 bg-green-500 rounded-full"></span> Top Rated Content
                        </h3>
                        <Link href="/films" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Release Year</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4 text-right">Votes</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {topMovies.map((movie, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white group-hover:text-cyan-400 transition-colors">
                                            {movie.primaryTitle}
                                        </td>
                                        <td className="px-6 py-4">{movie.startYear}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md font-bold text-xs border border-yellow-500/20">
                                                <i className="fas fa-star text-[10px]"></i> {movie.averageRating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-300">
                                            {movie.numVotes.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}