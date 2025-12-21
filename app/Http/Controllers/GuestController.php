<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class GuestController extends Controller
{
    // ==========================================
    // 1. HOMEPAGE DISPLAY
    // ==========================================
    public function homepage(Request $request) {
        
        // A. FILTER TAHUN (Manual PHP - Instant)
        $years = range(date('Y') + 1, 1950); 
        
        // B. FILTER LAINNYA (Cache 24 Jam)
        $filters = Cache::remember('homepage_filters_static', 60 * 24, function () {
            return [
                'genres'    => DB::connection('sqlsrv')->table('genre_types')->orderBy('genre_name')->pluck('genre_name'),
                'countries' => DB::connection('sqlsrv')->table('origin_country_types')->orderBy('origin_country_name')->pluck('origin_country_name'),
                'networks'  => DB::connection('sqlsrv')->table('network_types')->orderBy('network_name')->pluck('network_name'),
                'statuses'  => DB::connection('sqlsrv')->table('status')->orderBy('status_name')->pluck('status_name'),
                'types'     => DB::connection('sqlsrv')->table('types')->orderBy('type_name')->pluck('type_name'),
            ];
        });
        $filters['years'] = $years;

        $heroMovie = Cache::remember('homepage_hero', 60 * 60 * 24, function () {
            return DB::connection('sqlsrv')
                ->table('title_ratings as tr')
                ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
                ->select('tb.tconst', 'tb.primaryTitle', 'tb.startYear', 'tr.averageRating', 'tr.numVotes')
                ->where('tb.titleType', 'movie')
                ->where('tr.numVotes', '>', 100000) // Minimal vote biar pasti film terkenal
                ->orderByDesc('tr.numVotes') // Ambil yang paling populer
                ->first();
        });

        // ==========================================
        // SLIDER 1 & 2 (MOVIES & TV) - Cache 1 Jam
        // ==========================================
        $topMovies = Cache::remember('home_movies_fast', 60, function () {
            // ... Copy logika movies dari kode sebelumnya ...
            $ids = DB::connection('sqlsrv')->table('title_ratings as tr')
                ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
                ->where('tb.titleType', 'movie')->orderByDesc('tr.numVotes')->limit(10)->pluck('tb.tconst');
            return DB::connection('sqlsrv')->table('v_DetailJudulIMDB')
                ->whereIn('tconst', $ids)->orderByDesc('numVotes')->get();
        });

        $topShows = Cache::remember('home_tv_fast', 60, function () {
            // ... Copy logika tv dari kode sebelumnya ...
            $ids = DB::connection('sqlsrv')->table('shows')->orderByDesc('popularity')->limit(10)->pluck('show_id');
            $data = DB::connection('sqlsrv')->table('v_DetailJudulTvShow')
                ->whereIn('show_id', $ids)->orderByDesc('popularity')->get();
            foreach($data as $item) $item->poster_path = null;
            return $data;
        });

        // 4. TOP ARTISTS (VERSI SQL - TANPA TABEL BARU)
        // Strategi: Ambil aktor dari film-film dengan rating tertinggi.
        $topArtists = Cache::remember('homepage_top_living_artists_db_only', 60 * 60 * 24, function () {
            $sql = "
                SELECT TOP 15
                    nb.nconst,
                    nb.primaryName,
                    -- Subquery untuk ambil 1 profesi utama
                    (SELECT TOP 1 profession_name FROM name_professions WHERE nconst = nb.nconst) as primaryProfession,
                    SUM(tr.numVotes) as LocalPopularity
                FROM title_ratings tr
                INNER JOIN title_principals tp ON tr.tconst = tp.tconst
                INNER JOIN name_basics nb ON tp.nconst = nb.nconst
                WHERE 
                    tp.category IN ('actor', 'actress')
                    AND nb.deathYear IS NULL -- Hanya yang masih hidup
                    AND tr.numVotes > 50000 -- Optimasi: Hanya cek film populer
                GROUP BY nb.nconst, nb.primaryName
                ORDER BY LocalPopularity DESC
            ";
            return DB::connection('sqlsrv')->select($sql);
        });

        // Kirim semua variabel ke Frontend
        return Inertia::render('Guest/Homepage', [
            'heroMovie' => $heroMovie, 
            'topMovies' => $topMovies,
            'topShows'  => $topShows,
            'topArtists' => $topArtists,
        ]);
    }

    // ==========================================
    // 2. EXPLORE PAGE (OPTIMIZED SORTING & FILTER)
    // ==========================================
    public function explore(Request $request){
        // 1. QUERY A: Film dari IMDb
        $films = DB::connection('sqlsrv')->table('v_DetailJudulIMDB')
            ->select(
                'tconst', 
                'primaryTitle as title',
                'averageRating',
                'numVotes', // WAJIB ADA untuk sorting popularitas
                'startYear',
                'titleType',
                'Genres_List as genres'
            );

        // 2. QUERY B: TV dari Dataset TV
        $tvs = DB::connection('sqlsrv')->table('v_DetailJudulTvShow')
            ->select(
                DB::raw("CAST(show_id AS VARCHAR(20)) as tconst"), 
                'primaryTitle as title',
                'averageRating',
                'numVotes', // WAJIB ADA
                DB::raw("YEAR(startYear) as startYear"),
                DB::raw("'tvSeries' as titleType"),
                'Genres_List as genres'
            );

        // 3. GABUNGKAN (UNION ALL)
        // Kita bungkus dalam query builder utama agar bisa difilter/sort belakangan
        $combined = DB::connection('sqlsrv')
            ->query()
            ->fromSub($films->unionAll($tvs), 'catalog_union');

        // 4. FILTERING
        
        // Filter: Search Keyword
        if ($request->filled('q')) {
            $combined->where('title', 'LIKE', '%' . $request->q . '%');
        }

        // Filter: Type (Movie / TV)
        if ($request->filled('type') && $request->type != 'multi') {
            $combined->where('titleType', $request->type);
        }

        // Filter: Genre (PENTING!)
        // Karena 'Genres_List' bentuknya "Action,Adventure", kita pakai LIKE
        if ($request->filled('genre')) {
            $combined->where('genres', 'LIKE', '%' . $request->genre . '%');
        }

        // 5. SORTING (LOGIKA BARU - FIX ANOMALI TAHUN DEPAN)
        // Prioritas 1: Popularitas (Jumlah Vote) -> Biar film terkenal muncul duluan
        // Prioritas 2: Rating -> Biar film bagus di atas film jelek
        // Prioritas 3: Tahun -> Baru yang terbaru
        
        $items = $combined->orderByDesc('numVotes')      // Paling banyak divote
                          ->orderByDesc('averageRating') // Rating tertinggi
                          ->orderByDesc('startYear')     // Paling baru
                          ->paginate(24)
                          ->withQueryString();

        return \Inertia\Inertia::render('Guest/Explore', [
            'items' => $items,
            'filters' => $request->all(),
            // Ambil genre dari Middleware globalGenres (sudah dicache & benar)
            // Tidak perlu query lagi ke 'genre_types'
            'genres' => $request->get('globalGenres') 
        ]);
    }

    // ==========================================
    // 3. FILMS CATALOG PAGE
    // ==========================================
    public function films(Request $request) {
        $genres = DB::connection('sqlsrv')
            ->table('genre_types')
            ->orderBy('genre_name')
            ->pluck('genre_name');

        // Query Dasar
        $query = DB::connection('sqlsrv')->table('v_DetailJudulIMDB');

        // Filter Tipe (Hanya Film)
        $query->whereIn('titleType', [
            'movie', 'short', 'tvMovie', 'video', 
            'tvSpecial', 'videoGame', 'tvShort'
        ]);

        // Filter Genre
        if ($request->has('genre') && $request->genre != '') {
            $query->where('genres', 'LIKE', '%' . $request->genre . '%');
        }

        // Sorting Default
        $query->orderByDesc('numVotes');

        // Pagination
        $films = $query->paginate(24)->withQueryString();

        // Inject path kosong (opsional, react handle null sendiri)
        foreach($films as $film) {
            $film->poster_path = null;
        }

        // RETURN KE REACT
        return \Inertia\Inertia::render('Guest/Films', [
            'films' => $films,
            'genres' => $genres,
            'currentGenre' => $request->genre,
        ]);
    }

    // ==========================================
    // 4. TV SHOWS CATALOG PAGE
    // ==========================================
    public function tvShows(Request $request) {
        // Query Dasar
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->select(
                'show_id as tconst',  
                'primaryTitle', 
                'averageRating', 
                'startYear', 
                'popularity'
            );

        // Sorting: Default berdasarkan Popularitas
        $query->orderByDesc('popularity');

        // Ambil Data (24 per halaman agar grid rapi)
        $tvShows = $query->paginate(24);

        // Inject poster null (Opsional, React handle ini)
        foreach($tvShows as $show) {
            $show->poster_path = null;
        }

        // Return ke React
        return \Inertia\Inertia::render('Guest/TvShows', [
            'tvShows' => $tvShows
        ]);
    }

    // ==========================================
    // 5. PEOPLE CATALOG PAGE
    // ==========================================
    public function artists(Request $request) {
        // 1. Base Query: Join View Popularitas dengan Tabel Biodata Asli
        $query = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base as v')
            ->join('name_basics as nb', 'v.nconst', '=', 'nb.nconst')
            ->select(
                'v.nconst', 
                'v.primaryName', 
                'v.TotalNumVotes',
                DB::raw("(SELECT TOP 1 profession_name FROM name_professions WHERE nconst = v.nconst) as primaryProfession") 
            );

        // 2. Filter Profesi (Actor, Director, dll)
        if ($request->has('profession') && $request->profession != '') {
            $prof = $request->profession;
            
            // Logic: Cari 'actor' harus mencakup 'actress' juga
            $searchProfs = ($prof == 'actor') ? ['actor', 'actress'] : [$prof];

            // Filter menggunakan WHERE EXISTS
            $query->whereExists(function ($subquery) use ($searchProfs) {
                $subquery->select(DB::raw(1))
                    ->from('name_professions as np')
                    ->whereColumn('np.nconst', 'v.nconst')
                    ->whereIn('np.profession_name', $searchProfs);
            });
        }

        // 3. Filter Pencarian Nama
        if ($request->has('q') && $request->q != '') {
            $query->where('v.primaryName', 'LIKE', '%' . $request->q . '%');
        }

        // 4. Sorting & Pagination
        $query->orderByDesc('v.TotalNumVotes');
        $artists = $query->paginate(24)->withQueryString();

        // 5. Return ke React
        return \Inertia\Inertia::render('Guest/Artists', [
            'artists' => $artists,
            'filters' => $request->all(['q', 'profession']),
        ]);
    }

    // =======================================
    // 6. HISTORY MANAGEMENT
    // =======================================
    private function addToHistory($type, $id, $title, $year, $rating) {
        $history = session()->get('view_history', []);

        // Hapus duplikat
        $history = array_filter($history, function($item) use ($id, $type) {
            return !($item['id'] == $id && $item['type'] == $type);
        });

        // Tambah ke paling atas
        array_unshift($history, [
            'type' => $type,
            'id' => $id,
            'title' => $title,
            'year' => $year,
            'rating' => $rating,
            'timestamp' => now()
        ]);

        // Limit 20
        $history = array_slice($history, 0, 20);
        session()->put('view_history', $history);
    }

    // Halaman History (Ubah ke Inertia)
    public function history()
    {
        $history = session()->get('view_history', []);
        return Inertia::render('Guest/History', [
            'history' => array_values($history)
        ]);
    }

    // Aksi Clear
    public function clearHistory()
    {
        session()->forget('view_history');
        return back()->with('success', 'History cleared.');
    }

    // Aksi Remove Item
    public function removeHistoryItem(Request $request)
    {
        $history = session()->get('view_history', []);
        $id = $request->input('id');
        $type = $request->input('type');

        $history = array_filter($history, function($item) use ($id, $type) {
            return !($item['id'] == $id && $item['type'] == $type);
        });

        session()->put('view_history', array_values($history));
        return back();
    }
    
    // ==========================================
    // 7. FAVORITES (WISHLIST) SYSTEM
    // ==========================================
    public function favorites()
    {
        $favorites = session()->get('favorites', []);
        return Inertia::render('Guest/Favorites', [
            'favorites' => array_values($favorites)
        ]);
    }

    // Aksi Toggle
    public function toggleFavorite(Request $request)
    {
        $favorites = session()->get('favorites', []);
        $id = $request->id;
        $type = $request->type;
        
        $exists = false;
        $index = -1;
        
        foreach($favorites as $key => $item) {
            if ($item['id'] == $id && $item['type'] == $type) {
                $exists = true;
                $index = $key;
                break;
            }
        }

        if ($exists) {
            unset($favorites[$index]); // Hapus
        } else {
            $favorites[] = [ // Tambah
                'id' => $id,
                'type' => $type,
                'title' => $request->title,
                'year' => $request->year,
                'rating' => $request->rating,
                'timestamp' => now()
            ];
        }

        session()->put('favorites', array_values($favorites));
        return back(); // Kembali ke halaman sebelumnya (Inertia akan reload props)
    }

    // =========================================================================
    // 8. DETAIL PAGES (Film, TV, Person)
    // =========================================================================
    public function showTitleDetail($tconst) {
        // 1. Ambil ID Mentah & Bersihkan Spasi
        $rawId = trim((string) $tconst);

        // Validasi: Cegah ID kosong (biar gak error/random)
        if (empty($rawId)) return redirect('/')->with('error', 'ID tidak valid.');

        // 2. LOGIKA PERBAIKAN ID
        // Jika ID cuma "tt597" (pendek), kita coba juga cari versi "tt0000597" (panjang)
        $searchIds = [$rawId]; // Masukkan ID asli dulu
        
        // Cek apakah formatnya "tt" + angka?
        if (preg_match('/^tt(\d+)$/', $rawId, $matches)) {
            $numberPart = $matches[1];
            // Tambahkan versi padding 7 digit (Standar IMDb)
            $paddedId = 'tt' . str_pad($numberPart, 7, '0', STR_PAD_LEFT);
            if ($paddedId !== $rawId) {
                $searchIds[] = $paddedId;
            }
        }

        // 3. QUERY UTAMA (Cari di View & Tabel Fisik sekaligus)
        // Kita cari dimanapun ID itu berada (baik versi pendek maupun panjang)
        $title = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->whereIn('tconst', $searchIds) // Cari semua kemungkinan ID
            ->first();

        // 4. FALLBACK KE TABEL FISIK (Jika di View gak ada)
        if (!$title) {
            $title = DB::connection('sqlsrv')
                ->table('title_basics as tb')
                ->leftJoin('title_ratings as tr', 'tb.tconst', '=', 'tr.tconst')
                ->select(
                    'tb.tconst', 'tb.primaryTitle', 'tb.originalTitle', 
                    'tb.startYear', 'tb.runtimeMinutes', 'tb.titleType', 
                    'tr.averageRating', 'tr.numVotes',
                    'tb.isAdult'
                )
                // PENTING: Gunakan whereIn juga disini
                ->whereIn('tb.tconst', $searchIds)
                ->first();
        }

        // 5. JIKA MASIH GAGAL (Berarti data memang hancur/hilang)
        if (!$title) {
            // DEBUGGING: Jika Anda ingin melihat ID apa yang sebenarnya dicari (bisa dihapus nanti)
            // dd("Mencari ID: " . implode(', ', $searchIds) . " tapi tidak ketemu di Database.");
            
            return redirect('/')->with('error', 'Film tidak ditemukan.');
        }

        // 6. AMBIL GENRE (Jika View belum ada)
        if (isset($title->Genres_List)) {
            $title->genres = $title->Genres_List;
        } else {
            $genres = DB::connection('sqlsrv')
                ->table('title_genres')
                ->where('tconst', $title->tconst) // Gunakan ID hasil temuan DB
                ->pluck('genre_name')
                ->implode(', ');
            $title->genres = $genres ?: '-';
        }

        // Default Plot
        $title->plot = $title->plot ?? 'Sinopsis belum tersedia.';

        $this->addToHistory('movie', trim($title->tconst), $title->primaryTitle, $title->startYear, $title->averageRating ?? 0);

        return Inertia::render('Guest/TitleDetail', [
            'title' => $title
        ]);
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

        if (isset($tvShow->Genres_List)) {
            $tvShow->genres = $tvShow->Genres_List;
        } 
        // 2. Jika View belum update, ambil manual (Sesuai snippet SQL kamu)
        else {
            $genres = DB::connection('sqlsrv')
                ->table('genres') // Tabel penghubung TV
                ->join('genre_types', 'genres.genre_type_id', '=', 'genre_types.genre_type_id') // Join ke master genre
                ->where('genres.show_id', $show_id)
                ->pluck('genre_types.genre_name')
                ->implode(', ');

            $tvShow->genres = $genres ?: 'TV Series';
        }

        // Format Tahun untuk History
        $year = $tvShow->startYear ? \Carbon\Carbon::parse($tvShow->startYear)->format('Y') : 'N/A';
        
        $this->addToHistory(
            'tv', 
            $tvShow->show_id, 
            $tvShow->primaryTitle, 
            $year, 
            $tvShow->averageRating
        );

        $tvShow->poster_path = null;
        $tvShow->backdrop_path = null;
        
        // Render React Component
        return Inertia::render('Guest/TvDetail', [
            'title' => $tvShow
        ]);
    }

    public function showPersonDetail($nconst) {
        // 1. AMBIL PROFIL (Cache 24 Jam)
        $person = Cache::remember("person_profile_v3_{$nconst}", 60 * 60 * 24, function () use ($nconst) {
            $data = DB::connection('sqlsrv')->table('v_DetailAktor')->where('nconst', $nconst)->first();
            if (!$data) {
                $data = DB::connection('sqlsrv')->table('name_basics')->where('nconst', $nconst)->first();
            }
            return $data;
        });

        if (!$person) return redirect('/')->with('error', 'Orang tidak ditemukan');

        // Normalisasi
        $person->profession = $person->primaryProfession ?? ($person->profession ?? '-');
        $person->known_for_titles = $person->knownForTitles ?? '';
        $person->profile_path = null;

        // 2. HITUNG TOTAL KREDIT (Semua kredit, termasuk self)
        $creditCount = DB::connection('sqlsrv')->selectOne("SELECT COUNT(*) as total FROM title_principals WHERE nconst = ?", [$nconst]);
        $person->Total_Credits = $creditCount->total;

        // 3. AMBIL FILMOGRAFI (TOP 10 UNIK - ANTI DUPLIKAT)
        $filmography = Cache::remember("person_films_top10_unique_{$nconst}", 60 * 60, function () use ($nconst) {
            $sql = "
                SELECT TOP 10 
                    tconst, primaryTitle, startYear, category
                FROM (
                    SELECT 
                        RTRIM(tb.tconst) as tconst,
                        tb.primaryTitle,
                        tb.startYear,
                        tp.category,
                        -- Prioritaskan peran: actor/actress dulu, baru yang lain
                        ROW_NUMBER() OVER (
                            PARTITION BY tb.tconst 
                            ORDER BY 
                                CASE 
                                    WHEN tp.category IN ('actor', 'actress') THEN 1 
                                    WHEN tp.category = 'director' THEN 2
                                    WHEN tp.category = 'writer' THEN 3
                                    ELSE 4 
                                END ASC
                        ) as role_priority
                    FROM title_principals tp
                    INNER JOIN title_basics tb WITH(FORCESEEK) ON tp.tconst = tb.tconst
                    WHERE tp.nconst = ?
                    AND tp.category NOT IN ('self', 'archive_footage', 'guest', 'himself', 'herself', 'thanks')
                    AND tb.titleType IN ('movie', 'tvSeries', 'tvMiniSeries')
                ) AS UniqueFilms
                WHERE role_priority = 1 -- Hanya ambil 1 peran terbaik per film
                ORDER BY startYear DESC
            ";

            return DB::connection('sqlsrv')->select($sql, [$nconst]);
        });

        $this->addToHistory('person', $nconst, $person->primaryName, null, null);

        return Inertia::render('Guest/PersonDetail', [
            'person' => $person,
            'filmography' => $filmography
        ]);
    }

    // ==========================================
    // 9. SEARCH LOGIC (FULL-TEXT SEARCH ENABLED)
    // ==========================================
    public function search(Request $request)
    {
        $queryRaw = trim($request->input('q'));
        $type = $request->input('type', 'multi'); 

        // Validasi input: Jika kosong, return halaman kosong
        if (strlen($queryRaw) < 1) {
            return \Inertia\Inertia::render('Guest/SearchResults', [
                'results' => [],
                'queryParams' => $request->all(),
                'correctedQuery' => null
            ]);
        }

        $clean = str_replace(['"', "'"], '', $queryRaw);
        $ftsKeyword = '"*' . $clean . '*"'; 
        $results = collect([]); 

        // --- A. MOVIE SEARCH (Pake CONTAINS) ---
        if ($type === 'movie' || $type === 'multi') {
            $sqlMovie = "
                SELECT TOP 20 
                    tb.tconst as id,
                    tb.primaryTitle as title,
                    tb.startYear,
                    'movie' as type,
                    tr.averageRating,
                    NULL as poster,
                    NULL as known_for
                FROM title_basics tb
                LEFT JOIN title_ratings tr ON tb.tconst = tr.tconst
                WHERE tb.titleType IN ('movie', 'tvMovie') 
                AND CONTAINS(tb.primaryTitle, ?) 
                ORDER BY tr.numVotes DESC
            ";
            
            // Kita bungkus Try-Catch:
            // Jika FTS error (misal index belum selesai dibuat), dia otomatis fallback ke LIKE biasa
            try {
                $movieData = DB::connection('sqlsrv')->select($sqlMovie, [$ftsKeyword]);
            } catch (\Exception $e) {
                // Fallback ke LIKE (Lambat tapi aman)
                $sqlMovieLike = str_replace('CONTAINS(tb.primaryTitle, ?)', 'tb.primaryTitle LIKE ?', $sqlMovie);
                $movieData = DB::connection('sqlsrv')->select($sqlMovieLike, ['%' . $clean . '%']);
            }
            $results = $results->merge($movieData);
        }

        // --- B. TV SEARCH ---
        if ($type === 'tvSeries' || $type === 'multi') {
            $sqlTV = "
                SELECT TOP 20 
                    tb.tconst as id,
                    tb.primaryTitle as title,
                    tb.startYear,
                    'tvSeries' as type,
                    tr.averageRating,
                    NULL as poster,
                    NULL as known_for
                FROM title_basics tb
                LEFT JOIN title_ratings tr ON tb.tconst = tr.tconst
                WHERE tb.titleType IN ('tvSeries', 'tvMiniSeries') 
                AND CONTAINS(tb.primaryTitle, ?)
                ORDER BY tr.numVotes DESC
            ";
            try {
                $tvData = DB::connection('sqlsrv')->select($sqlTV, [$ftsKeyword]);
            } catch (\Exception $e) {
                $sqlTVLike = str_replace('CONTAINS(tb.primaryTitle, ?)', 'tb.primaryTitle LIKE ?', $sqlTV);
                $tvData = DB::connection('sqlsrv')->select($sqlTVLike, ['%' . $clean . '%']);
            }
            $results = $results->merge($tvData);
        }

        // --- C. PERSON SEARCH ---
        if ($type === 'person' || $type === 'multi') {
                        
            $sqlPerson = "
                SELECT DISTINCT TOP 20
                    nb.nconst as id,
                    nb.primaryName as title,
                    nb.birthYear as startYear,
                    'person' as type,
                    NULL as averageRating,
                    NULL as poster,
                    -- Ambil 1 Profesi saja sebagai label (Subquery = Aman dari Duplikat)
                    (
                        SELECT TOP 1 np.profession_name 
                        FROM name_professions np 
                        WHERE np.nconst = nb.nconst
                    ) as known_for
                FROM name_basics nb
                WHERE CONTAINS(nb.primaryName, ?)
            ";

            try {
                $personData = DB::connection('sqlsrv')->select($sqlPerson, [$ftsKeyword]);
            } catch (\Exception $e) {
                // Fallback jika FTS belum siap
                $sqlPersonLike = str_replace('CONTAINS(nb.primaryName, ?)', 'nb.primaryName LIKE ?', $sqlPerson);
                // Hapus DISTINCT di fallback jika bikin lambat, tapi sebaiknya tetap ada
                $personData = DB::connection('sqlsrv')->select($sqlPersonLike, ['%' . $clean . '%']);
            }
            
            $results = $results->merge($personData);
        }

        $correctedQuery = null;

        if ($results->isEmpty()) {
            
            $candidates = collect([]);

            // A. KANDIDAT JUDUL (FILM & TV)
            // Kita tentukan dulu tipe apa saja yang mau dijadikan kandidat saran
            $searchTitleTypes = [];
            
            if ($type === 'movie' || $type === 'multi') {
                $searchTitleTypes = array_merge($searchTitleTypes, ['movie', 'tvMovie']);
            }
            if ($type === 'tvSeries' || $type === 'multi') {
                $searchTitleTypes = array_merge($searchTitleTypes, ['tvSeries', 'tvMiniSeries']);
            }

            // Ambil kandidat judul (Film/TV)
            if (!empty($searchTitleTypes)) {
                $titleCandidates = DB::connection('sqlsrv')
                    ->table('title_basics as tb')
                    ->leftJoin('title_ratings as tr', 'tb.tconst', '=', 'tr.tconst')
                    ->select('tb.primaryTitle as name', 'tb.tconst as id', DB::raw("'title' as type"))
                    ->whereIn('tb.titleType', $searchTitleTypes)
                    ->orderByRaw('COALESCE(tr.numVotes, 0) DESC') // Prioritas populer
                    ->limit(800) 
                    ->get();
                $candidates = $candidates->merge($titleCandidates);
            }

            // B. KANDIDAT ORANG
            if ($type === 'person' || $type === 'multi') {
                // Cek dulu apakah view Bankability ada isinya
                try {
                    $personCandidates = DB::connection('sqlsrv')
                        ->table('v_Executive_BankabilityReport_Base')
                        ->select('primaryName as name', 'nconst as id', DB::raw("'person' as type"))
                        ->orderBy('TotalNumVotes', 'DESC')
                        ->limit(500)
                        ->get();
                } catch (\Exception $e) {
                    // Fallback ke tabel dasar jika View error/kosong
                    $personCandidates = DB::connection('sqlsrv')
                        ->table('name_basics')
                        ->select('primaryName as name', 'nconst as id', DB::raw("'person' as type"))
                        ->limit(200) // Ambil sampel acak
                        ->get();
                }
                $candidates = $candidates->merge($personCandidates);
            }

            // LOGIKA LEVENSHTEIN
            $closestMatch = null;
            $shortestDistance = -1;

            foreach ($candidates as $item) {
                $inputStr = strtolower($queryRaw);
                $dbStr = strtolower($item->name);
                
                // Optimasi: Jika panjang string beda jauh (>4 huruf), skip aja biar cepet
                if (abs(strlen($inputStr) - strlen($dbStr)) > 4) continue;

                $distance = levenshtein($inputStr, $dbStr);
                
                if ($distance == 0) { $closestMatch = $item; break; }
                
                // Toleransi: Maksimal 4 huruf beda
                if ($distance <= 4 && ($closestMatch === null || $distance < $shortestDistance)) {
                    $closestMatch = $item;
                    $shortestDistance = $distance;
                }
            }

            // 3. JIKA KETEMU TYPO -> CARI ULANG (Re-Search)
            if ($closestMatch) {
                $correctedQuery = $closestMatch->name;
                $newResults = collect([]);
                $cleanFix = str_replace(['"', "'"], '', $correctedQuery);

                // --- SEARCH ULANG: ORANG ---
                if ($closestMatch->type === 'person') {
                    $sqlFixPerson = "SELECT DISTINCT TOP 20 nb.nconst as id, nb.primaryName as title, nb.birthYear as startYear, 'person' as type, NULL as averageRating, NULL as poster, 
                        (SELECT TOP 1 np.profession_name FROM name_professions np WHERE np.nconst = nb.nconst) as known_for
                        FROM name_basics nb WHERE nb.primaryName LIKE ?";
                    $newResults = $newResults->merge(DB::connection('sqlsrv')->select($sqlFixPerson, ['%' . $cleanFix . '%']));
                }
                // --- SEARCH ULANG: JUDUL (MOVIE & TV) ---
                else {
                    // Cek di tabel Movie
                    if ($type === 'movie' || $type === 'multi') {
                        $sqlFixMovie = "SELECT TOP 20 tb.tconst as id, tb.primaryTitle as title, tb.startYear, 'movie' as type, tr.averageRating, NULL as poster, NULL as known_for
                            FROM title_basics tb LEFT JOIN title_ratings tr ON tb.tconst = tr.tconst
                            WHERE tb.titleType IN ('movie', 'tvMovie') AND tb.primaryTitle LIKE ? ORDER BY tr.numVotes DESC";
                        $newResults = $newResults->merge(DB::connection('sqlsrv')->select($sqlFixMovie, ['%' . $cleanFix . '%']));
                    }
                    
                    // Cek di tabel TV (INI PENTING: Jangan lupa di-include)
                    if ($type === 'tvSeries' || $type === 'multi') {
                        $sqlFixTV = "SELECT TOP 20 tb.tconst as id, tb.primaryTitle as title, tb.startYear, 'tvSeries' as type, tr.averageRating, NULL as poster, NULL as known_for
                            FROM title_basics tb LEFT JOIN title_ratings tr ON tb.tconst = tr.tconst
                            WHERE tb.titleType IN ('tvSeries', 'tvMiniSeries') AND tb.primaryTitle LIKE ? ORDER BY tr.numVotes DESC";
                        $newResults = $newResults->merge(DB::connection('sqlsrv')->select($sqlFixTV, ['%' . $cleanFix . '%']));
                    }
                }

                // Timpa hasil kosong dengan hasil baru
                $results = $newResults;
            }
        }

        // Return Inertia
        return \Inertia\Inertia::render('Guest/SearchResults', [
            'results' => $results,
            'queryParams' => $request->all(),
            'correctedQuery' => $correctedQuery,
            'suggestion' => null // Bisa diisi nanti kalau mau
        ]);
    }

    // ==========================================
    // 10. ABOUT PAGE
    // ==========================================
    public function about()
    {
        return \Inertia\Inertia::render('Guest/About');
    }

    // ==========================================
    // API: LIVE SEARCH SUGGESTIONS
    // ==========================================
    public function getSuggestions(Request $request) {
        $query = $request->input('q');
        
        // Jangan cari kalau kurang dari 3 huruf (hemat resource)
        if (strlen($query) < 3) {
            return response()->json([]);
        }

        // Cari Film & TV (Gabungan)
        $results = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->select('tconst', 'primaryTitle', 'startYear', 'titleType', 'averageRating')
            ->where('primaryTitle', 'LIKE', '%' . $query . '%')
            ->orderByDesc('numVotes') // Prioritaskan yang populer
            ->limit(5)
            ->get();

        return response()->json($results);
    }
}

