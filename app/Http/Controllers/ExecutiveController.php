<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExecutiveController extends Controller
{
    // 1. DASHBOARD UTAMA (Overview)
    public function dashboard()
    {
        // Statistik Global
        $totalMovies = DB::connection('sqlsrv')->table('v_DetailJudulIMDB')->count();
        $totalTV = DB::connection('sqlsrv')->table('v_DetailJudulTvShow')->count();
        $avgRating = DB::connection('sqlsrv')->table('v_DetailJudulIMDB')->avg('averageRating');

        // Chart Data (Genre Sample)
        $genreStats = DB::connection('sqlsrv')->table('genre_types')->limit(5)->get();
        $genreCounts = [450, 300, 200, 150, 100]; // Mock data

        // Top Rated
        $topMovies = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->where('titleType', 'movie')
            ->orderByDesc('averageRating')
            ->limit(5)
            ->get(['primaryTitle', 'startYear', 'averageRating', 'numVotes']);

        return Inertia::render('Executive/Dashboard', [
            'stats' => [
                'total_movies' => $totalMovies,
                'total_tv' => $totalTV,
                'total_users' => 1250,
                'avg_rating' => number_format($avgRating, 1)
            ],
            'charts' => [
                'genres' => ['labels' => $genreStats->pluck('genre_name'), 'data' => $genreCounts],
                'views' => ['labels' => ['Jan','Feb','Mar','Apr','May','Jun'], 'data' => [1200,1900,3000,5000,2300,3400]]
            ],
            'topMovies' => $topMovies
        ]);
    }

    // 2. MARKET TRENDS (Analisa Genre & Waktu)
    public function trends()
    {
        // A. Tren Tahun (Jumlah Rilis Film 10 Tahun Terakhir)
        // Gunakan query agregasi count group by year
        $yearlyTrend = DB::connection('sqlsrv')
            ->table('title_basics')
            ->select('startYear', DB::raw('count(*) as total'))
            ->where('startYear', '>=', 2010)
            ->where('startYear', '<=', 2025)
            ->groupBy('startYear')
            ->orderBy('startYear')
            ->get();

        // B. Analisa Genre (Mockup Data Kompleks)
        // Kita bandingkan Jumlah Film vs Rata-rata Rating per Genre
        $genrePerformance = [
            ['name' => 'Action', 'count' => 1200, 'rating' => 6.8],
            ['name' => 'Drama', 'count' => 3500, 'rating' => 7.2],
            ['name' => 'Comedy', 'count' => 2800, 'rating' => 6.5],
            ['name' => 'Horror', 'count' => 1500, 'rating' => 5.9],
            ['name' => 'Sci-Fi', 'count' => 800, 'rating' => 7.0],
            ['name' => 'Thriller', 'count' => 1100, 'rating' => 6.9],
        ];

        return Inertia::render('Executive/Trends', [
            'yearlyTrend' => $yearlyTrend,
            'genrePerformance' => $genrePerformance
        ]);
    }

    // 3. TALENT ANALYTICS (Bankabilitas Artis)
    public function talents()
    {
        // Ambil Top 50 Artis Paling Populer (Vote Terbanyak)
        $talents = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base')
            ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
            ->orderByDesc('TotalNumVotes')
            ->limit(50)
            ->paginate(10); // Pakai pagination biar tabelnya rapi

        return Inertia::render('Executive/Talents', [
            'talents' => $talents
        ]);
    }

    // 4. PLATFORM INTELLIGENCE (TV Networks)
    public function platforms()
    {
        // Ambil Network dengan jumlah show terbanyak
        // Asumsi ada tabel 'networks' dan 'shows'
        // Jika belum ada, kita pakai Dummy Data dulu biar UI jadi
        $platformShare = [
            ['name' => 'Netflix', 'count' => 150, 'color' => '#E50914'],
            ['name' => 'HBO', 'count' => 80, 'color' => '#FFF'],
            ['name' => 'Amazon Prime', 'count' => 120, 'color' => '#00A8E1'],
            ['name' => 'Disney+', 'count' => 90, 'color' => '#113CCF'],
            ['name' => 'Hulu', 'count' => 60, 'color' => '#1CE783'],
        ];

        return Inertia::render('Executive/Platforms', [
            'platforms' => $platformShare
        ]);
    }
}