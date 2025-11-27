<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title->primaryTitle }} - Detail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* --- STYLE PREMIUM (SAMA DENGAN TV SHOW) --- */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: #0F0F0F;
            color: #e0e0e0;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container { max-width: 1000px; margin: 0 auto; }

        .btn-back {
            display: inline-block;
            background: rgba(255,255,255,0.1);
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-bottom: 30px;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-back:hover { background: #06b6d4; border-color: #06b6d4; color: #fff; }

        .detail-wrapper {
            display: flex;
            gap: 40px;
            background: #1a1a1a;
            padding: 30px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* Kolom Poster */
        .poster-col { flex: 0 0 300px; }
        .poster {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover;
        }
        
        /* Kolom Info */
        .info-col { flex: 1; }

        h1 { font-size: 36px; margin-bottom: 5px; color: #fff; line-height: 1.2; }

        .original-title {
            color: #888;
            font-size: 16px;
            margin-bottom: 20px;
            font-style: italic;
        }

        .meta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 25px;
        }

        .badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
        }
        .badge-cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; } /* Tipe */
        .badge-yellow { background: rgba(251, 191, 36, 0.2); color: #fbbf24; } /* Genre */
        .badge-red { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); } /* Dewasa */
        .badge-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; } /* Aman */

        .rating-box {
            display: inline-flex;
            align-items: center;
            background: rgba(255,255,255,0.05);
            padding: 10px 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            gap: 15px;
        }
        .rating-score { font-size: 24px; font-weight: 700; color: #fbbf24; }
        .rating-votes { font-size: 13px; color: #888; }

        .overview-placeholder {
            padding: 20px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            border-left: 3px solid #666;
            color: #aaa;
            font-style: italic;
            margin-bottom: 30px;
        }

        /* Data Grid untuk Info Tambahan */
        .data-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
            background: rgba(0,0,0,0.2);
            padding: 20px;
            border-radius: 12px;
        }
        
        .data-item label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .data-item span { font-size: 15px; color: #fff; font-weight: 500; }

        /* Section Kredit (Sutradara/Penulis) */
        .credits-section {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .credit-row { font-size: 14px; color: #aaa; }
        .credit-row strong { color: #fff; display: inline-block; width: 100px; }

        @media (max-width: 768px) {
            .detail-wrapper { flex-direction: column; }
            .poster-col { flex: 0 0 auto; width: 100%; max-width: 300px; margin: 0 auto; }
            .data-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<div class="container">
    <a href="javascript:history.back()" class="btn-back">← Kembali</a>

    <div class="detail-wrapper">
        
        <div class="poster-col">
            {{-- Menggunakan placeholder text Judul karena IMDb Basic tidak punya URL Poster --}}
            
<img 
    src="https://placehold.co/400x600/222/888?text=Loading..." 
    id="detailPoster" 
    data-imdb-id="{{ $title->tconst }}"
    class="poster" 
    alt="{{ $title->primaryTitle }}"
>
        </div>

        <div class="info-col">
            <h1>{{ $title->primaryTitle }} <span style="font-weight: 300; opacity: 0.7;">({{ $title->startYear }})</span></h1>
            
            @if ($title->originalTitle != $title->primaryTitle)
                <div class="original-title">Judul Asli: {{ $title->originalTitle }}</div>
            @endif

            <div class="meta-tags">
                <span class="badge badge-cyan">{{ strtoupper($title->titleType) }}</span>
                
                <span class="badge {{ $title->isAdult ? 'badge-red' : 'badge-green' }}">
                    {{ $title->isAdult ? '18+ DEWASA' : 'SEMUA UMUR' }}
                </span>

                @if(isset($title->Genres_List))
                    @foreach(explode(',', $title->Genres_List) as $genre)
                        <span class="badge badge-yellow">{{ trim($genre) }}</span>
                    @endforeach
                @endif
            </div>

            <div class="rating-box">
                <div>
                    <div class="rating-score">
                        {{ $title->averageRating ? '★ ' . $title->averageRating : 'N/A' }}
                    </div>
                    <div class="rating-votes">{{ number_format($title->numVotes ?? 0) }} Votes</div>
                </div>
            </div>

            <div class="overview-placeholder">
                Informasi sinopsis lengkap belum tersedia untuk judul ini di database utama. 
                Data di halaman ini diambil dari arsip dasar IMDb.
            </div>

            <div class="data-grid">
                <div class="data-item">
                    <label>Tahun Rilis</label>
                    <span>{{ $title->startYear ?? '-' }}</span>
                </div>
                <div class="data-item">
                    <label>Durasi</label>
                    <span>{{ $title->runtimeMinutes ? $title->runtimeMinutes . ' Menit' : '-' }}</span>
                </div>
            </div>

            <div class="credits-section">
                <div class="credit-row">
                    <strong>Sutradara:</strong> 
                    <span style="color: #e0e0e0;">{{ $title->Directors_List ?? '-' }}</span>
                </div>
                <div class="credit-row">
                    <strong>Penulis:</strong> 
                    <span style="color: #e0e0e0;">{{ $title->Writers_List ?? '-' }}</span>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676';
    
    document.addEventListener('DOMContentLoaded', function() {
        const img = document.getElementById('detailPoster');
        
        // Cek apakah elemen gambar ada
        if (!img) return;

        const imdbId = img.getAttribute('data-imdb-id');

        if (imdbId && TMDB_API_KEY) {
            const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let filePath = null;
                    
                    // Cek di Movie dulu, kalau gak ada cek di TV
                    if (data.movie_results.length > 0) {
                        filePath = data.movie_results[0].poster_path;
                    } else if (data.tv_results.length > 0) {
                        filePath = data.tv_results[0].poster_path;
                    }

                    if (filePath) {
                        // Gunakan w780 agar detail poster terlihat tajam
                        img.src = `https://image.tmdb.org/t/p/w780${filePath}`;
                    } else {
                        // Fallback Text jika tidak ketemu
                        const title = "{{ $title->primaryTitle ?? 'No Image' }}";
                        img.src = `https://placehold.co/400x600/1a1a1a/666?text=${encodeURIComponent(title)}`;
                    }
                })
                .catch(err => console.log(err));
        }
    });
</script>

</body>
</html>