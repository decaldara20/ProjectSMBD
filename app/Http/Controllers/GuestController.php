<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

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

        // ==========================================
        // SLIDER 1: TOP RATED MOVIES (Optimized)
        // ==========================================
        // STEP 1: Ambil ID dulu (Cepat karena Index)
        $topMovieIds = DB::connection('sqlsrv')
            ->table('title_ratings as tr')
            ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
            ->where('tb.titleType', 'movie')
            ->orderByDesc('tr.numVotes')
            ->limit(10)
            ->pluck('tb.tconst');

        // STEP 2: Ambil Detail Lengkap berdasarkan ID tadi
        $topMovies = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->whereIn('tconst', $topMovieIds)
            ->orderByDesc('numVotes')
            ->get();

        // ==========================================
        // SLIDER 2: POPULAR TV SHOWS (Optimized)
        // ==========================================
        // STEP 1: Ambil ID dari tabel fisik 'shows' (bukan View)
        $topShowIds = DB::connection('sqlsrv')
            ->table('shows') 
            ->orderByDesc('popularity')
            ->limit(10)
            ->pluck('show_id');

        // STEP 2: Ambil Detail dari View
        $topShows = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->whereIn('show_id', $topShowIds)
            ->orderByDesc('popularity')
            ->get();

        // Inject poster path null (untuk diproses JS di frontend nanti)
        foreach($topShows as $show) {
            $show->poster_path = null;
        }

        // ==========================================
        // SLIDER 3: TOP ARTISTS
        // ==========================================
        $topArtists = DB::connection('sqlsrv')
            ->table('v_Executive_BankabilityReport_Base')
            ->orderByDesc('TotalNumVotes')
            ->limit(10)
            ->get();

        foreach($topArtists as $artist) {
            $artist->profile_path = null; 
        }

        // ==========================================
        // RETURN KE REACT (INERTIA)
        // ==========================================
        return Inertia::render('Guest/Homepage', [
            // 'heroMovie'  => $heroMovie,
            'topMovies'  => $topMovies,
            'topShows'   => $topShows,
            'topArtists' => $topArtists,
            
            // Semua filter dikirim dalam satu object
            'filters' => [
                'genres'    => $genres,
                'years'     => $years,
                'countries' => $countries,
                'networks'  => $networks,
                'statuses'  => $statuses,
                'types'     => $types
            ]
        ]);
    }

// // --- 3. DATA UNTUK SLIDER 1 (Top Movies) ---
//     // STEP 1: Ambil 10 ID film terpopuler (Super Cepat karena Index)
//     $topMovieIds = DB::connection('sqlsrv')
//         ->table('title_ratings as tr')
//         ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
//         ->where('tb.titleType', 'movie')
//         ->orderByDesc('tr.numVotes')
//         ->limit(10)
//         ->pluck('tb.tconst'); // Hanya ambil ID

//     // STEP 2: Ambil Detail Lengkap berdasarkan ID tadi
//     $topMovies = DB::connection('sqlsrv')
//         ->table('v_DetailJudulIMDB')
//         ->whereIn('tconst', $topMovieIds)
//         ->orderByDesc('numVotes') // Urutkan ulang sesuai ID
//         ->get();

// // --- 4. DATA UNTUK SLIDER 2 (Popular TV Shows) ---
//     // STEP 1: Ambil 10 ID TV terpopuler dari tabel BASE (bukan View)
//     $topShowIds = DB::connection('sqlsrv')
//         ->table('shows') // Langsung ke tabel fisik, jangan ke View dulu
//         ->orderByDesc('popularity')
//         ->limit(10)
//         ->pluck('show_id');

//     // STEP 2: Ambil Detail dari View
//     $topShows = DB::connection('sqlsrv')
//         ->table('v_DetailJudulTvShow')
//         ->whereIn('show_id', $topShowIds)
//         ->orderByDesc('popularity')
//         ->get();

//         // Inject poster path null untuk JS
//         foreach($topShows as $show) {
//             $show->poster_path = null;
//         }

