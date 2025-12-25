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
        $companyId = $request->input('company_id'); // Cek apakah ada filter company

        if ($companyId) {
            // 1. KPI: Statistik Studio
            $stats = DB::connection('sqlsrv')
                ->table('shows as s')
                ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                ->leftJoin('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                ->where('pc.production_company_type_id', $companyId)
                ->select(
                    DB::raw('COUNT(DISTINCT s.show_id) as total_titles'),
                    DB::raw('AVG(sv.vote_average) as avg_rating'),
                    DB::raw('SUM(sv.vote_count) as total_votes'),
                    DB::raw('SUM(s.number_of_seasons) as total_seasons')
                )
                ->first();

            $kpi = [
                'total_titles' => number_format($stats->total_titles, 0, ',', '.'),
                'growth_txt'   => 'Studio Total', 
                'avg_rating'   => number_format($stats->avg_rating, 1),
                'total_pros'   => number_format($stats->total_votes, 0, ',', '.'), // Total Engagement
                'total_tv'     => number_format($stats->total_seasons, 0, ',', '.'), // Total Seasons
            ];

            // 2. CHART: Growth (Produksi per Tahun)
            // Menggunakan tabel 'shows' (14) join 'air_dates' (16)
            $growthData = DB::connection('sqlsrv')
                ->table('shows as s')
                ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                ->join('air_dates as ad', 's.show_id', '=', 'ad.show_id')
                ->where('pc.production_company_type_id', $companyId)
                ->where('ad.is_first', 1) // Ambil tanggal tayang perdana
                ->whereYear('ad.date', '>=', 1970) // Filter tahun wajar
                ->select(DB::raw('YEAR(ad.date) as startYear'), DB::raw('COUNT(DISTINCT s.show_id) as total_released'))
                ->groupBy(DB::raw('YEAR(ad.date)'))
                ->orderBy('startYear')
                ->get();

            // 3. CHART: Top Genres
            $platformData = DB::connection('sqlsrv')
                ->table('shows as s')
                ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                ->join('genres as g', 's.show_id', '=', 'g.show_id') // Tabel 29 (Penghubung)
                ->join('genre_types as gt', 'g.genre_type_id', '=', 'gt.genre_type_id') // Tabel 18 (Nama Genre)
                ->where('pc.production_company_type_id', $companyId)
                ->select('gt.genre_name as network_name', DB::raw('COUNT(DISTINCT s.show_id) as total_shows'))
                ->groupBy('gt.genre_name')
                ->orderByDesc('total_shows')
                ->limit(5)
                ->get();

            // 4. LIST: Top Performing Assets
            $topTalent = DB::connection('sqlsrv')
                ->table('shows as s')
                ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                ->leftJoin('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                ->where('pc.production_company_type_id', $companyId)
                ->where('sv.vote_count', '>', 50) // Filter anti bias (minimal 50 votes)
                ->select(
                    's.name as primaryName', 
                    DB::raw("CONCAT(s.number_of_seasons, ' Seasons • ', s.number_of_episodes, ' Eps') as primaryProfession"),
                    'sv.vote_average as AverageRating'
                )
                ->orderByDesc('sv.vote_average')
                ->limit(5)
                ->get();

            // BI & Filters
            $failedSearches = []; 
            $range = 'all';

        } else {
            // ==========================================
            // LOGIKA MODE GLOBAL (KODE LAMA KAMU)
            // ==========================================
            $range = $request->input('range', 'all'); 
            $startDate = match($range) {
                '30d' => now()->subDays(30),
                '1y'  => now()->subYear(),
                default => null,
            };

            // Hitung Growth Global
            $growthStats = DB::connection('sqlsrv')->table('v_Executive_Yearly_Growth')->orderByDesc('startYear')->limit(2)->get();
            $currentYearCount = $growthStats->first()->total_released ?? 0;
            $lastYearCount    = $growthStats->last()->total_released ?? 1;
            $growthPct = (($currentYearCount - $lastYearCount) / $lastYearCount) * 100;
            $growthLabel = ($growthPct >= 0 ? '+' : '') . number_format($growthPct, 1) . '% YoY';

            // KPI Global
            $kpi = [
                'total_titles' => number_format(DB::connection('sqlsrv')->table('title_basics')->count(), 0, ',', '.'),
                'growth_txt'   => $growthLabel,
                'avg_rating'   => number_format(DB::connection('sqlsrv')->table('title_ratings')->avg('averageRating'), 1),
                'total_pros'   => number_format(DB::connection('sqlsrv')->table('name_basics')->count(), 0, ',', '.'),
                'total_tv'     => number_format(DB::connection('sqlsrv')->table('shows')->count(), 0, ',', '.'),
            ];

            // Chart Platform Global
            $platformData = DB::connection('sqlsrv')->table('v_Executive_Platform_Share')->orderByDesc('total_shows')->limit(5)->get();

            // Chart Growth Global
            $growthQuery = DB::connection('sqlsrv')->table('v_Executive_Yearly_Growth')->where('startYear', '>=', 2010); 
            if ($range === '1y') { $growthQuery->where('startYear', '>=', date('Y')); }
            $growthData = $growthQuery->orderBy('startYear')->get();

            // Top Talent Global
            $topTalent = DB::connection('sqlsrv')->table('v_Executive_BankabilityReport_Base')
                ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
                ->orderByDesc('TotalNumVotes')->limit(4)->get();

            // BI Failed Searches
            $failedQuery = DB::table('search_logs')->select('keyword as term', DB::raw('count(*) as count'))->where('results_count', 0); 
            if ($startDate) { $failedQuery->where('created_at', '>=', $startDate); }
            $failedSearches = $failedQuery->groupBy('keyword')->orderByDesc('count')->limit(5)->get()
                ->map(function($item) {
                    if ($item->count > 50) $item->trend = 'Critical Demand';
                    elseif ($item->count > 10) $item->trend = 'High Interest';
                    else $item->trend = 'New Signal';
                    return $item;
                });
        }

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
            ],
            // Kirim Flag ke Frontend biar UI tau ini lagi mode apa
            'isCompanyMode' => !!$companyId 
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

    // 4. PLATFORM INTEL
    public function platforms()
    {
        $platformData = DB::connection('sqlsrv')
            ->table('v_Executive_Platform_Share')
            ->select(
                'network_name',
                'total_shows as total_titles', // Alias agar match dengan JSX
                'total_seasons',
                'avg_rating'
            )
            ->orderByDesc('total_shows')
            ->limit(10) // Top 10 Network
            ->get();

        // Tambahkan data dummy untuk 'top_title' karena di View belum ada
        $platformData->transform(function ($item) {
            $item->avg_rating = (float) $item->avg_rating; 
            if ($item->avg_rating >= 8.5) {
                $item->tier = 'Elite';
            } elseif ($item->avg_rating >= 7.5) {
                $item->tier = 'Strong';
            } else {
                $item->tier = 'Standard';
            }
            return $item;
        });

        // Hitung KPI
        $kpi = [
            'dominant_network' => $platformData->first()->network_name ?? '-',
            'highest_quality'  => $platformData->sortByDesc('avg_rating')->first()->network_name ?? '-',
            'total_networks'   => DB::connection('sqlsrv')->table('v_Executive_Platform_Share')->count(),
        ];

        return Inertia::render('Executive/Platforms', [
            'kpi' => $kpi,
            'data' => $platformData
        ]);
    }
}