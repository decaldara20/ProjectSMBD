<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExecutiveController extends Controller
{
    // 1. DASHBOARD UTAMA (Overview)
    public function dashboard(Request $request)
    {
        // SETUP FILTER WAKTU
        $range = $request->input('range', 'all'); 
        
        $startDate = match($range) {
            '30d' => now()->subDays(30),
            '1y'  => now()->subYear(),
            default => null, // All Time
        };

        // --- A. HITUNG PERTUMBUHAN (REAL Y-o-Y GROWTH) ---
        // Kita ambil 2 tahun terakhir dari view pertumbuhan untuk dibandingkan
        $growthStats = DB::connection('sqlsrv')
            ->table('v_Executive_Yearly_Growth')
            ->orderByDesc('startYear')
            ->limit(2)
            ->get();

        $currentYearCount = $growthStats->first()->total_released ?? 0;
        $lastYearCount    = $growthStats->last()->total_released ?? 1; // Hindari bagi 0
        
        // Rumus Growth: ((Sekarang - Lalu) / Lalu) * 100
        $growthPct = (($currentYearCount - $lastYearCount) / $lastYearCount) * 100;
        $growthLabel = ($growthPct >= 0 ? '+' : '') . number_format($growthPct, 1) . '% YoY';

        // --- B. KPI DASHBOARD ---
        $kpi = [
            'total_titles' => number_format(DB::connection('sqlsrv')->table('title_basics')->count(), 0, ',', '.'),
            'growth_txt'   => $growthLabel,
            'avg_rating'   => number_format(DB::connection('sqlsrv')->table('title_ratings')->avg('averageRating'), 1),
            'total_pros'   => number_format(DB::connection('sqlsrv')->table('name_basics')->count(), 0, ',', '.'),
            'total_tv'     => number_format(DB::connection('sqlsrv')->table('shows')->count(), 0, ',', '.'),
        ];

        // --- C. CHART: PLATFORM ANALYTICS ---
        $platformData = DB::connection('sqlsrv')
            ->table('v_Executive_Platform_Share')
            ->orderByDesc('total_shows')
            ->limit(5)
            ->get();

        // --- D. CHART: YEARLY GROWTH ---
        $growthQuery = DB::connection('sqlsrv')
            ->table('v_Executive_Yearly_Growth')
            ->where('startYear', '>=', 2010); 
        
        if ($range === '1y') {
        $growthQuery->where('startYear', '>=', date('Y'));
        }

        $growthData = $growthQuery->orderBy('startYear')->get();

        // --- E. TOP TALENT ---
        $topTalent = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base')
            ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
            ->orderByDesc('TotalNumVotes') 
            ->limit(4) 
            ->get();

        // --- F. BUSINESS INTELLIGENCE: FAILED SEARCHES ---
        $failedQuery = DB::table('search_logs')
            ->select('keyword as term', DB::raw('count(*) as count'))
            ->where('results_count', 0); 

        if ($startDate) {
            $failedQuery->where('created_at', '>=', $startDate);
        }

        $failedSearches = $failedQuery
            ->groupBy('keyword')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function($item) {
                // Label Dinamis berdasarkan jumlah pencarian
                if ($item->count > 50) $item->trend = 'Critical Demand';
                elseif ($item->count > 10) $item->trend = 'High Interest';
                else $item->trend = 'New Signal';
                return $item;
            });

        return Inertia::render('Executive/Dashboard', [
            'kpi' => $kpi,
            'charts' => [
                'platforms' => $platformData,
                'growth' => $growthData,
            ],
            'topTalent' => $topTalent,
            'bi' => [
                'failed_searches' => $failedSearches 
            ],
            'filters' => [
                'range' => $range
            ]
        ]);
    }

    // 2. MARKET TRENDS
    public function trends()
    {
        // --- LAPORAN 4A: Pertumbuhan Rilis Konten (10 Tahun Terakhir) ---
        $yearlyTrend = DB::connection('sqlsrv')
        ->table('title_basics')
        ->select('startYear')
        // Hitung Total Semua (Untuk Single Line Chart)
        ->selectRaw("COUNT(*) as total_released")
        // Hitung Split per Tipe (Untuk cadangan/analisis lebih dalam)
        ->selectRaw("COUNT(CASE WHEN titleType = 'movie' THEN 1 END) as total_movies")
        ->selectRaw("COUNT(CASE WHEN titleType = 'tvSeries' THEN 1 END) as total_tv")
        ->where('startYear', '>=', date('Y') - 10)
        ->where('startYear', '<=', date('Y'))
        ->groupBy('startYear')
        ->orderBy('startYear')
        ->get();

        // --- LAPORAN 2A: Genre Paling Populer (By Total Votes) ---
        $topGenresByVotes = DB::connection('sqlsrv')
            ->table('v_Executive_Genre_Stats')
            ->orderByDesc('total_votes')
            ->limit(10)
            ->get();

        // --- LAPORAN 2B: Genre Kualitas Terbaik (By Avg Rating) ---
        // Filter: Hanya genre yang punya minimal 500 judul agar data valid (tidak bias)
        $topGenresByRating = DB::connection('sqlsrv')
            ->table('v_Executive_Genre_Stats')
            ->where('total_titles', '>', 50) 
            ->orderByDesc('avg_rating')
            ->limit(10)
            ->get();

        return Inertia::render('Executive/Trends', [
            'reports' => [
                'growth' => $yearlyTrend,
                'popular_genres' => $topGenresByVotes,
                'quality_genres' => $topGenresByRating
            ]
        ]);
    }

    // 3. TALENT ANALYTICS (Bankabilitas Artis)
    public function talents()
    {
        // 1. KPI Cards (FIX: Ambil dari tabel normalisasi 'name_professions')
        $kpi = [
            'total_actors'    => DB::connection('sqlsrv')
                                    ->table('name_professions')
                                    ->where(function($query) {
                                        $query->where('profession_name', 'LIKE', '%actor%')
                                            ->orWhere('profession_name', 'LIKE', '%actress%');
                                    })
                                    ->count(),
                                    
            'total_directors' => DB::connection('sqlsrv')
                                    ->table('name_professions')
                                    ->where('profession_name', 'LIKE', '%director%')
                                    ->count(),
                                    
            'total_writers'   => DB::connection('sqlsrv')
                                    ->table('name_professions')
                                    ->where('profession_name', 'LIKE', '%writer%')
                                    ->count(),
        ];

        // 2. Chart: Distribusi Profesi
        $distribution = DB::connection('sqlsrv')
            ->table('v_Executive_Talent_Distribution')
            ->get();

        // 3. Highlight: Rising Stars
        $risingStars = DB::connection('sqlsrv')
            ->table('v_Executive_Rising_Stars')
            ->get();

        // 4. MAIN REPORT (Laporan 3A - Bankable)
        $bankableList = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base')
            ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
            ->orderByDesc('TotalNumVotes')
            ->paginate(10); 

        return Inertia::render('Executive/Talents', [
            'kpi' => $kpi,
            'charts' => [
                'distribution' => $distribution
            ],
            'risingStars' => $risingStars,
            'bankable' => $bankableList
        ]);
    }

    // 4. PLATFORM INTELLIGENCE (TV Networks)
    public function platforms()
    {
        // Ambil Semua Data dari View Baru
        $allData = DB::connection('sqlsrv')
            ->table('v_Executive_Network_Analytics')
            ->where('total_titles', '>', 5) // Filter network kecil biar grafik gak penuh
            ->orderByDesc('total_titles')
            ->limit(10) // Ambil Top 10 Raksasa
            ->get();

        // 1. KPI Cards
        $kpi = [
            'dominant_network' => $allData->first()->network_name, // Yang paling banyak judulnya
            'highest_quality'  => $allData->sortByDesc('avg_rating')->first()->network_name,
            'total_networks'   => DB::connection('sqlsrv')->table('networks')->count(),
        ];

        return Inertia::render('Executive/Platforms', [
            'kpi' => $kpi,
            'data' => $allData
        ]);
    }
}