//         // E. SLIDER 3: TOP ARTISTS
//         // Ambil dari View Bankability (Top 10 Artis Paling Populer/Banyak Vote)
//         $topArtists = DB::connection('sqlsrv')
//             ->table('v_Executive_BankabilityReport_Base')
//             ->orderByDesc('TotalNumVotes')
//             ->limit(10)
//             ->get();

//         // Tambahkan properti profile_path kosong (biar view gak error saat manggil API nanti)
//         foreach($topArtists as $artist) {
//             $artist->profile_path = null; 
//         }
        
//         return view('guest.homepage', compact(
//             // 'heroMovie', 
//             'topMovies', 
//             'topShows',
//             'topArtists', 
//             'genres', 
//             'years',
//             'countries', 
//             'networks', 
//             'statuses', 
//             'types'
//         ));
//     }

    // ==========================================
    // 2. EXPLORE PAGE (GABUNGAN FILM + TV)
    // ==========================================
    public function explore(Request $request)
    {
        // 1. QUERY A: Film dari IMDb
        $films = DB::connection('sqlsrv')->table('v_DetailJudulIMDB')
            ->select(
                'tconst', 
                'primaryTitle as title',
                'averageRating',
                'startYear',
                'titleType',
                'Genres_List as genres'
            );
            // ->whereIn('titleType', ['movie', 'short', 'tvMovie']); // Filter biar yang muncul film aja

        // 2. QUERY B: TV dari Dataset TV
        $tvs = DB::connection('sqlsrv')->table('v_DetailJudulTvShow')
            ->select(
                DB::raw("CAST(show_id AS VARCHAR(20)) as tconst"), 
                'primaryTitle as title',
                'averageRating',
                DB::raw("YEAR(startYear) as startYear"),
                DB::raw("'tvSeries' as titleType"),
                'Genres_List as genres'
            );

        // 3. GABUNGKAN (UNION ALL lebih cepat dari UNION)
        $combined = DB::connection('sqlsrv')
            ->query()
            ->fromSub($films->unionAll($tvs), 'catalog_union');

        // 4. FILTERING
        if ($request->has('q') && $request->q != '') {
            $combined->where('title', 'LIKE', '%' . $request->q . '%');
        }

        // Filter Type (Movie / TV)
        if ($request->has('type') && $request->type != 'multi') {
            $combined->where('titleType', $request->type);
        }

        // 5. SORTING & PAGINATION
        // Sort by Rating tertinggi & Tahun terbaru
        $items = $combined->orderByDesc('startYear')
                            ->orderByDesc('averageRating')
                            ->paginate(24)
                            ->withQueryString();

        // 6. DATA PENDUKUNG
        $genres = DB::connection('sqlsrv')
        ->table('genre_types')
        ->orderBy('genre_name')
        ->pluck('genre_name');

        return \Inertia\Inertia::render('Guest/Explore', [
            'items' => $items,
            'filters' => $request->all(),
            'genres' => $genres
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
    
    // public function films(Request $request) {
    //     $genres = DB::connection('sqlsrv')
    //         ->table('genre_types')
    //         ->orderBy('genre_name')
    //         ->pluck('genre_name');

    //     // Query Dasar: Ambil Film
    //     $query = DB::connection('sqlsrv')
    //         ->table('v_DetailJudulIMDB');

    //     $query->whereIn('titleType', [
    //         'movie', 
    //         'short', 
    //         'tvMovie', 
    //         'video', 
    //         'tvSpecial', 
    //         'videoGame',
    //         'tvShort',
    //     ]);

    //     // Filter: Genre (Jika ada di URL ?genre=Action)
    //     if ($request->has('genre') && $request->genre != '') {
    //         $query->where('Genres_List', 'LIKE', '%' . $request->genre . '%');
    //     }

    //     // Sorting: Default berdasarkan Popularitas (Votes)
    //     $query->orderByDesc('numVotes');

    //     // Ambil Data dengan Pagination (18 film per halaman)
    //     $films = $query->paginate(18);

    //     // Inject Poster Dummy untuk tampilan (Karena DB lokal tidak ada gambar)
    //     foreach($films as $film) {
    //         $film->poster_path = null;
    //     }

    //     return view('guest.films', compact('films', 'genres'));
    // }

    // ==========================================
    // 4. TV SHOWS CATALOG PAGE
    // ==========================================
    public function tvShows(Request $request) {
        // Query Dasar
        $query = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->select(
                'show_id as tconst',    // Alias ke tconst agar konsisten di Frontend
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
    
    // public function tvShows(Request $request) {
    //     // Ambil Data TV Shows dengan Pagination
    //     // Ganti nama kolomnya biar seragam dengan format 'Movie'
    //     $query = DB::connection('sqlsrv')
    //         ->table('v_DetailJudulTvShow')
    //         ->select(
    //             'show_id as tconst',    // Kita tetap butuh ini jadi 'tconst' buat View Blade
    //             'primaryTitle',         // GUNAKAN INI (Jangan 'name', karena di View namanya sudah primaryTitle)
    //             'averageRating',        // GUNAKAN INI (Jangan 'vote_average')
    //             'startYear',            // GUNAKAN INI (Jangan 'first_air_date')
    //             'popularity'
    //         );

    //     // Sorting: Default berdasarkan Popularitas
    //     $query->orderByDesc('popularity');

    //     // Ambil Data (18 per halaman)
    //     $tvShows = $query->paginate(18);

    //     return view('guest.tv-shows', compact('tvShows'));
    // }

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
    
    // public function artists(Request $request) {
    //     // 1. Mulai Query dari View Bankabilitas (karena sudah ada ranking popularitas)
    //     $query = DB::connection('sqlsrv')
    //         ->table('v_Executive_BankabilityReport_Base as v')
    //         ->select('v.nconst', 'v.primaryName', 'v.TotalNumVotes');

    //     // 2. Filter Berdasarkan Profesi (Jika ada request ?profession=actor)
    //     if ($request->has('profession') && $request->profession != '') {
    //         $prof = $request->profession;
            
    //         // Tips: Jika user cari 'actor', kita cari juga 'actress'
    //         $searchProfs = ($prof == 'actor') ? ['actor', 'actress'] : [$prof];

    //         // Filter menggunakan WHERE EXISTS ke tabel name_professions
    //         // (Ini lebih cepat daripada JOIN langsung untuk filter)
    //         $query->whereExists(function ($subquery) use ($searchProfs) {
    //             $subquery->select(DB::raw(1))
    //                 ->from('name_professions as np')
    //                 ->whereColumn('np.nconst', 'v.nconst')
    //                 ->whereIn('np.profession_name', $searchProfs);
    //         });
    //     }

    //     // 3. Filter Pencarian Nama (Search Bar di halaman Artists)
    //     if ($request->has('q') && $request->q != '') {
    //         $query->where('v.primaryName', 'LIKE', '%' . $request->q . '%');
    //     }

    //     // 4. Sorting Default (Paling Populer)
    //     $query->orderByDesc('v.TotalNumVotes');

    //     // 5. Pagination
    //     $artists = $query->paginate(24);

    //     // Inject placeholder gambar
    //     foreach($artists as $artist) {
    //         $artist->profile_path = null;
    //     }

    //     // Kirim juga variabel 'profession' ke view untuk judul halaman
    //     $currentProfession = $request->profession ?? 'All';

    //     return view('guest.artists', compact('artists', 'currentProfession'));
    // }

    // =======================================
    // 6. HISTORY MANAGEMENT
    // =======================================
    private function addToHistory($type, $id, $title, $year, $rating)
    {
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
    
    // private function addToHistory($type, $id, $title, $year, $rating)
    // {
    //     $history = session()->get('view_history', []);

    //     // 1. Hapus item jika sudah ada (biar tidak duplikat & naik ke paling atas)
    //     $history = array_filter($history, function($item) use ($id, $type) {
    //         return !($item['id'] == $id && $item['type'] == $type);
    //     });

    //     // 2. Tambahkan item baru ke awal array
    //     array_unshift($history, [
    //         'type' => $type, // 'movie', 'tv', 'person'
    //         'id' => $id,
    //         'title' => $title,
    //         'year' => $year,
    //         'rating' => $rating,
    //         'timestamp' => now()
    //     ]);

    //     // 3. Batasi cuma simpan 20 item terakhir
    //     $history = array_slice($history, 0, 20);

    //     // 4. Simpan kembali ke session
    //     session()->put('view_history', $history);
    // }

    // // Halaman History
    // public function history()
    // {
    //     // Ambil data dari session
    //     $history = session()->get('view_history', []);
        
    //     // Ubah array jadi Collection biar enak di-looping di Blade
    //     $history = collect($history)->map(function($item) {
    //         return (object) $item;
    //     });

    //     return view('guest.history', compact('history'));
    // }

    // // Hapus History
    // public function clearHistory()
    // {
    //     session()->forget('view_history');
    //     return redirect()->route('history.index')->with('success', 'Riwayat penelusuran dihapus.');
    // }

    // // Hapus Satu Item History
    // public function removeHistoryItem(Request $request)
    // {
    //     $history = session()->get('view_history', []);
    //     $id = $request->input('id');
    //     $type = $request->input('type');

    //     // Filter array untuk membuang item yang cocok
    //     $history = array_filter($history, function($item) use ($id, $type) {
    //         return !($item['id'] == $id && $item['type'] == $type);
    //     });

    //     // Re-index array agar urutan rapi
    //     session()->put('view_history', array_values($history));

    //     return back()->with('success', 'Item dihapus dari riwayat.');
    // }

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

    // Menampilkan Halaman Favorit
    // public function favorites()
    // {
    //     // Ambil data dari session 'favorites'
    //     $favorites = session()->get('favorites', []);
        
    //     // Ubah array jadi Collection object biar mudah di-loop di Blade
    //     $favorites = collect($favorites)->map(function($item) {
    //         return (object) $item;
    //     });

    //     return view('guest.favorites', compact('favorites'));
    // }

    // // Logic Tambah/Hapus Favorit
    // public function toggleFavorite(Request $request)
    // {
    //     $favorites = session()->get('favorites', []);
    //     $id = $request->id;
    //     $type = $request->type;
        
    //     // Cek apakah item sudah ada di favorit?
    //     $exists = false;
    //     $index = -1;
        
    //     foreach($favorites as $key => $item) {
    //         if ($item['id'] == $id && $item['type'] == $type) {
    //             $exists = true;
    //             $index = $key;
    //             break;
    //         }
    //     }

    //     if ($exists) {
    //         // Jika sudah ada, HAPUS (Un-favorite)
    //         unset($favorites[$index]);
    //         $message = 'Dihapus dari Favorit.';
    //     } else {
    //         // Jika belum ada, TAMBAH
    //         $favorites[] = [
    //             'id' => $id,
    //             'type' => $type,
    //             'title' => $request->title,
    //             'year' => $request->year,
    //             'rating' => $request->rating,
    //             'timestamp' => now()
    //         ];
    //         $message = 'Ditambahkan ke Favorit.';
    //     }

    //     // Simpan kembali ke session (re-index array values)
    //     session()->put('favorites', array_values($favorites));

    //     return back()->with('success', $message);
    // }

    // =========================================================================
    // 8. DETAIL PAGES (Film, TV, Person)
    // =========================================================================
    public function showTitleDetail($tconst) {
        $title = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->where('tconst', $tconst)
            ->first();

        if (!$title) {
            return redirect('/')->with('error', 'Judul tidak ditemukan');
        }

        // Simpan ke History (Server Side Session)
        $this->addToHistory('movie', $title->tconst, $title->primaryTitle, $title->startYear, $title->averageRating);

        // Render React Component
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
        // 1. AMBIL INFO ARTIS
        $person = DB::connection('sqlsrv')
            ->table('v_DetailAktor')
            ->where('nconst', $nconst)
            ->first();

        // Fallback jika tidak ada di View
        if (!$person) {
            $personRaw = DB::connection('sqlsrv')->table('name_basics')->where('nconst', $nconst)->first();
            if (!$personRaw) return redirect('/')->with('error', 'Orang tidak ditemukan');

            $person = $personRaw;
            $person->profession = $personRaw->primaryProfession ?? 'Artist';
            $person->known_for_titles = $personRaw->knownForTitles ?? '';
        }

        // 2. HITUNG TOTAL KREDIT
        $totalCredits = DB::connection('sqlsrv')
            ->table('title_principals')
            ->where('nconst', $nconst)
            ->count();
        
        $person->Total_Credits = $totalCredits;

        // 3. AMBIL FILMOGRAFI (Detail Film)
        $rawMovies = DB::connection('sqlsrv')
            ->table('title_principals AS tp')
            ->join('title_basics AS tb', 'tp.tconst', '=', 'tb.tconst')
            ->where('tp.nconst', $nconst)
            ->select('tb.primaryTitle', 'tb.tconst', 'tb.startYear', 'tp.category')
            ->orderByDesc('tb.startYear')
            ->limit(100)
            ->get();

        // Grouping agar rapi di JSON
        $filmography = $rawMovies->groupBy('tconst')->map(function ($rows) {
            $first = $rows->first();
            $categories = $rows->pluck('category')->unique()->implode(', ');
            return [
                'tconst' => $first->tconst,
                'primaryTitle' => $first->primaryTitle,
                'startYear' => $first->startYear,
                'category' => $categories
            ];
        })->values();

        $person->profile_path = null;

        // Simpan ke History (Khusus Person)
        $this->addToHistory('person', $nconst, $person->primaryName, null, null);

        // Render React Component
        return Inertia::render('Guest/PersonDetail', [
            'person' => $person,
            'filmography' => $filmography // Kirim data filmografi juga jika mau dipakai di React nanti
        ]);
    }

    // public function showTitleDetail($tconst) {
    //     $title = DB::connection('sqlsrv')
    //         ->table('v_DetailJudulIMDB')
    //         ->where('tconst', $tconst)
    //         ->first();

    //     if (!$title) {
    //         return redirect('/')->with('error', 'Judul tidak ditemukan');
    //     }

    //     $this->addToHistory('movie', $title->tconst, $title->primaryTitle, $title->startYear, $title->averageRating);

    //     return view('guest.title-detail', compact('title'));
    // }

    // public function showTvDetail($show_id) {
    //     // Cek apakah ID formatnya 'tt...' (IMDb ID) -> Alihkan ke Detail Generic
    //     if (str_starts_with($show_id, 'tt')) {
    //         return $this->showTitleDetail($show_id);
    //     }

    //     // Jika ID Angka -> Cari di View TV Premium
    //     $tvShow = DB::connection('sqlsrv')
    //         ->table('v_DetailJudulTvShow')
    //         ->where('show_id', $show_id)
    //         ->first();

    //     if (!$tvShow) {
    //         return redirect('/')->with('error', 'TV Show tidak ditemukan');
    //     }

    //     $this->addToHistory(
    //         'tv', 
    //         $tvShow->show_id, 
    //         $tvShow->primaryTitle, 
    //         $tvShow->startYear ? \Carbon\Carbon::parse($tvShow->startYear)->format('Y') : 'N/A', 
    //         $tvShow->averageRating
    //     );

    //     $tvShow->poster_path = null;
    //     $tvShow->backdrop_path = null;
        
    //     return view('guest.tv-detail', compact('tvShow'));
    // }

    // public function showPersonDetail($nconst) {
    //     // 1. AMBIL INFO ARTIS
    //     // Coba ambil dari View v_DetailAktor (yang baru dibuat)
    //     $person = DB::connection('sqlsrv')
    //         ->table('v_DetailAktor')
    //         ->where('nconst', $nconst)
    //         ->first();

    //     // Fallback ke tabel mentah jika View belum update/kosong
    //     if (!$person) {
    //         $personRaw = DB::connection('sqlsrv')->table('name_basics')->where('nconst', $nconst)->first();
    //         if (!$personRaw) return redirect('/')->with('error', 'Orang tidak ditemukan');

    //         // Buat objek manual biar View gak error
    //         $person = $personRaw;
    //         $person->profession = $personRaw->primaryProfession ?? 'Artist';
    //         $person->known_for_titles = $personRaw->knownForTitles ?? '';
    //     }

    //     // 2. HITUNG TOTAL KREDIT (Karena v_DetailAktor gak punya kolom ini)
    //     // Hitung berapa banyak film yang dia bintangi di title_principals
    //     $totalCredits = DB::connection('sqlsrv')
    //         ->table('title_principals')
    //         ->where('nconst', $nconst)
    //         ->count();
        
    //     // Masukkan ke objek $person agar bisa dipanggil di View
    //     $person->Total_Credits = $totalCredits;

    //     // 3. AMBIL FILMOGRAFI (Detail Film)
    //     $rawMovies = DB::connection('sqlsrv')
    //         ->table('title_principals AS tp')
    //         ->join('title_basics AS tb', 'tp.tconst', '=', 'tb.tconst')
    //         ->where('tp.nconst', $nconst)
    //         ->select('tb.primaryTitle', 'tb.tconst', 'tb.startYear', 'tp.category')
    //         ->orderByDesc('tb.startYear')
    //         ->limit(100) // Ambil 100 judul terbaru
    //         ->get();

    //     // Grouping agar judul yang sama tidak muncul dobel (misal: jadi Actor & Writer di 1 film)
    //     $filmography = $rawMovies->groupBy('tconst')->map(function ($rows) {
    //         $first = $rows->first();
    //         $categories = $rows->pluck('category')->unique()->implode(', ');
    //         return (object) [
    //             'tconst' => $first->tconst,
    //             'primaryTitle' => $first->primaryTitle,
    //             'startYear' => $first->startYear,
    //             'category' => $categories
    //         ];
    //     })->values();

    //     // Inject null untuk foto profil (akan diisi JS)
    //     $person->profile_path = null;

    //     return view('guest.person-detail', compact('person', 'filmography'));
    // }

    // =========================================================================
    // 9. SEARCH LOGIC (LENGKAP)
    // =========================================================================
    public function search(Request $request)
    {
        $queryRaw = trim($request->input('q'));
        $type = $request->input('type', 'multi'); 

        if (!$queryRaw) {
            return redirect('/');
        }

        // --- PRE-PROCESSING ---
        $cleanQuery = str_replace(['"', "'", '%'], '', $queryRaw);
        $searchParam = '%' . $cleanQuery . '%';

        $results = collect([]); 

        // KASUS A: PENCARIAN FILM
        if ($type === 'movie' || $type === 'multi') {
            $sqlMovie = "
                SELECT TOP 20 
                    v.tconst as id,
                    v.primaryTitle as title,
                    v.startYear,
                    'movie' as type,
                    v.averageRating,
                    'https://placehold.co/300x450/222/FFF?text=' + REPLACE(LEFT(v.primaryTitle, 15), ' ', '+') as poster,
                    NULL as known_for
                FROM dbo.v_DetailJudulIMDB v
                WHERE v.primaryTitle LIKE ? 
                AND v.titleType IN ('movie', 'short', 'tvMovie')
                ORDER BY v.numVotes DESC
            ";
            $movieResults = DB::connection('sqlsrv')->select($sqlMovie, [$searchParam]);
            $results = $results->merge($movieResults);
        }

        // KASUS B: PENCARIAN TV SHOW
        if ($type === 'tvSeries' || $type === 'multi') {
            $sqlTV = "
                SELECT TOP 20 
                    CAST(v.show_id as VARCHAR(20)) as id,
                    v.primaryTitle as title,
                    v.startYear,
                    'tvSeries' as type,
                    v.averageRating,
                    'https://placehold.co/300x450/222/FFF?text=' + REPLACE(LEFT(v.primaryTitle, 15), ' ', '+') as poster,
                    NULL as known_for
                FROM dbo.v_DetailJudulTvShow v
                WHERE v.primaryTitle LIKE ? 
                ORDER BY v.popularity DESC
            ";
            $tvResults = DB::connection('sqlsrv')->select($sqlTV, [$searchParam]);
            $results = $results->merge($tvResults);
        }

        // KASUS C: PENCARIAN AKTOR
        if ($type === 'person' || $type === 'multi') {
            $sqlPerson = "
                SELECT TOP 20
                    v.nconst as id,
                    v.primaryName as title,
                    v.TotalNumVotes, 
                    'person' as type,
                    NULL as averageRating,
                    'https://placehold.co/300x450/333/FFF?text=' + REPLACE(LEFT(v.primaryName, 10), ' ', '+') as poster,
                    (SELECT TOP 1 profession_name FROM name_professions WHERE nconst = v.nconst) as known_for
                FROM dbo.v_Executive_BankabilityReport_Base v
                WHERE v.primaryName LIKE ?
                ORDER BY v.TotalNumVotes DESC
            ";
            $personResults = DB::connection('sqlsrv')->select($sqlPerson, [$searchParam]);
            $results = $results->merge($personResults);
        }

        // Sorting
        if ($type === 'multi') {
            $results = $results->sortByDesc(function ($item) {
                return $item->averageRating ?? ($item->TotalNumVotes ?? 0); 
            })->values();
        }

        // --- LOGIKA PENCATATAN (REAL DATA) ---
        // Simpan ke database 'search_logs'
        if ($queryRaw && strlen($queryRaw) > 2) { // Hanya catat jika > 2 huruf
            DB::table('search_logs')->insert([
                'keyword' => strtolower($queryRaw), // Simpan huruf kecil biar gampang dikelompokkan
                'results_count' => $results->count(),
                'ip_address' => $request->ip(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Return Inertia
        return \Inertia\Inertia::render('Guest/SearchResults', [
            'results' => $results,
            'queryParams' => $request->all(),
        ]);
    }

    // public function search(Request $request)
    // {
    //     $queryRaw = trim($request->input('q'));
    //     $type = $request->input('type', 'multi'); 

    //     if (!$queryRaw) {
    //         return redirect('/');
    //     }

    //     // --- PRE-PROCESSING STRING ---
    //     $cleanQuery = str_replace(['"', "'"], '', $queryRaw);
    //     $words = array_filter(explode(' ', $cleanQuery));
    //     $formattedWords = [];
    //     $numWords = count($words);
    //     $currentIndex = 0;

    //     foreach ($words as $word) {
    //         $word = trim($word);
    //         $currentIndex++;
    //         $isLastWord = ($currentIndex === $numWords);
    //         if ($isLastWord) {
    //             $formattedWords[] = '"' . $word . '*"';
    //         } else {
    //             if (strlen($word) > 2) {
    //                 $formattedWords[] = '"' . $word . '"';
    //             }
    //         }
    //     }
    //     if (empty($formattedWords)) {
    //          $formattedWords[] = '"' . end($words) . '*"';
    //     }
    //     $searchQuery = implode(' AND ', $formattedWords);

    //     // --- EKSEKUSI QUERY ---
    //     $results = collect([]); 

    //     // KASUS A: PENCARIAN FILM
    //     if ($type === 'movie' || $type === 'multi') {
    //         $sqlMovie = "
    //             WITH TopMatches AS (
    //                 SELECT TOP 20 tb.tconst, tr.numVotes
    //                 FROM dbo.title_basics tb
    //                 INNER JOIN dbo.title_ratings tr ON tb.tconst = tr.tconst
    //                 WHERE CONTAINS(tb.primaryTitle, ?) AND tb.titleType = 'movie'
    //                 ORDER BY tr.numVotes DESC
    //             )
    //             SELECT 
    //                 v.tconst as id,
    //                 v.primaryTitle as title,
    //                 v.startYear,
    //                 'movie' as type,
    //                 v.averageRating,
    //                 'https://placehold.co/300x450?text=' + REPLACE(LEFT(v.primaryTitle, 15), ' ', '+') as poster,
    //                 NULL as known_for
    //             FROM TopMatches tm
    //             INNER JOIN dbo.v_DetailJudulIMDB v ON tm.tconst = v.tconst
    //         ";
            
    //         $movieResults = DB::connection('sqlsrv')->select($sqlMovie, [$searchQuery]);
    //         $results = $results->merge($movieResults);
    //     }

    //     // KASUS B: PENCARIAN TV SHOW (HYBRID)
    //     if ($type === 'tv' || $type === 'multi') {
    //         // 1. Utama (TV Lokal)
    //         $sqlTV_Main = "
    //             SELECT TOP 20 
    //                 v.show_id as id,
    //                 v.primaryTitle as title,
    //                 v.startYear,
    //                 'tvSeries' as type,
    //                 v.averageRating,
    //                 'https://image.tmdb.org/t/p/w500' + v.homepage as poster,
    //                 NULL as known_for
    //             FROM dbo.v_DetailJudulTvShow v
    //             WHERE v.primaryTitle LIKE ?
    //             ORDER BY v.popularity DESC
    //         ";
    //         $tvParam = '%' . $cleanQuery . '%';
    //         $mainTvResults = DB::connection('sqlsrv')->select($sqlTV_Main, [$tvParam]);
    //         $results = $results->merge($mainTvResults);

    //         // 2. Backup (IMDb)
    //         $sqlTV_Backup = "
    //             SELECT TOP 20 
    //                 tb.tconst as id,
    //                 tb.primaryTitle as title,
    //                 tb.startYear,
    //                 'tvSeries_imdb' as type,
    //                 tr.averageRating,
    //                 'https://placehold.co/300x450?text=' + REPLACE(LEFT(tb.primaryTitle, 15), ' ', '+') as poster,
    //                 NULL as known_for
    //             FROM dbo.title_basics tb
    //             LEFT JOIN dbo.title_ratings tr ON tb.tconst = tr.tconst
    //             WHERE CONTAINS(tb.primaryTitle, ?) 
    //               AND tb.titleType IN ('tvSeries', 'tvMiniSeries')
    //             ORDER BY tr.numVotes DESC
    //         ";
    //         $backupTvResults = DB::connection('sqlsrv')->select($sqlTV_Backup, [$searchQuery]);
    //         $results = $results->merge($backupTvResults);
    //     }

    //     // KASUS C: PENCARIAN AKTOR (FIXED FTS)
    //     if ($type === 'person' || $type === 'multi') {
    //         $sqlPerson = "
    //             SELECT TOP 20
    //                 v.nconst as id,
    //                 v.primaryName as title,
    //                 v.birthYear as startYear,
    //                 'person' as type,
    //                 NULL as averageRating,
    //                 'https://placehold.co/300x450/333/FFF?text=' + REPLACE(LEFT(v.primaryName, 10), ' ', '+') as poster,
    //                 v.known_for_titles as known_for
    //             FROM dbo.name_basics nb
    //             INNER JOIN dbo.v_DetailAktor v ON nb.nconst = v.nconst
    //             WHERE CONTAINS(nb.primaryName, ?)
    //         ";
    //         $personResults = DB::connection('sqlsrv')->select($sqlPerson, [$searchQuery]);
    //         $results = $results->merge($personResults);
    //     }

    //     // Sorting
    //     if ($type === 'multi') {
    //         $results = $results->sortByDesc(function ($item) {
    //             return $item->averageRating ?? -1; 
    //         })->values();
    //     }

    //     return view('guest.search-results', [
    //         'results' => $results,
    //         'query' => $queryRaw,
    //         'type' => $type
    //     ]);
    // }

    // ==========================================
    // 10. ABOUT PAGE
    // ==========================================
    public function about()
    {
        return \Inertia\Inertia::render('Guest/About');
    }
}