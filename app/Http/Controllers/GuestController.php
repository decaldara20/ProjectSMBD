<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function homepage(Request $request)
    {
        // --- 1. DATA UNTUK FILTER (Dropdown) ---
    // Ambil daftar genre unik dari tabel mapping/genre_types
    $genres = DB::connection('sqlsrv')
        ->table('genre_types')
        ->orderBy('genre_name')
        ->pluck('genre_name');

    // Ambil daftar tahun unik dari title_basics (misal 50 tahun terakhir)
    $years = DB::connection('sqlsrv')
        ->table('title_basics')
        ->select('startYear')
        ->whereNotNull('startYear')
        ->distinct()
        ->orderByDesc('startYear')
        ->limit(50)
        ->pluck('startYear');

    $countries = DB::connection('sqlsrv')
        ->table('origin_country_types')
        ->orderBy('origin_country_name')
        ->pluck('origin_country_name');

    $networks = DB::connection('sqlsrv')
        ->table('network_types')
        ->orderBy('network_name')
        ->pluck('network_name');

    $statuses = DB::connection('sqlsrv')
        ->table('status')
        ->orderBy('status_name')
        ->pluck('status_name');

    $types = DB::connection('sqlsrv')
        ->table('types')
        ->orderBy('type_name')
        ->pluck('type_name');

    // --- 2. DATA UNTUK HERO SECTION (1 Film Unggulan) ---
    // Kita cari 1 film yang ratingnya tinggi dan vote-nya banyak
    $heroMovie = DB::connection('sqlsrv')
        ->table('v_DetailJudulIMDB')
        ->where('primaryTitle', 'Lovely Runner') // Judul Inggris dari 영화는 달린다
        ->orwhere('originalTitle', 'Seonjae eopgo twieo') // Judul Korea dari Lovely Runner
        ->first();

    // Fallback jika Lovely Runner tidak ketemu di DB (Pakai Shawshank)
    if (!$heroMovie) {
        $heroMovie = DB::connection('sqlsrv')
            ->table('v_DetailJudulIMDB')
            ->where('titleType', 'movie')
            ->orderByDesc('averageRating')
            ->first();
    }

    // --- TRIK POSTER MANUAL (Agar Muncul) ---
    // Kita "suntikkan" data poster TMDb ke dalam objek database ini
    if ($heroMovie && ($heroMovie->primaryTitle == 'Lovely Runner' || $heroMovie->originalTitle == 'Seonjae eopgo twieo')) {
        // Poster Path resmi Lovely Runner dari TMDb
        $heroMovie->poster_path = '/7B6kv1aY8d1B2Vjg02c057e930.jpg'; 
        // Backdrop Path (Gambar Lebar untuk background)
        $heroMovie->backdrop_path = '/hQhG9acY2Q0Q3Qz8Jg2x9g3q9.jpg';
        $heroMovie->plot = "Im Sol sangat terpukul dengan kematian mendadak artis favoritnya, Ryu Sun Jae. Namun, dia menemukan dirinya kembali ke masa lalu ke tahun 2008 saat Sun Jae masih berusia 19 tahun. Akankah dia berhasil mengubah takdir tragis mereka?";
    } else {
        // Placeholder Shawshank Redemption
        $heroMovie->poster_path = '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg';
        $heroMovie->plot = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.";
    }

    // --- 3. DATA UNTUK SLIDER 1 (Top Movies) ---
    // Kita gunakan teknik "Ambil ID dulu" agar cepat (seperti pencarian)
    $topMovieIds = DB::connection('sqlsrv')
        ->table('title_ratings as tr')
        ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
        ->where('tb.titleType', 'movie')
        ->orderByDesc('tr.numVotes') // Urutkan berdasarkan popularitas (jumlah vote)
        ->limit(10)
        ->pluck('tb.tconst');

    $topMovies = DB::connection('sqlsrv')
        ->table('v_DetailJudulIMDB')
        ->whereIn('tconst', $topMovieIds)
        ->orderByDesc('numVotes')
        ->get();

    // --- 4. DATA UNTUK SLIDER 2 (Popular TV Shows) ---
    $topShowIds = DB::connection('sqlsrv')
        ->table('title_ratings as tr')
        ->join('title_basics as tb', 'tr.tconst', '=', 'tb.tconst')
        ->where('tb.titleType', 'tvSeries')
        ->orderByDesc('tr.numVotes')
        ->limit(10)
        ->pluck('tb.tconst');

    $topShows = DB::connection('sqlsrv')
        ->table('v_DetailJudulIMDB')
        ->whereIn('tconst', $topShowIds)
        ->orderByDesc('numVotes')
        ->get();

        return view('guest.homepage', compact(
        'heroMovie', 
        'topMovies', 
        'topShows', 
        'genres', 
        'years',
        'countries', 
        'networks', 
        'statuses', 
        'types'
        ));
    }

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
        $tvShow = DB::connection('sqlsrv')
            ->table('v_DetailJudulTvShow')
            ->where('show_id', $show_id)
            ->first();

        if (!$tvShow) {
            return redirect('/')->with('error', 'TV Show tidak ditemukan');
        }

        return view('guest.tv-detail', compact('tvShow'));
    }

    /**
     * LOGIKA PENCARIAN LENGKAP (MOVIE, TV HYBRID, & PERSON)
     */
    public function search(Request $request)
    {
        $queryRaw = trim($request->input('q'));
        $type = $request->input('type', 'multi'); 

        if (!$queryRaw) {
            return redirect('/');
        }

        // --- 1. PRE-PROCESSING STRING ---
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

        // --- 2. EKSEKUSI QUERY ---
        
        $results = collect([]); 

        // === KASUS A: PENCARIAN FILM ===
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
                    NULL as known_for -- Kolom dummy agar struktur sama
                FROM TopMatches tm
                INNER JOIN dbo.v_DetailJudulIMDB v ON tm.tconst = v.tconst
            ";
            
            $movieResults = DB::connection('sqlsrv')->select($sqlMovie, [$searchQuery]);
            $results = $results->merge($movieResults);
        }

        // === KASUS B: PENCARIAN TV SHOW (HYBRID) ===
        if ($type === 'tv' || $type === 'multi') {
            
            // 1. SUMBER UTAMA (View TV Khusus)
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


            // 2. SUMBER CADANGAN (IMDb title_basics)
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

        // === KASUS C: PENCARIAN AKTOR (YANG SEBELUMNYA HILANG) ===
// === KASUS C: PENCARIAN AKTOR (FIXED FTS) ===
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
                
                -- PERUBAHAN PENTING DI SINI:
                FROM dbo.name_basics nb              -- 1. Sumber utama adalah Tabel Asli (yang punya Index)
                INNER JOIN dbo.v_DetailAktor v       -- 2. Kita JOIN ke View untuk ambil data lengkapnya
                    ON nb.nconst = v.nconst
                
                -- 3. Filter CONTAINS diarahkan ke alias 'nb' (Tabel Asli), bukan 'v' (View)
                WHERE CONTAINS(nb.primaryName, ?)
            ";

            // Parameter pencarian tetap sama (menggunakan format wildcard "Ryan*")
            $personResults = DB::connection('sqlsrv')->select($sqlPerson, [$searchQuery]);
            
            $results = $results->merge($personResults);
        }

        // Sorting Gabungan
        // Jika Multi, kita urutkan rating tertinggi dulu (Film/TV), baru Aktor di bawah
        if ($type === 'multi') {
            $results = $results->sortByDesc(function ($item) {
                // Beri prioritas pada item yang punya rating (Film/TV)
                return $item->averageRating ?? -1; 
            })->values();
        }

        return view('guest.search-results', [
            'results' => $results,
            'query' => $queryRaw,
            'type' => $type
        ]);
    }

