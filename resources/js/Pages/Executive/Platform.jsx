import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Platforms({ platforms }) {
    
    const chartData = {
        labels: platforms.map(p => p.name),
        datasets: [{
            data: platforms.map(p => p.count),
            backgroundColor: platforms.map(p => p.color),
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    return (
        <DashboardLayout>
            <Head title="Platform Intelligence" />
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Platform <span className="text-blue-500">Intelligence</span></h1>
                    <p className="text-gray-400">Market share and performance by network.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="bg-[#181818] p-8 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white mb-8 w-full text-left">Market Share</h3>
                        <div className="w-64 h-64 relative">
                             <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-white">5</span>
                                <span className="text-xs uppercase text-gray-500 tracking-widest">Major Giants</span>
                             </div>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 bg-[#181818] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-lg font-bold text-white">Network Performance</h3>
                        </div>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Network</th>
                                    <th className="px-6 py-4 text-right">Total Shows</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {platforms.map((p, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                                            {p.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">{p.count}</td>
                                        <td className="px-6 py-4 text-right text-yellow-500 font-bold">{(7.5 + Math.random()).toFixed(1)}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${Math.random() * 40 + 40}%`, backgroundColor: p.color }}></div>
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