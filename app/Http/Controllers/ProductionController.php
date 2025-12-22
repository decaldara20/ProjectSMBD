<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function dashboard()
    {
        // 1. Ambil Statistik Real dari DB
        $currentYear = date('Y');

        $stats = [
        'total_movies' => DB::connection('sqlsrv')->table('title_basics')->where('titleType', 'movie')->count(),
        'total_tv'     => DB::connection('sqlsrv')->table('shows')->count(),
        'total_people' => DB::connection('sqlsrv')->table('name_basics')->count(),
        'recent_adds'  => DB::connection('sqlsrv')->table('title_basics')->where('startYear', $currentYear)->count(),
        ];

        // 2. Data "Recent Activity" 
        // Mengambil 5 film terbaru berdasarkan Tahun Rilis
        $recentItems = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB') 
            ->select('tconst', 'primaryTitle', 'startYear', 'titleType', 'averageRating')
            ->whereNotNull('startYear') 
            ->orderByDesc('startYear') 
            ->orderByDesc('averageRating') 
            ->limit(5)
            ->get();

        return Inertia::render('Production/Dashboard', [
            'stats' => $stats,
            'recentItems' => $recentItems
        ]);
    }

    // --- 1. FILMS LIST ---
    public function films(Request $request) 
    {
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB') 
            ->select(
                'tconst', 
                'primaryTitle', 
                'startYear', 
                'Genres_List as genres',
                'runtimeMinutes', 
                'averageRating', 
                'numVotes',
                'titleType' 
            );
        
        // 1. Filter Search (Judul)
        if ($request->search) {
            $query->where('primaryTitle', 'LIKE', '%' . $request->search . '%');
        }

        // 2. Filter Tipe (Dropdown)
        if ($request->type) {
            $query->where('titleType', $request->type);
        }

        // Pagination
        $films = $query->orderByDesc('startYear')
                        ->orderByDesc('averageRating') 
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Production/Films/Index', [
            'films' => $films,
            'filters' => $request->all(['search', 'type'])
        ]);
    }

    // --- 2. TV SHOWS LIST ---
    public function tvShows(Request $request) {
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->select(
                'show_id as tconst',      
                'primaryTitle', 
                'startYear',              
                'endYear',                 
                'Genres_List as genres',   
                'averageRating', 
                'numVotes',
                DB::raw("'tvSeries' as titleType") 
            );

        // Fitur Search
        if ($request->search) {
            $query->where('primaryTitle', 'LIKE', '%' . $request->search . '%');
        }

        // Pagination + Formatting Data
        $shows = $query->orderByDesc('startYear')
                        ->orderByDesc('averageRating')
                        ->paginate(10)
                        ->withQueryString()
                        ->through(function ($item) {
                            $item->startYear = $item->startYear ? substr((string)$item->startYear, 0, 4) : null;
                            $item->endYear   = $item->endYear   ? substr((string)$item->endYear, 0, 4)   : null;
                            return $item;
                        });

        return Inertia::render('Production/TvShows/Index', [
            'shows' => $shows,
            'filters' => $request->all(['search'])
        ]);
    }

    // --- 3. PEOPLE / TALENT LIST ---
    public function people(Request $request) {
        $query = DB::connection('sqlsrv')
            ->table('v_DetailAktor')
            ->select(
                'nconst',
                'primaryName',
                'birthYear',
                'deathYear',
                'profession as primaryProfession', 
                'known_for_titles as knownFor'
            );

        // Filter Search (Nama)
        if ($request->search) {
            $query->where('primaryName', 'LIKE', '%' . $request->search . '%');
        }

        // Filter Profesi (Dropdown)
        if ($request->role && $request->role !== 'all') {
            $query->where('primaryProfession', 'LIKE', '%' . $request->role . '%');
        }

        // Pagination
        $people = $query->orderBy('primaryName')
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Production/People/Index', [
            'people' => $people,
            'filters' => $request->all(['search', 'role'])
        ]);
    }

    // --- 4. COMPANIES ---
    public function companies(Request $request) {
        $query = DB::connection('sqlsrv')->table('v_CompanyStats');

        // 1. Filter Search
        if ($request->search) {
            $query->where('company_name', 'LIKE', '%' . $request->search . '%');
        }

        // Pagination
        $companies = $query->orderByDesc('total_titles')
                            ->orderByDesc('avg_rating')
                            ->paginate(12)
                            ->withQueryString();

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
}