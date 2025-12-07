<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function dashboard()
    {
        // 1. Ambil Statistik Input Data (Contoh)
        $stats = [
            'total_movies' => DB::connection('sqlsrv')->table('title_basics')->where('titleType', 'movie')->count(),
            'total_tv' => DB::connection('sqlsrv')->table('shows')->count(),
            'total_people' => DB::connection('sqlsrv')->table('name_basics')->count(),
            'recent_adds' => 15, // Dummy: Data baru minggu ini
        ];

        // 2. Data "Recent Activity" (Film yang baru masuk database)
        // Kita ambil berdasarkan tconst desc (asumsi tconst besar = data baru) atau startYear
        $recentItems = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->select('primaryTitle', 'startYear', 'titleType', 'averageRating')
            ->orderByDesc('startYear') // Atau created_at jika ada
            ->limit(5)
            ->get();

        return Inertia::render('Production/Dashboard', [
            'stats' => $stats,
            'recentItems' => $recentItems
        ]);
    }

    // --- 1. MOVIES LIST ---
    public function movies(Request $request) {
        $query = DB::connection('sqlsrv')->table('v_DetailJudulIMDB')->where('titleType', 'movie');
        
        if ($request->search) {
            $query->where('primaryTitle', 'LIKE', '%' . $request->search . '%');
        }

        $movies = $query->orderByDesc('startYear')->paginate(10)->withQueryString();

        return Inertia::render('Production/Movies/Index', [
            'movies' => $movies,
            'filters' => $request->all(['search'])
        ]);
    }

    // --- 2. TV SHOWS LIST ---
    public function tvShows(Request $request) {
        $query = DB::connection('sqlsrv')->table('v_DetailJudulTvShow');

        if ($request->search) {
            $query->where('primaryTitle', 'LIKE', '%' . $request->search . '%');
        }

        $shows = $query->orderByDesc('startYear')->paginate(10)->withQueryString();

        return Inertia::render('Production/TvShows/Index', [
            'shows' => $shows,
            'filters' => $request->all(['search'])
        ]);
    }

    // --- 3. PEOPLE LIST ---
    public function people(Request $request) {
        $query = DB::connection('sqlsrv')->table('name_basics');

        if ($request->search) {
            $query->where('primaryName', 'LIKE', '%' . $request->search . '%');
        }

        $people = $query->orderBy('primaryName')->paginate(10)->withQueryString();

        return Inertia::render('Production/People/Index', [
            'people' => $people,
            'filters' => $request->all(['search'])
        ]);
    }

    // --- 4. COMPANIES (Placeholder Table) ---
    public function companies(Request $request) {
        // Asumsi ada tabel 'production_companies' atau 'network_types'
        $query = DB::connection('sqlsrv')->table('network_types'); // Contoh pakai network dulu

        if ($request->search) {
            $query->where('network_name', 'LIKE', '%' . $request->search . '%');
        }

        $companies = $query->paginate(10)->withQueryString();

        return Inertia::render('Production/Companies/Index', [
            'companies' => $companies,
            'filters' => $request->all(['search'])
        ]);
    }

    // --- 5. GENRES ---
    public function genres(Request $request) {
        $query = DB::connection('sqlsrv')->table('genre_types');

        if ($request->search) {
            $query->where('genre_name', 'LIKE', '%' . $request->search . '%');
        }

        $genres = $query->paginate(10)->withQueryString();

        return Inertia::render('Production/Genres/Index', [
            'genres' => $genres,
            'filters' => $request->all(['search'])
        ]);
    }
    
    // Nanti tambahkan method index(), create(), store() untuk Movies, TV, dll di sini
}