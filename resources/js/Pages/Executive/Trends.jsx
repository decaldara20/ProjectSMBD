import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend);

export default function Trends({ yearlyTrend, genrePerformance }) {

    // 1. Line Chart Data (Pertumbuhan Industri)
    const lineData = {
        labels: yearlyTrend.map(d => d.startYear),
        datasets: [{
            label: 'Titles Released',
            data: yearlyTrend.map(d => d.total),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // 2. Bar Chart Data (Genre Performance)
    const barData = {
        labels: genrePerformance.map(g => g.name),
        datasets: [
            {
                label: 'Production Volume',
                data: genrePerformance.map(g => g.count),
                backgroundColor: 'rgba(6, 182, 212, 0.7)',
                yAxisID: 'y',
            },
            {
                label: 'Avg Rating',
                data: genrePerformance.map(g => g.rating),
                backgroundColor: 'rgba(234, 179, 8, 0.7)',
                type: 'line',
                borderColor: '#eab308',
                yAxisID: 'y1',
            }
        ]
    };

    return (
        <DashboardLayout>
            <Head title="Market Trends" />
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Market <span className="text-purple-500">Trends</span></h1>
                    <p className="text-gray-400">Analyze industry growth and genre performance.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Growth Chart */}
                    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">Industry Growth (Yearly)</h3>
                        <div className="h-72">
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { grid: { color: '#333' } } } }} />
                        </div>
                    </div>

                    {/* Genre Performance Chart */}
                    <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">Genre: Volume vs Quality</h3>
                        <div className="h-72">
                            <Bar 
                                data={barData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { type: 'linear', display: true, position: 'left', grid: { display: false } },
                                        y1: { type: 'linear', display: true, position: 'right', grid: { display: false } },
                                        x: { grid: { display: false } }
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