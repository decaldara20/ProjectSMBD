<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GuestController extends Controller
{
    // ==========================================
    // 1. HOMEPAGE DISPLAY
    // ==========================================
    public function homepage(Request $request) {
        // A. DATA FILTER
        $genres = DB::connection('sqlsrv')->table('genre_types')->orderBy('genre_name')->pluck('genre_name');
        $years = DB::connection('sqlsrv')->table('title_basics')->select('startYear')->whereNotNull('startYear')->distinct()->orderByDesc('startYear')->limit(50)->pluck('startYear');
        $countries = DB::connection('sqlsrv')->table('origin_country_types')->orderBy('origin_country_name')->pluck('origin_country_name');
        $networks = DB::connection('sqlsrv')->table('network_types')->orderBy('network_name')->pluck('network_name');
        $statuses = DB::connection('sqlsrv')->table('status')->orderBy('status_name')->pluck('status_name');
        $types = DB::connection('sqlsrv')->table('types')->orderBy('type_name')->pluck('type_name');

        // B. HERO SECTION (Film Unggulan/ Random Populer)
        // $heroMovie = DB::connection('sqlsrv')
        // ->table('v_DetailJudulIMDB')
        // ->where('titleType', 'movie')
        // ->where('numVotes', '>', 100000) // Filter populer (>100k vote)
        // ->orderByDesc('averageRating')
        // ->first();

        // // Fallback jika DB kosong
        // if (!$heroMovie) {
        //     $heroMovie = (object) [
        //         'tconst' => null, 
        //         'primaryTitle' => 'Selamat Datang di IMTVDB',
        //         'averageRating' => 'N/A', 
        //         'startYear' => date('Y'),
        //         'runtimeMinutes' => 0, 
        //         'contentRating' => 'PG',
        //         'plot' => 'Jelajahi ribuan film dan serial TV terbaik di sini.', 
        //         'poster_path' => null,
        //         'backdrop_path' => null
        //     ];
        // } else {
        //     // Placeholder data poster (karena DB lokal tidak punya)
        //     $heroMovie->poster_path = null; 
        //     $heroMovie->backdrop_path = null;
        //     $heroMovie->plot = "Nikmati pengalaman sinematik terbaik dengan koleksi film terlengkap dari seluruh dunia.";
        //     if (!isset($heroMovie->contentRating)) $heroMovie->contentRating = 'PG-13'; 
        // }

// --- 3. DATA UNTUK SLIDER 1 (Top Movies) ---
    // STEP 1: Ambil 10 ID film terpopuler (Super Cepat karena Index)
    $topMovieIds = DB::connection('sqlsrv')
        ->table('title_ratings as tr')
        ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
        ->where('tb.titleType', 'movie')
        ->orderByDesc('tr.numVotes')
        ->limit(10)
        ->pluck('tb.tconst'); // Hanya ambil ID

    // STEP 2: Ambil Detail Lengkap berdasarkan ID tadi
    $topMovies = DB::connection('sqlsrv')
        ->table('v_DetailJudulIMDB')
        ->whereIn('tconst', $topMovieIds)
        ->orderByDesc('numVotes') // Urutkan ulang sesuai ID
        ->get();

// --- 4. DATA UNTUK SLIDER 2 (Popular TV Shows) ---
    // STEP 1: Ambil 10 ID TV terpopuler dari tabel BASE (bukan View)
    $topShowIds = DB::connection('sqlsrv')
        ->table('shows') // Langsung ke tabel fisik, jangan ke View dulu
        ->orderByDesc('popularity')
        ->limit(10)
        ->pluck('show_id');

    // STEP 2: Ambil Detail dari View
    $topShows = DB::connection('sqlsrv')
        ->table('v_DetailJudulTvShow')
        ->whereIn('show_id', $topShowIds)
        ->orderByDesc('popularity')
        ->get();

        // E. SLIDER 3: TOP ARTISTS
        // Ambil dari View Bankability (Top 10 Artis Paling Populer/Banyak Vote)
        $topArtists = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base')
            ->orderByDesc('TotalNumVotes')
            ->limit(10)
            ->get();

        // Tambahkan properti profile_path kosong (biar view gak error saat manggil API nanti)
        foreach($topArtists as $artist) {
            $artist->profile_path = null; 
        }
        
        return view('guest.homepage', compact(
            // 'heroMovie', 
            'topMovies', 
            'topShows',
            'topArtists', 
            'genres', 
            'years',
            'countries', 
            'networks', 
            'statuses', 
            'types'
        ));
    }

    // ==========================================
    // 2. MOVIES CATALOG PAGE
    // ==========================================
    public function movies(Request $request) {
        $genres = DB::connection('sqlsrv')
            ->table('genre_types')
            ->orderBy('genre_name')
            ->pluck('genre_name');

        // Query Dasar: Ambil Film
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->where('titleType', 'movie');

        // Filter: Genre (Jika ada di URL ?genre=Action)
        if ($request->has('genre') && $request->genre != '') {
            $query->where('Genres_List', 'LIKE', '%' . $request->genre . '%');
        }

        // Sorting: Default berdasarkan Popularitas (Votes)
        $query->orderByDesc('numVotes');

        // Ambil Data dengan Pagination (18 film per halaman)
        $movies = $query->paginate(18);

        // Inject Poster Dummy untuk tampilan (Karena DB lokal tidak ada gambar)
        // Note: Di View nanti kita pakai JS lazy load seperti di Homepage
        foreach($movies as $movie) {
            $movie->poster_path = null;
        }

        return view('guest.movies', compact('movies', 'genres'));
    }

    // ==========================================
    // 3. TV SHOWS CATALOG PAGE
    // ==========================================
    public function tvShows(Request $request)
    {
        // Ambil Data TV Shows dengan Pagination
        // Kita ganti nama kolomnya biar seragam dengan format 'Movie'
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow') // Pastikan nama View ini benar
            ->select(
                'show_id as tconst',           // ID
                'name as primaryTitle',        // Judul
                'vote_average as averageRating', // Rating
                'first_air_date as startYear',   // Tahun
                'popularity'
            );

        // Sorting: Default berdasarkan Popularitas
        $query->orderByDesc('popularity');

        // Ambil Data (18 per halaman)
        $tvShows = $query->paginate(18);

        return view('guest.tv-shows', compact('tvShows'));
    }

    // =========================================================================
    // 4. DETAIL PAGES (Film, TV, Person)
    // =========================================================================

    public function showTitleDetail($tconst) {
        $title = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->where('tconst', $tconst)
            ->first();

        if (!$title) {
            return redirect('/')->with('error', 'Judul tidak ditemukan');
        }

        return view('guest.title-detail', compact('title'));
    }

    public function showTvDetail($show_id) {
        // Cek apakah ID formatnya 'tt...' (IMDb ID) -> Alihkan ke Detail Generic
        if (str_starts_with($show_id, 'tt')) {
            return $this->showTitleDetail($show_id);
        }

        // Jika ID Angka -> Cari di View TV Premium
        $tvShow = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->where('show_id', $show_id)
            ->first();

        if (!$tvShow) {
            return redirect('/')->with('error', 'TV Show tidak ditemukan');
        }

        return view('guest.tv-detail', compact('tvShow'));
    }

    public function showPersonDetail($nconst) {
        // 1. Ambil Info Aktor
        $person = DB::connection('sqlsrv')
            ->table('name_basics')
            ->where('nconst', $nconst)
            ->first();

        if (!$person) {
            return redirect('/')->with('error', 'Orang tidak ditemukan');
        }

        // 2. AMBIL FILMOGRAFI (OPTIMASI PHP)
        $rawMovies = DB::connection('sqlsrv')
            ->table('title_principals AS tp')
            ->join('title_basics AS tb', 'tp.tconst', '=', 'tb.tconst')
            ->where('tp.nconst', $nconst)
            ->select('tb.primaryTitle', 'tb.tconst', 'tb.startYear', 'tp.category')
            ->orderByDesc('tb.startYear')
            ->limit(200) 
            ->get();

        // 3. PROSES GROUPING DI PHP (Hilangkan Duplikat)
        $filmography = $rawMovies->groupBy('tconst')->map(function ($rows) {
            $first = $rows->first();
            $categories = $rows->pluck('category')->unique()->implode(', ');
            
            return (object) [
                'tconst' => $first->tconst,
                'primaryTitle' => $first->primaryTitle,
                'startYear' => $first->startYear,
                'category' => $categories 
            ];
        })->values()->take(50);

        return view('guest.person-detail', compact('person', 'filmography'));
    }

    // =========================================================================
    // 3. SEARCH LOGIC (LENGKAP)
    // =========================================================================
    public function search(Request $request)
    {
        $queryRaw = trim($request->input('q'));
        $type = $request->input('type', 'multi'); 

        if (!$queryRaw) {
            return redirect('/');
        }

        // --- PRE-PROCESSING STRING ---
        $cleanQuery = str_replace(['"', "'"], '', $queryRaw);
        $words = array_filter(explode(' ', $cleanQuery));
        $formattedWords = [];
        $numWords = count($words);
        $currentIndex = 0;

        foreach ($words as $word) {
            $word = trim($word);
            $currentIndex++;
            $isLastWord = ($currentIndex === $numWords);
            if ($isLastWord) {
                $formattedWords[] = '"' . $word . '*"';
            } else {
                if (strlen($word) > 2) {
                    $formattedWords[] = '"' . $word . '"';
                }
            }
        }
        if (empty($formattedWords)) {
             $formattedWords[] = '"' . end($words) . '*"';
        }
        $searchQuery = implode(' AND ', $formattedWords);

        // --- EKSEKUSI QUERY ---
        $results = collect([]); 

        // KASUS A: PENCARIAN FILM
        if ($type === 'movie' || $type === 'multi') {
            $sqlMovie = "
                WITH TopMatches AS (
                    SELECT TOP 20 tb.tconst, tr.numVotes
                    FROM dbo.title_basics tb
                    INNER JOIN dbo.title_ratings tr ON tb.tconst = tr.tconst
                    WHERE CONTAINS(tb.primaryTitle, ?) AND tb.titleType = 'movie'
                    ORDER BY tr.numVotes DESC
                )
                SELECT 
                    v.tconst as id,
                    v.primaryTitle as title,
                    v.startYear,
                    'movie' as type,
                    v.averageRating,
                    'https://placehold.co/300x450?text=' + REPLACE(LEFT(v.primaryTitle, 15), ' ', '+') as poster,
                    NULL as known_for
                FROM TopMatches tm
                INNER JOIN dbo.v_DetailJudulIMDB v ON tm.tconst = v.tconst
            ";
            
            $movieResults = DB::connection('sqlsrv')->select($sqlMovie, [$searchQuery]);
            $results = $results->merge($movieResults);
        }

        // KASUS B: PENCARIAN TV SHOW (HYBRID)
        if ($type === 'tv' || $type === 'multi') {
            // 1. Utama (TV Lokal)
            $sqlTV_Main = "
                SELECT TOP 20 
                    v.show_id as id,
                    v.primaryTitle as title,
                    v.startYear,
                    'tvSeries' as type,
                    v.averageRating,
                    'https://image.tmdb.org/t/p/w500' + v.homepage as poster,
                    NULL as known_for
                FROM dbo.v_DetailJudulTvShow v
                WHERE v.primaryTitle LIKE ?
                ORDER BY v.popularity DESC
            ";
            $tvParam = '%' . $cleanQuery . '%';
            $mainTvResults = DB::connection('sqlsrv')->select($sqlTV_Main, [$tvParam]);
            $results = $results->merge($mainTvResults);

            // 2. Backup (IMDb)
            $sqlTV_Backup = "
                SELECT TOP 20 
                    tb.tconst as id,
                    tb.primaryTitle as title,
                    tb.startYear,
                    'tvSeries_imdb' as type,
                    tr.averageRating,
                    'https://placehold.co/300x450?text=' + REPLACE(LEFT(tb.primaryTitle, 15), ' ', '+') as poster,
                    NULL as known_for
                FROM dbo.title_basics tb
                LEFT JOIN dbo.title_ratings tr ON tb.tconst = tr.tconst
                WHERE CONTAINS(tb.primaryTitle, ?) 
                  AND tb.titleType IN ('tvSeries', 'tvMiniSeries')
                ORDER BY tr.numVotes DESC
            ";
            $backupTvResults = DB::connection('sqlsrv')->select($sqlTV_Backup, [$searchQuery]);
            $results = $results->merge($backupTvResults);
        }

        // KASUS C: PENCARIAN AKTOR (FIXED FTS)
        if ($type === 'person' || $type === 'multi') {
            $sqlPerson = "
                SELECT TOP 20
                    v.nconst as id,
                    v.primaryName as title,
                    v.birthYear as startYear,
                    'person' as type,
                    NULL as averageRating,
                    'https://placehold.co/300x450/333/FFF?text=' + REPLACE(LEFT(v.primaryName, 10), ' ', '+') as poster,
                    v.known_for_titles as known_for
                FROM dbo.name_basics nb
                INNER JOIN dbo.v_DetailAktor v ON nb.nconst = v.nconst
                WHERE CONTAINS(nb.primaryName, ?)
            ";
            $personResults = DB::connection('sqlsrv')->select($sqlPerson, [$searchQuery]);
            $results = $results->merge($personResults);
        }

        // Sorting
        if ($type === 'multi') {
            $results = $results->sortByDesc(function ($item) {
                return $item->averageRating ?? -1; 
            })->values();
        }

        return view('guest.search-results', [
            'results' => $results,
            'query' => $queryRaw,
            'type' => $type
        ]);
    }
}