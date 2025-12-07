import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Trends({ reports }) {

    // --- CHART CONFIGURATIONS ---

    // 1. CHART: Laporan 4A (Pertumbuhan Rilis)
    const growthData = {
        labels: reports.growth.map(d => d.startYear),
        datasets: [
            {
                label: 'Total Movies',
                data: reports.growth.map(d => d.total_movies),
                borderColor: '#06b6d4', // Cyan
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Total TV Shows',
                data: reports.growth.map(d => d.total_tv),
                borderColor: '#a855f7', // Purple
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 2. CHART: Laporan 2A (Genre Populer)
    const popularGenreData = {
        labels: reports.popular_genres.map(g => g.genre_name),
        datasets: [{
            label: 'Total Votes',
            data: reports.popular_genres.map(g => g.total_votes),
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            barThickness: 25
        }]
    };

    // 3. CHART: Laporan 2B (Genre Kualitas)
    const qualityGenreData = {
        labels: reports.quality_genres.map(g => g.genre_name),
        datasets: [{
            label: 'Avg Rating',
            data: reports.quality_genres.map(g => g.avg_rating),
            backgroundColor: '#10b981', // Emerald Green
            borderRadius: 6,
            barThickness: 25
        }]
    };

    // Common Options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#999' } } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#666' } },
            y: { grid: { color: '#222' }, ticks: { color: '#666' } }
        }
    };

    return (
        <DashboardLayout>
            <Head title="Market Trends Analysis" />

            <div className="space-y-8 pb-12">
                
                {/* HEADER */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Market <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Trends</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Deep dive into genre performance and content growth.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold uppercase">Laporan 2A</span>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold uppercase">Laporan 2B</span>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold uppercase">Laporan 4A</span>
                    </div>
                </div>

                {/* --- SECTION 1: CONTENT GROWTH (Laporan 4A) --- */}
                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Content Release Growth
                            </h3>
                            <p className="text-xs text-gray-500">Total Movies vs TV Shows released (Last 10 Years)</p>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <Line data={growthData} options={chartOptions} />
                    </div>
                </div>

                {/* --- SECTION 2: GENRE ANALYSIS (Grid Layout) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Laporan 2A: Popularitas */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Most Popular Genres
                            </h3>
                            <p className="text-xs text-gray-500">Based on Total User Votes (Engagement)</p>
                        </div>
                        <div className="h-[300px]">
                            <Bar 
                                data={popularGenreData} 
                                options={{
                                    ...chartOptions,
                                    indexAxis: 'y', // Horizontal Bar
                                }} 
                            />
                        </div>
                    </div>

                    {/* Laporan 2B: Kualitas */}
                    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                Highest Rated Genres
                            </h3>
                            <p className="text-xs text-gray-500">Based on Average IMDb Rating (Min. 500 Titles)</p>
                        </div>
                        <div className="h-[300px]">
                            <Bar 
                                data={qualityGenreData} 
                                options={{
                                    ...chartOptions,
                                    indexAxis: 'y',
                                    scales: { x: { min: 5, max: 10, grid: { display: false } } } // Fokus skala rating 5-10
                                }} 
                            />
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}