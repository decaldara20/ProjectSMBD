import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// KPI Small Component
const PlatformKPI = ({ title, value, icon, color }) => (
    <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center justify-between relative overflow-hidden">
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 text-white`}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        {/* Glow */}
        <div className={`absolute -left-4 -bottom-4 w-20 h-20 ${color} opacity-20 blur-2xl`}></div>
    </div>
);

export default function Platforms({ kpi, data }) {

    // 1. Chart Data: Market Share (Quantity)
    const shareData = {
        labels: data.map(d => d.network_name),
        datasets: [{
            data: data.map(d => d.total_titles),
            backgroundColor: [
                '#3b82f6', '#06b6d4', '#8b5cf6', '#6366f1', '#14b8a6', 
                '#f43f5e', '#f59e0b', '#10b981', '#64748b', '#475569'
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    // 2. Chart Data: Quality Comparison (Avg Rating)
    const qualityData = {
        labels: data.map(d => d.network_name),
        datasets: [{
            label: 'Avg Rating',
            data: data.map(d => d.avg_rating),
            backgroundColor: '#06b6d4',
            borderRadius: 4,
            barThickness: 20
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Platform Intelligence" />

            <div className="space-y-8 pb-12">
                
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Platform <span className="text-blue-500">Intelligence</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Market share, quality analysis, and content volume.</p>
                    </div>
                </div>

                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PlatformKPI title="Dominant Network" value={kpi.dominant_network} icon="trophy" color="bg-blue-600" />
                    <PlatformKPI title="Highest Quality" value={kpi.highest_quality} icon="stars" color="bg-cyan-500" />
                    <PlatformKPI title="Total Networks" value={kpi.total_networks.toLocaleString()} icon="hub" color="bg-indigo-500" />
                </div>

                {/* Charts Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Market Share (Doughnut) */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white mb-6 w-full text-left flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-500 rounded-full"></span> Quantity: Market Share
                        </h3>
                        <div className="w-[280px] h-[280px] relative">
                            <Doughnut 
                                data={shareData} 
                                options={{ 
                                    cutout: '70%', 
                                    plugins: { legend: { display: false } } 
                                }} 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">{data.length}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Major Players</span>
                            </div>
                        </div>
                    </div>

                    {/* Quality Comparison (Bar) */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-cyan-500 rounded-full"></span> Quality: Avg Rating
                        </h3>
                        <div className="h-[280px]">
                            <Bar 
                                data={qualityData} 
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: { x: { min: 6, max: 9, grid: { color: '#222' } }, y: { grid: { display: false } } },
                                    plugins: { legend: { display: false } }
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181818]">
                        <h3 className="text-lg font-bold text-white">Network Performance Detail</h3>
                        <button className="text-xs font-bold text-blue-500 hover:text-blue-400">DOWNLOAD CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Network Name</th>
                                    <th className="px-6 py-4 text-center">Total Shows</th>
                                    <th className="px-6 py-4 text-center">Total Seasons</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4">Top Flagship Show</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((net, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {net.network_name}
                                        </td>
                                        <td className="px-6 py-4 text-center">{net.total_titles}</td>
                                        <td className="px-6 py-4 text-center">{net.total_seasons || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded font-bold text-xs ${net.avg_rating >= 8.0 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {net.avg_rating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{net.top_title}</span>
                                                <span className="text-[10px] text-gray-500">Rating: {net.top_rating}</span>
                                            </div>
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