<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $tvShow->primaryTitle }} - Detail TV</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* --- Setup Dasar --- */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: #0F0F0F;
            color: #e0e0e0;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container { max-width: 1000px; margin: 0 auto; }

        /* --- Tombol Kembali --- */
        .btn-back {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-bottom: 30px;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-back:hover { background: #06b6d4; border-color: #06b6d4; color: #fff; }

        /* --- Layout Detail --- */
        .detail-wrapper {
            display: flex;
            gap: 40px;
            background: #1a1a1a;
            padding: 30px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* --- Kolom Kiri (Poster) --- */
        .poster-col {
            flex: 0 0 300px;
        }
        .poster {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover;
        }
        
        /* --- Kolom Kanan (Info) --- */
        .info-col { flex: 1; }

        h1 {
            font-size: 36px;
            margin-bottom: 5px;
            color: #fff;
            line-height: 1.2;
        }

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
        .badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .badge-cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }
        .badge-yellow { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

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

        /* --- Data List --- */
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

        .overview {
            line-height: 1.8;
            color: #ccc;
            margin-bottom: 30px;
            font-size: 15px;
        }

        .creators {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 20px;
            font-size: 14px;
            color: #aaa;
        }
        .creators span { color: #fff; font-weight: 600; }

        /* Responsive */
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

<div class="poster-col">
    {{-- REVISI: Gunakan Placeholder Loading & ID TMDB agar JavaScript yang mengisinya --}}
    <img 
        src="https://placehold.co/400x600/222/888?text=Loading..." 
        id="tvPoster"
        data-tmdb-id="{{ $tvShow->show_id }}" 
        class="poster" 
        alt="{{ $tvShow->primaryTitle }}"
    >
</div>

        <div class="info-col">
            <h1>{{ $tvShow->primaryTitle }}</h1>
            <div class="original-title">Judul Asli: {{ $tvShow->original_name }}</div>

            <div class="meta-tags">
                <span class="badge badge-cyan">TV SERIES</span>
                
                @if($tvShow->status_name)
                    <span class="badge badge-blue">{{ $tvShow->status_name }}</span>
                @endif
                
                @if($tvShow->isAdult)
                    <span class="badge" style="background: #ef4444; color: white;">18+</span>
                @endif

                @if($tvShow->Genres_List)
                    @foreach(explode(',', $tvShow->Genres_List) as $genre)
                        <span class="badge badge-yellow" style="color: #fff; background: rgba(255,255,255,0.1)">{{ trim($genre) }}</span>
                    @endforeach
                @endif
            </div>

            <div class="rating-box">
                <div>
                    <div class="rating-score">★ {{ number_format($tvShow->averageRating, 1) }}</div>
                    <div class="rating-votes">{{ number_format($tvShow->numVotes) }} Votes</div>
                </div>
                <div style="border-left: 1px solid #444; height: 30px;"></div>
                <div>
                    <div style="font-size: 18px; font-weight: 600; color: #fff;">
                        {{ number_format($tvShow->popularity, 0) }}
                    </div>
                    <div class="rating-votes">Popularity</div>
                </div>
            </div>

            <p class="overview">
                {{ $tvShow->overview ? $tvShow->overview : 'Belum ada sinopsis untuk serial TV ini.' }}
            </p>

            <div class="data-grid">
                <div class="data-item">
                    <label>Tahun Tayang</label>
                    <span>
                        {{ $tvShow->startYear ? \Carbon\Carbon::parse($tvShow->startYear)->format('Y') : '-' }} 
                        - 
                        {{ $tvShow->endYear ? \Carbon\Carbon::parse($tvShow->endYear)->format('Y') : 'Sekarang' }}
                    </span>
                </div>
                <div class="data-item">
                    <label>Total Episode</label>
                    <span>{{ $tvShow->number_of_episodes ?? '-' }} Eps ({{ $tvShow->number_of_seasons ?? '-' }} Seasons)</span>
                </div>
                <div class="data-item">
                    <label>Durasi per Eps</label>
                    <span>{{ $tvShow->episode_run_time ?? '-' }} Menit</span>
                </div>
                <div class="data-item">
                    <label>Bahasa</label>
                    <span>{{ $tvShow->Languages_List ?? '-' }}</span>
                </div>
            </div>

            @if($tvShow->Creators_List)
            <div class="creators">
                Dibuat oleh: <span>{{ $tvShow->Creators_List }}</span>
            </div>
            @endif

            </div>
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676';
    
    document.addEventListener('DOMContentLoaded', function() {
        const img = document.getElementById('tvPoster');
        const tmdbId = img.getAttribute('data-tmdb-id');

        if (tmdbId && TMDB_API_KEY) {
            // Endpoint Get TV Details (Langsung pakai ID angka)
            const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`;

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    if (data.poster_path) {
                        // Gunakan w780 (High Quality)
                        img.src = `https://image.tmdb.org/t/p/w780${data.poster_path}`;
                    } else {
                        // Fallback
                        const title = "{{ $tvShow->primaryTitle }}";
                        img.src = `https://placehold.co/400x600/1a1a1a/666?text=${encodeURIComponent(title)}`;
                    }
                })
                .catch(err => console.log(err));
        }
    });
</script>

</body>
</html>