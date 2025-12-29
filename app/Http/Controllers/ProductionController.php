<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductionController extends Controller
{
    
    public function dashboard(Request $request)
    {
        $companyId = $request->input('company_id');
        
        $cacheKey = $companyId ? "prod_dash_company_{$companyId}_v1" : "prod_dash_global_v1";

        // Cache 10 Menit
        $data = Cache::remember($cacheKey, 600, function() use ($companyId) {
            $conn = DB::connection('sqlsrv');
            $currentYear = date('Y');

            if ($companyId) {
                // --- A. MODE COMPANY (Studio Operations) ---
                $query = $conn->table('shows as s')
                    ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                    ->where('pc.production_company_type_id', $companyId);

                // 1. KPI Cards
                $statsRaw = (clone $query)
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->select(
                        DB::raw('COUNT(DISTINCT s.show_id) as total_titles'),
                        DB::raw('SUM(s.number_of_seasons) as total_seasons'),
                        DB::raw('SUM(s.number_of_episodes) as total_episodes'),
                        DB::raw('AVG(sv.vote_average) as avg_rating')
                    )
                    ->first();

                $cards = [
                    [ 'label' => 'Total Productions', 'value' => $statsRaw->total_titles, 'icon' => 'movie_filter', 'color' => 'text-blue-500', 'glow' => 'bg-blue-500' ],
                    [ 'label' => 'Total Seasons', 'value' => $statsRaw->total_seasons, 'icon' => 'layers', 'color' => 'text-purple-500', 'glow' => 'bg-purple-500' ],
                    [ 'label' => 'Episodes Shipped', 'value' => $statsRaw->total_episodes, 'icon' => 'subscriptions', 'color' => 'text-pink-500', 'glow' => 'bg-pink-500' ],
                    [ 'label' => 'Avg Studio Rating', 'value' => number_format($statsRaw->avg_rating ?? 0, 1), 'icon' => 'star', 'color' => 'text-amber-500', 'glow' => 'bg-amber-500' ]
                ];

                // 2. Charts Data
                $chartStatus = (clone $query)
                    ->join('status as st', 's.status_id', '=', 'st.status_id')
                    ->select('st.status_name', DB::raw('COUNT(DISTINCT s.show_id) as count'))
                    ->groupBy('st.status_name')
                    ->orderByDesc('count')
                    ->get();

                $chartSecondary = (clone $query)
                    ->join('spoken_languages as sl', 's.show_id', '=', 'sl.show_id')
                    ->join('spoken_language_types as slt', 'sl.spoken_language_type_id', '=', 'slt.spoken_language_type_id')
                    ->select('slt.spoken_language_name as label', DB::raw('COUNT(DISTINCT s.show_id) as count'))
                    ->groupBy('slt.spoken_language_name')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get();

                // 3. Recent Activity (Company)
                $recentItems = (clone $query)
                    ->join('air_dates as ad', 's.show_id', '=', 'ad.show_id')
                    ->join('show_votes as sv', 's.show_id', '=', 'sv.show_id')
                    ->where('ad.is_first', 1)
                    ->select('s.name as primaryTitle', 'ad.date as release_date', DB::raw("'TV Show' as titleType"), 'sv.vote_average as averageRating', 's.number_of_seasons')
                    ->orderByDesc('ad.date')
                    ->limit(20) 
                    ->get()
                    ->map(function($item) {
                        return [
                            'title' => $item->primaryTitle,
                            'date'  => $item->release_date,
                            'type'  => $item->titleType,
                            'rating'=> $item->averageRating,
                            'extra' => $item->number_of_seasons . ' Seasons'
                        ];
                    });

            } else {
                // --- B. MODE GLOBAL (Market Overview) ---
                $cards = [
                    [ 'label' => 'Total Movies', 'value' => $conn->table('title_basics')->where('titleType', 'movie')->count(), 'icon' => 'movie', 'color' => 'text-cyan-400', 'glow' => 'bg-cyan-400' ],
                    [ 'label' => 'TV Series', 'value' => $conn->table('shows')->count(), 'icon' => 'tv', 'color' => 'text-emerald-400', 'glow' => 'bg-emerald-400' ],
                    [ 'label' => 'Talent Pool', 'value' => $conn->table('name_basics')->count(), 'icon' => 'groups', 'color' => 'text-indigo-400', 'glow' => 'bg-indigo-400' ],
                    [ 'label' => 'New This Year', 'value' => $conn->table('title_basics')->where('startYear', $currentYear)->count(), 'icon' => 'new_releases', 'color' => 'text-rose-400', 'glow' => 'bg-rose-400' ]
                ];

                $chartStatus = $conn->table('title_basics')
                    ->select('titleType as status_name', DB::raw('COUNT(*) as count'))
                    ->groupBy('titleType')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get();

                $chartSecondary = $conn->table('v_Executive_Genre_Stats')
                    ->select('genre_name as label', 'total_titles as count')
                    ->orderByDesc('total_titles')
                    ->limit(5)
                    ->get();

                // Recent Items (Global)
                $recentItems = $conn->table('v_DetailJudulIMDB')
                    ->select('primaryTitle', 'startYear', 'titleType', 'averageRating', 'numVotes')
                    ->whereNotNull('startYear')
                    ->orderByDesc('startYear')
                    ->orderByDesc('numVotes')
                    ->limit(20) // Limit diperbesar
                    ->get()
                    ->map(function($item) {
                        return [
                            'title' => $item->primaryTitle,
                            'date'  => $item->startYear,
                            'type'  => $item->titleType,
                            'rating'=> $item->averageRating,
                            'extra' => number_format($item->numVotes) . ' Votes'
                        ];
                    });
            }

            $genres = $conn->table('genre_types')
                ->select('genre_type_id', 'genre_name')
                ->orderBy('genre_name')
                ->get();

            return [
                'cards' => $cards,
                'charts' => [
                    'status' => $chartStatus,
                    'secondary' => $chartSecondary
                ],
                'recent' => $recentItems,
                'genres' => $genres 
            ];
        });

        return Inertia::render('Production/Dashboard', [
            'stats' => $data['cards'],
            'charts' => $data['charts'],
            'recentItems' => $data['recent'],
            'genres' => $data['genres'],
            'isCompanyMode' => !!$companyId
        ]);
    }
    
    public function storeGenre(Request $request)
    {
        $request->validate(['genre_name' => 'required|string|max:50']);
        
        DB::connection('sqlsrv')->table('genre_types')->insert([
            'genre_name' => $request->genre_name
        ]);
        
        return redirect()->back();
    }

    public function destroyGenre($id)
    {
        DB::connection('sqlsrv')->table('genre_types')
            ->where('genre_type_id', $id)
            ->delete();
            
        return redirect()->back();
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
    public function tvShows(Request $request)
    {
        $companyId = $request->input('company_id');
        $search = $request->search;

        $conn = DB::connection('sqlsrv');

        if ($companyId) {
            // --- A. MODE COMPANY (MADHOUSE) ---
            $query = $conn->table('shows as s')
                ->join('production_companies as pc', 's.show_id', '=', 'pc.show_id')
                ->leftJoin('show_votes as sv', 's.show_id', '=', 'sv.show_id') // Join rating
                ->leftJoin('air_dates as ad', function($join) {
                    $join->on('s.show_id', '=', 'ad.show_id')->where('ad.is_first', '=', 1);
                })
                ->where('pc.production_company_type_id', $companyId) // Filter Madhouse
                ->select(
                    's.show_id as tconst',
                    's.name as primaryTitle',
                    's.overview',
                    's.number_of_seasons',
                    's.number_of_episodes',
                    DB::raw("FORMAT(ad.date, 'yyyy') as startYear"), // Ambil Tahun
                    'sv.vote_average as averageRating',
                    'sv.vote_count as numVotes',
                    DB::raw("'tvSeries' as titleType")
                );

        } else {
            // --- B. MODE GLOBAL (RIVAL) - READ ONLY ---
            $query = $conn->table('v_DetailJudulTvShow')
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
        }

        // Fitur Search
        if ($search) {
            $query->where($companyId ? 's.name' : 'primaryTitle', 'LIKE', '%' . $search . '%');
        }

        // Pagination
        $shows = $query->orderByDesc($companyId ? 'ad.date' : 'startYear')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Production/TvShows/Index', [
            'shows' => $shows,
            'filters' => $request->all(['search']),
            'isCompanyMode' => !!$companyId, // Flag untuk Frontend
            'companyId' => $companyId
        ]);
    }

    // --- CREATE (Insert ke Database) ---
    public function storeTvShow(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'overview' => 'nullable|string',
            'seasons' => 'required|integer',
            'episodes' => 'required|integer',
            'company_id' => 'required'
        ]);

        DB::transaction(function () use ($request) {
            // 1. Insert ke tabel shows (Dapatkan ID baru)
            $showId = DB::connection('sqlsrv')->table('shows')->insertGetId([
                'name' => $request->name,
                'overview' => $request->overview,
                'number_of_seasons' => $request->seasons,
                'number_of_episodes' => $request->episodes,
                // Default values
                'adult' => 0,
                'in_production' => 1,
                'popularity' => 0,
                'type_id' => 1, // TV Series
                'status_id' => 1 // Returning Series
            ]);

            // 2. Link ke Madhouse (production_companies)
            DB::connection('sqlsrv')->table('production_companies')->insert([
                'show_id' => $showId,
                'production_company_type_id' => $request->company_id
            ]);

            // 3. Set Start Date
            DB::connection('sqlsrv')->table('air_dates')->insert([
                'show_id' => $showId,
                'date' => now(),
                'is_first' => 1
            ]);
        });

        return redirect()->back();
    }

    // --- UPDATE (Edit Database) ---
    public function updateTvShow(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'overview' => 'nullable|string',
            'seasons' => 'required|integer',
            'episodes' => 'required|integer',
        ]);

        DB::connection('sqlsrv')->table('shows')
            ->where('show_id', $id)
            ->update([
                'name' => $request->name,
                'overview' => $request->overview,
                'number_of_seasons' => $request->seasons,
                'number_of_episodes' => $request->episodes,
            ]);

        return redirect()->back();
    }

    // --- DELETE (Hapus dari Database) ---
    public function destroyTvShow($id)
    {
        // Hapus relasi dulu (Foreign Keys) atau set ON DELETE CASCADE di DB
        // Di sini kita hapus manual relasinya untuk keamanan
        DB::connection('sqlsrv')->table('production_companies')->where('show_id', $id)->delete();
        DB::connection('sqlsrv')->table('air_dates')->where('show_id', $id)->delete();
        DB::connection('sqlsrv')->table('show_votes')->where('show_id', $id)->delete();
        
        // Hapus data utama
        DB::connection('sqlsrv')->table('shows')->where('show_id', $id)->delete();

        return redirect()->back();
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
        $query = DB::connection('sqlsrv')->table('v_GenreStats');

        if ($request->search) {
            $query->where('genre_name', 'LIKE', '%' . $request->search . '%');
        }

        $genres = $query->orderByDesc('total_titles')
                        ->paginate(12)
                        ->withQueryString();

        return Inertia::render('Production/Genres/Index', [
            'genres' => $genres,
            'filters' => $request->all(['search'])
        ]);
    }
}