public function showPersonDetail($nconst) {
        // 1. Ambil Info Aktor (Cepat karena pakai Primary Key)
        $person = DB::connection('sqlsrv')
            ->table('name_basics')
            ->where('nconst', $nconst)
            ->first();

        if (!$person) {
            return redirect('/')->with('error', 'Orang tidak ditemukan');
        }

        // 2. AMBIL FILMOGRAFI (VERSI OPTIMASI PHP)
        // Kita HAPUS 'groupBy' dan 'STRING_AGG' di SQL agar query jadi ringan.
        // Kita ambil data mentah saja.
        
        $rawMovies = DB::connection('sqlsrv')
            ->table('title_principals AS tp')
            ->join('title_basics AS tb', 'tp.tconst', '=', 'tb.tconst')
            ->where('tp.nconst', $nconst)
            ->select('tb.primaryTitle', 'tb.tconst', 'tb.startYear', 'tp.category')
            ->orderByDesc('tb.startYear')
            ->limit(200) // Ambil lebih banyak (200) baris mentah untuk diproses
            ->get();

        // 3. PROSES GROUPING DI PHP (Memori Server Web lebih cepat untuk ini)
        $filmography = $rawMovies->groupBy('tconst')->map(function ($rows) {
            $first = $rows->first();
            // Gabungkan kategori unik (misal: Actor, Writer) jadi satu string
            $categories = $rows->pluck('category')->unique()->implode(', ');
            
            return (object) [
                'tconst' => $first->tconst,
                'primaryTitle' => $first->primaryTitle,
                'startYear' => $first->startYear,
                'category' => $categories // Hasil gabungan
            ];
        })->values()->take(50); // Ambil 50 judul unik teratas

        return view('guest.person-detail', compact('person', 'filmography'));
    }
}