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
        // 1. SETUP FILTER WAKTU (REAL)
        $range = $request->input('range', 'all'); 
        
        // Tentukan batas tanggal (Start Date)
        $startDate = match($range) {
            '30d' => now()->subDays(30),
            '1y'  => now()->subYear(),
            default => null, // All Time
        };

        // 2. KPI DASHBOARD (REAL COUNT)
        // Kita hitung total saat ini
        $kpi = [
            'total_titles' => DB::connection('sqlsrv')->table('title_basics')->count(),
            // Hitung rata-rata rating (opsional: filter berdasarkan tahun rilis jika mau lebih spesifik)
            'avg_rating'   => number_format(DB::connection('sqlsrv')->table('title_ratings')->avg('averageRating'), 1),
            'total_pros'   => DB::connection('sqlsrv')->table('name_basics')->count(),
            'total_tv'     => DB::connection('sqlsrv')->table('shows')->count(),
        ];

        // 3. CHART: GENRE TRENDS (REAL FROM VIEW)
        // View v_Executive_Genre_Stats sudah matang, kita ambil Top 5
        $genreData = DB::connection('sqlsrv')
            ->table('v_Executive_Genre_Stats')
            ->orderByDesc('total_votes')
            ->limit(5)
            ->get();

        // 4. CHART: PLATFORM ANALYTICS (REAL FROM VIEW)
        $platformData = DB::connection('sqlsrv')
            ->table('v_Executive_Platform_Share')
            ->orderByDesc('total_shows')
            ->limit(7)
            ->get();

        // 5. CHART: YEARLY GROWTH (REAL FROM VIEW)
        $growthQuery = DB::connection('sqlsrv')
            ->table('v_Executive_Yearly_Growth')
            ->where('startYear', '>=', 2010); // Default 15 tahun terakhir
        
        // Jika filter 1y/30d aktif, kita persempit datanya
        if ($range !== 'all') {
             // Logic khusus untuk chart tahunan, kalau filter 30 hari mungkin grafiknya flat
             // Jadi kita biarkan grafik pertumbuhan tetap tahunan, atau sesuaikan jika perlu.
        }
        $growthData = $growthQuery->orderBy('startYear')->get();


        // 6. BUSINESS INTELLIGENCE: FAILED SEARCHES (REAL DATA!)
        // Mengambil keyword yang hasilnya 0, dikelompokkan, dan dihitung jumlahnya
        $failedQuery = DB::table('search_logs')
            ->select('keyword as term', DB::raw('count(*) as count'))
            ->where('results_count', 0); // Hanya yang GAGAL (hasil 0)

        // Terapkan Filter Waktu pada Log Pencarian
        if ($startDate) {
            $failedQuery->where('created_at', '>=', $startDate);
        }

        $failedSearches = $failedQuery
            ->groupBy('keyword')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function($item) {
                // Tambahkan data dummy trend karena kita belum punya data bulan lalu untuk dibandingkan
                // Nanti bisa dikembangkan lagi
                $item->trend = 'New Alert'; 
                return $item;
            });

        return Inertia::render('Executive/Dashboard', [
            'kpi' => $kpi,
            'charts' => [
                'genres' => $genreData,
                'platforms' => $platformData,
                'growth' => $growthData,
            ],
            'bi' => [
                'failed_searches' => $failedSearches // Data Asli dari tabel search_logs
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
            ->table('v_Executive_Yearly_Growth')
            ->where('startYear', '>=', date('Y') - 10)
            ->where('startYear', '<=', date('Y'))
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
            ->where('total_titles', '>', 500) 
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
        // 1. KPI Cards (Hitung Cepat)
        $kpi = [
            'total_actors' => DB::connection('sqlsrv')->table('name_basics')->where('primaryProfession', 'LIKE', '%actor%')->count(),
            'total_directors' => DB::connection('sqlsrv')->table('name_basics')->where('primaryProfession', 'LIKE', '%director%')->count(),
            'avg_pro_rating' => 7.2, // Hardcoded dulu biar cepet (kalo query avg semua person berat)
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
            ->paginate(10); // Tetap paginate biar tabelnya rapi

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