<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ExecutiveController extends Controller
{
    // 1. DASHBOARD UTAMA (Overview)
    public function dashboard(Request $request)
    {
        $companyId = $request->input('company_id');
        $range = $request->input('range', 'all'); // Filter waktu untuk Global

        // Tentukan Mode (Company vs Global)
        if ($companyId) {
            // A. MODE COMPANY (WITH CACHE)
            $cacheKey = 'exec_dash_company_' . $companyId;

            // Cache 6 Jam (21600 detik)
            $data = Cache::remember($cacheKey, 21600, function() use ($companyId) {
                
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
                    )->first();

                // 2. CHART: Growth
                $growthData = DB::connection('sqlsrv')
                    ->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('air_dates as ad', 's.show_id', '=', 'ad.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->where('ad.is_first', 1)
                    ->whereYear('ad.date', '>=', 1970)
                    ->select(DB::raw('YEAR(ad.date) as startYear'), DB::raw('COUNT(DISTINCT s.show_id) as total_released'))
                    ->groupBy(DB::raw('YEAR(ad.date)'))
                    ->orderBy('startYear')->get();

                // Hitung Label Growth
                $lastTwo = $growthData->take(-2)->values();
                if ($lastTwo->count() >= 2) {
                    $curr = $lastTwo[1]->total_released;
                    $prev = $lastTwo[0]->total_released;
                    $pct = $prev > 0 ? (($curr - $prev) / $prev) * 100 : 0;
                    $growthLabel = ($pct >= 0 ? '+' : '') . number_format($pct, 1) . '% YoY';
                } else {
                    $growthLabel = 'Stable';
                }

                // 3. CHART: Top Genres
                $platformData = DB::connection('sqlsrv')
                    ->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('genres as g', 's.show_id', '=', 'g.show_id')
                    ->join('genre_types as gt', 'g.genre_type_id', '=', 'gt.genre_type_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->select('gt.genre_name as network_name', DB::raw('COUNT(DISTINCT s.show_id) as total_shows'))
                    ->groupBy('gt.genre_name')->orderByDesc('total_shows')->limit(5)->get();

                // 4. LIST: Top Performing Assets (Real Data, Top 3)
                $topTalent = DB::connection('sqlsrv')
                    ->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->leftJoin('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->where('sv.vote_count', '>', 50)
                    ->select(
                        's.name as primaryName', 
                        DB::raw("CONCAT(s.number_of_seasons, ' Seasons • ', s.number_of_episodes, ' Eps') as primaryProfession"),
                        'sv.vote_average as AverageRating'
                    )
                    ->orderByDesc('sv.vote_average')->limit(3)->get();

                // 5. INSIGHTS (Studio DNA)
                $peakYear = $growthData->sortByDesc('total_released')->first();
                $topGenre = $platformData->first();
                $genreShare = ($stats->total_titles > 0 && $topGenre) ? ($topGenre->total_shows / $stats->total_titles) * 100 : 0;

                return [
                    'kpi' => [
                        'total_titles' => number_format($stats->total_titles, 0, ',', '.'),
                        'growth_txt'   => $growthLabel,
                        'avg_rating'   => number_format($stats->avg_rating ?? 0, 1),
                        'total_pros'   => number_format($stats->total_votes ?? 0, 0, ',', '.'),
                        'total_tv'     => number_format($stats->total_seasons ?? 0, 0, ',', '.'),
                    ],
                    'charts' => [
                        'platforms' => $platformData,
                        'growth' => $growthData,
                    ],
                    'topTalent' => $topTalent,
                    'marketInsights' => [
                        'peak' => [
                            'startYear' => $peakYear->startYear ?? '-',
                            'total_released' => number_format($peakYear->total_released ?? 0, 0, ',', '.')
                        ],
                        'topGenre' => [
                            'network_name' => $topGenre->network_name ?? '-',
                        ],
                        'genreShare' => number_format($genreShare, 0),
                        'activeYears' => $growthData->count(),
                        'avgImpact' => number_format($stats->avg_rating ?? 0, 1)
                    ]
                ];
            });

        } else {
            // ==========================================
            // B. MODE GLOBAL (WITH CACHE)
            // ==========================================
            $cacheKey = 'exec_dash_global_' . $range;

            // Cache 6 Jam
            $data = Cache::remember($cacheKey, 21600, function() use ($range) {
                
                // 1. Chart Platform
                $platformData = DB::connection('sqlsrv')->table('v_Executive_Platform_Share')->orderByDesc('total_shows')->limit(5)->get();

                // 2. Chart Growth
                $growthQuery = DB::connection('sqlsrv')->table('v_Executive_Yearly_Growth')->where('startYear', '>=', 2010); 
                if ($range === '1y') { $growthQuery->where('startYear', '>=', date('Y')); }
                $growthData = $growthQuery->orderBy('startYear')->get();

                // Hitung Growth Label
                $curr = $growthData->last()->total_released ?? 0;
                $prev = $growthData->count() > 1 ? $growthData[$growthData->count()-2]->total_released : 1;
                $pct = (($curr - $prev) / $prev) * 100;
                $growthLabel = ($pct >= 0 ? '+' : '') . number_format($pct, 1) . '% YoY';

                // 3. Top Talent
                $topTalent = DB::connection('sqlsrv')->table('v_Executive_BankabilityReport_Base')
                    ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
                    ->orderByDesc('TotalNumVotes')->limit(4)->get();

                // 4. Market Insights (Global)
                $peakGlobal = DB::connection('sqlsrv')->table('title_basics')
                    ->select('startYear', DB::raw('COUNT(*) as total'))
                    ->whereNotNull('startYear')->groupBy('startYear')->orderByDesc('total')->first();

                $topGenreGlobal = DB::connection('sqlsrv')->table('genres as g')
                    ->join('genre_types as gt', 'g.genre_type_id', '=', 'gt.genre_type_id')
                    ->select('gt.genre_name', DB::raw('COUNT(*) as total'))
                    ->groupBy('gt.genre_name')->orderByDesc('total')->first();
                
                $totalGenresEntries = DB::connection('sqlsrv')->table('genres')->count();
                $genreShareGlobal = ($totalGenresEntries > 0 && $topGenreGlobal) ? ($topGenreGlobal->total / $totalGenresEntries) * 100 : 0;
                
                $oldestTitle = DB::connection('sqlsrv')->table('title_basics')->min('startYear');
                $activeYearsGlobal = $oldestTitle ? (date('Y') - $oldestTitle) : 0;
                $avgVotesGlobal = DB::connection('sqlsrv')->table('title_ratings')->avg('numVotes') ?? 0;

                // KPI Calculation
                return [
                    'kpi' => [
                        'total_titles' => number_format(DB::connection('sqlsrv')->table('title_basics')->count(), 0, ',', '.'),
                        'growth_txt'   => $growthLabel,
                        'avg_rating'   => number_format(DB::connection('sqlsrv')->table('title_ratings')->avg('averageRating') ?? 0, 1),
                        'total_pros'   => number_format(DB::connection('sqlsrv')->table('name_basics')->count(), 0, ',', '.'),
                        'total_tv'     => number_format(DB::connection('sqlsrv')->table('shows')->count(), 0, ',', '.'),
                    ],
                    'charts' => [
                        'platforms' => $platformData,
                        'growth' => $growthData,
                    ],
                    'topTalent' => $topTalent,
                    'marketInsights' => [
                        'peak' => [
                            'startYear' => $peakGlobal->startYear ?? '-',
                            'total_released' => number_format($peakGlobal->total ?? 0, 0, ',', '.')
                        ],
                        'topGenre' => [
                            'network_name' => $topGenreGlobal->genre_name ?? 'N/A',
                        ],
                        'genreShare' => number_format($genreShareGlobal, 0),
                        'activeYears' => $activeYearsGlobal,
                        'avgImpact' => number_format($avgVotesGlobal, 0, ',', '.')
                    ]
                ];
            });
        }

        return Inertia::render('Executive/Dashboard', [
            'kpi' => $data['kpi'],
            'charts' => $data['charts'],
            'topTalent' => $data['topTalent'],
            'bi' => [
                'failed_searches' => [], 
                'market_insights' => $data['marketInsights'] 
            ],
            'filters' => [
                'range' => $range
            ],
            'isCompanyMode' => !!$companyId 
        ]);
    }

    // 2. MARKET TRENDS
    public function trends(Request $request)
    {
        $companyId = $request->input('company_id');
        $cacheKey = $companyId ? "trends_company_{$companyId}_v1" : "trends_global_v1";

        // Cache 12 Jam
        $reports = Cache::remember($cacheKey, 43200, function() use ($companyId) {
            $conn = DB::connection('sqlsrv');

            $growth = collect();
            $genres = collect();

            if ($companyId) {
                // --- A. MODE COMPANY ---
                
                // 1. Growth (15 Tahun Terakhir)
                $growth = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('air_dates as ad', 's.show_id', '=', 'ad.show_id')
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->where('ad.is_first', 1)
                    ->whereYear('ad.date', '>=', date('Y') - 15)
                    ->select(
                        DB::raw('YEAR(ad.date) as startYear'),
                        DB::raw('COUNT(DISTINCT s.show_id) as total_released'),
                        DB::raw('AVG(sv.vote_average) as avg_rating'),
                        DB::raw('SUM(sv.vote_count) as total_votes')
                    )
                    ->groupBy(DB::raw('YEAR(ad.date)'))
                    ->orderBy('startYear', 'asc')
                    ->get();

                // 2. Genre Performance
                $genres = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('genres as g', 's.show_id', '=', 'g.show_id')
                    ->join('genre_types as gt', 'g.genre_type_id', '=', 'gt.genre_type_id')
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->select(
                        'gt.genre_name',
                        DB::raw('COUNT(DISTINCT s.show_id) as total_titles'),
                        DB::raw('SUM(sv.vote_count) as total_votes'),
                        DB::raw('AVG(sv.vote_average) as avg_rating')
                    )
                    ->groupBy('gt.genre_name')
                    ->orderByDesc('total_votes') // Default sort by popularity
                    ->limit(10)
                    ->get();
            } else {
                // --- B. MODE GLOBAL ---
                
                // 1. Growth (15 Tahun Terakhir)
                $growth = $conn->table('title_basics as tb')
                    ->join('title_ratings as tr', 'tb.tconst', '=', 'tr.tconst')
                    ->select(
                        'tb.startYear',
                        DB::raw('COUNT(tb.tconst) as total_released'),
                        DB::raw('AVG(tr.averageRating) as avg_rating'),
                        DB::raw('SUM(tr.numVotes) as total_votes')
                    )
                    ->where('tb.startYear', '>=', date('Y') - 15)
                    ->where('tb.startYear', '<=', date('Y'))
                    ->groupBy('tb.startYear')
                    ->orderBy('tb.startYear')
                    ->get();

                // 2. Popular Genres (Global View)
                $genres = $conn->table('v_Executive_Genre_Stats')
                    ->select('genre_name', 'total_titles', 'total_votes', 'avg_rating')
                    ->orderByDesc('total_votes')
                    ->limit(10)
                    ->get();

                $popular = $conn->table('v_Executive_Genre_Stats')
                    ->select('genre_name', 'total_votes')
                    ->orderByDesc('total_votes')
                    ->limit(10)
                    ->get();
            }

            // --- LOGIC: HITUNG YoY GROWTH (Insight) ---
            $currentYear = $growth->isNotEmpty() ? $growth->last() : null;
            $prevYear = $growth->count() > 1 ? $growth->get($growth->count() - 2) : null;
            
            $volumeGrowth = 0;
            $qualityGrowth = 0;

            if ($prevYear && $currentYear && $currentYear->total_released > 0) {
                if ($prevYear->total_released > 0) {
                    $volumeGrowth = (($currentYear->total_released - $prevYear->total_released) / $prevYear->total_released) * 100;
                }
                if ($prevYear->avg_rating > 0) {
                    $qualityGrowth = (($currentYear->avg_rating - $prevYear->avg_rating) / $prevYear->avg_rating) * 100;
                }
            }

            return [
                'growth_history' => $growth,
                'genre_stats' => $genres,
                'insights' => [
                    'volume_yoy' => round($volumeGrowth, 1),
                    'quality_yoy' => round($qualityGrowth, 1),
                    'current_year_vol' => $currentYear ? $currentYear->total_released : 0,
                    'current_year_rating' => $currentYear ? number_format($currentYear->avg_rating, 1) : 0,
                ]
            ];
        });

        return Inertia::render('Executive/Trends', [
            'reports' => $reports,
            'isCompanyMode' => !!$companyId
        ]);
    }

    // 3. TALENT ANALYTICS (Bankabilitas Artis)
    public function talents(Request $request)
    {
        $companyId = $request->input('company_id');
        
        // Cache Key unik
        $cacheKey = $companyId ? "talents_company_{$companyId}_v3" : "talents_global_v3";

        // Cache 12 Jam
        $data = Cache::remember($cacheKey, 43200, function() use ($companyId) {
            $conn = DB::connection('sqlsrv');

            if ($companyId) {
                // --- A. MODE COMPANY (Internal DB TV Show) ---
                // Sumber: shows, production_companies, created_by, show_votes
                
                // 1. KPI (Hanya data Creator yang tersedia di Schema)
                // Karena tidak ada tabel actors, kita set 0 atau kita anggap 'talent' = creator
                $totalCreators = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('created_by as cb', 's.show_id', '=', 'cb.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->distinct('cb.created_by_type_id')
                    ->count('cb.created_by_type_id');

                $kpi = [
                    'total_actors'    => 0, // Data tidak tersedia di schema
                    'total_directors' => 0, 
                    'total_writers'   => $totalCreators, // Mapping Creator ke Writer/Showrunner
                ];

                // 2. Rising Stars (Top Creators by Rating in Company)
                $risingStars = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('created_by as cb', 's.show_id', '=', 'cb.show_id')
                    ->join('created_by_types as cbt', 'cb.created_by_type_id', '=', 'cbt.created_by_type_id')
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->join('air_dates as ad', 's.show_id', '=', 'ad.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->where('ad.is_first', 1)
                    ->whereYear('ad.date', '>=', 2015) // Anggap Rising Star jika show rilis > 2015
                    ->select(
                        'cbt.created_by_name as primaryName',
                        DB::raw("'Creator' as primaryProfession"),
                        DB::raw('AVG(sv.vote_average) as averageRating'),
                        DB::raw('MIN(YEAR(ad.date)) as startYear')
                    )
                    ->groupBy('cbt.created_by_name')
                    ->orderByDesc('averageRating')
                    ->limit(5)
                    ->get();

                // 3. Bankable List (Internal Creators sorted by Total Votes/Popularity)
                $bankableList = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('created_by as cb', 's.show_id', '=', 'cb.show_id')
                    ->join('created_by_types as cbt', 'cb.created_by_type_id', '=', 'cbt.created_by_type_id')
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->select(
                        'cbt.created_by_name as primaryName',
                        DB::raw("'Creator' as primaryProfession"),
                        DB::raw('SUM(sv.vote_count) as TotalNumVotes'),
                        DB::raw('AVG(sv.vote_average) as AverageRating')
                    )
                    ->groupBy('cbt.created_by_name')
                    ->orderByDesc('TotalNumVotes')
                    ->paginate(10);

                // 4. Distribution (Disiasati dengan Genre Distribution Shows Company tersebut)
                // Karena kita cuma punya 1 profesi (Creator), pie chart profesi jadi tidak relevan.
                // Kita ganti jadi distribusi GENRE yang dikerjakan company ini.
                $distribution = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->join('genres as g', 's.show_id', '=', 'g.show_id')
                    ->join('genre_types as gt', 'g.genre_type_id', '=', 'gt.genre_type_id')
                    ->where('pc.production_company_type_id', $companyId)
                    ->select('gt.genre_name as primaryProfession', DB::raw('COUNT(s.show_id) as total_count')) // Alias profession biar match UI
                    ->groupBy('gt.genre_name')
                    ->orderByDesc('total_count')
                    ->limit(5)
                    ->get();

            } else {
                // --- B. MODE GLOBAL (IMDb Market Intelligence) ---
                // Tetap pakai View yang sudah ada
                
                $kpi = [
                    'total_actors'    => $conn->table('name_professions')
                                            ->where('profession_name', 'LIKE', '%actor%')
                                            ->orWhere('profession_name', 'LIKE', '%actress%')->count(),
                    'total_directors' => $conn->table('name_professions')
                                            ->where('profession_name', 'LIKE', '%director%')->count(),
                    'total_writers'   => $conn->table('name_professions')
                                            ->where('profession_name', 'LIKE', '%writer%')->count(),
                ];

                $distribution = $conn->table('v_Executive_Talent_Distribution')->get();
                $risingStars = $conn->table('v_Executive_Rising_Stars')->get();
                
                $bankableList = $conn->table('v_Executive_BankabilityReport_Base')
                    ->select('primaryName', 'primaryProfession', 'TotalNumVotes', 'AverageRating')
                    ->orderByDesc('TotalNumVotes')
                    ->paginate(10); 
            }

            return [
                'kpi' => $kpi,
                'charts' => ['distribution' => $distribution],
                'risingStars' => $risingStars,
                'bankable' => $bankableList
            ];
        });

        return Inertia::render('Executive/Talents', [
            'kpi' => $data['kpi'],
            'charts' => $data['charts'],
            'risingStars' => $data['risingStars'],
            'bankable' => $data['bankable'],
            'isCompanyMode' => !!$companyId
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