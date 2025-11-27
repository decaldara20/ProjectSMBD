<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $person->primaryName }} - Profil Aktor</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* --- STYLE PREMIUM (SAMA DENGAN TV & TITLE) --- */
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
            align-items: flex-start;
        }

        /* --- Kolom Kiri (Foto Profil) --- */
        .poster-col { flex: 0 0 300px; text-align: center; }
        .poster {
            width: 100%;
            aspect-ratio: 2/3;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover;
            margin-bottom: 20px;
        }

        .personal-info {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 12px;
            text-align: left;
        }
        .info-row { margin-bottom: 15px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
        .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .info-row label { display: block; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .info-row span { color: #fff; font-weight: 500; font-size: 16px; }

        /* --- Kolom Kanan (Bio & Filmography) --- */
        .info-col { flex: 1; width: 100%; }

        h1 { font-size: 36px; margin-bottom: 10px; color: #fff; line-height: 1.2; }
        
        /* Badges Profesi */
        .profession-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 30px; }
        .badge {
            padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;
            background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3);
            text-transform: capitalize;
        }

        /* Filmography List */
        .film-section h2 {
            font-size: 20px; margin-bottom: 20px; padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.1); color: #fff;
            display: flex; justify-content: space-between; align-items: center;
        }

        .film-list {
            display: flex; flex-direction: column; gap: 10px;
            max-height: 600px; overflow-y: auto; /* Agar tidak terlalu panjang ke bawah */
            padding-right: 5px;
        }
        
        /* Scrollbar cantik */
        .film-list::-webkit-scrollbar { width: 6px; }
        .film-list::-webkit-scrollbar-track { background: #111; }
        .film-list::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        .film-item {
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(255,255,255,0.03);
            padding: 15px 20px;
            border-radius: 10px;
            text-decoration: none;
            transition: all 0.2s;
            border: 1px solid transparent;
        }

        .film-item:hover {
            background: rgba(255,255,255,0.08);
            transform: translateX(5px);
            border-color: #06b6d4;
        }

        .film-title { font-size: 16px; color: #fff; font-weight: 600; margin-bottom: 4px; }
        .film-role { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .film-year { 
            font-size: 16px; color: #06b6d4; font-weight: 700; 
            background: rgba(6, 182, 212, 0.1); padding: 4px 10px; border-radius: 6px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .detail-wrapper { flex-direction: column; }
            .poster-col { flex: 0 0 auto; width: 100%; max-width: 300px; margin: 0 auto; }
        }
    </style>
</head>
<body>

<div class="container">
    <a href="javascript:history.back()" class="btn-back">← Kembali</a>

    <div class="detail-wrapper">
        
        <div class="poster-col">
            {{-- Foto Placeholder (Karena Database tidak punya URL Foto Aktor) --}}
            {{-- Menggunakan inisial nama jika foto tidak ada --}}
            
<img 
    src="https://placehold.co/400x600/222/888?text=Loading..." 
    id="actorPoster"
    data-imdb-id="{{ $person->nconst }}"
    class="poster" 
    alt="{{ $person->primaryName }}"
>
            
            <div class="personal-info">
                <div class="info-row">
                    <label>Tahun Lahir</label>
                    <span>{{ $person->birthYear ?? 'N/A' }}</span>
                </div>
                
                @if($person->deathYear)
                <div class="info-row">
                    <label>Tahun Wafat</label>
                    <span>{{ $person->deathYear }}</span>
                </div>
                @endif

                <div class="info-row">
                    <label>ID IMDb</label>
                    <span style="font-family: monospace; color: #888;">{{ $person->nconst }}</span>
                </div>
            </div>
        </div>

        <div class="info-col">
            <h1>{{ $person->primaryName }}</h1>

            {{-- Profesi Badges (Actor, Producer, Writer, dll) --}}
            <div class="profession-tags">
                {{-- Cek apakah ada kolom primaryProfession (dari view v_DetailAktor atau tabel name_basics) --}}
                @php
                    $profs = isset($person->primaryProfession) ? $person->primaryProfession : 'Actor';
                @endphp
                
                @foreach(explode(',', $profs) as $prof)
                    <span class="badge">{{ ucwords(str_replace('_', ' ', trim($prof))) }}</span>
                @endforeach
            </div>

            <div class="film-section">
                <h2>
                    Filmography 
                    <span style="font-size: 14px; font-weight: 400; color: #888;">
                        ({{ count($filmography) }} Judul Teratas)
                    </span>
                </h2>
                
                <div class="film-list">
                    @forelse($filmography as $film)
                        {{-- 
                            LINK KE DETAIL JUDUL:
                            Mengarah ke 'title.detail' yang sudah kita desain universal (Mimic UI).
                            User bisa klik ini untuk melihat detail film tersebut.
                        --}}
                        <a href="{{ route('title.detail', $film->tconst) }}" class="film-item">
                            <div>
                                <div class="film-title">{{ $film->primaryTitle }}</div>
                                <div class="film-role">
                                    {{-- Menampilkan Peran (Actor/Actress/Director) --}}
                                    {{ ucfirst($film->category) }} 
                                </div>
                            </div>
                            <div class="film-year">{{ $film->startYear ?? '-' }}</div>
                        </a>
                    @empty
                        <div style="text-align: center; padding: 40px; color: #666; border: 1px dashed #333; border-radius: 10px;">
                            <p>Belum ada data filmografi yang tercatat.</p>
                        </div>
                    @endforelse
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676';
    
    document.addEventListener('DOMContentLoaded', function() {
        const img = document.getElementById('actorPoster');
        
        if (!img) return;

        const imdbId = img.getAttribute('data-imdb-id');

        if (imdbId && TMDB_API_KEY) {
            fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`)
                .then(r => r.json())
                .then(data => {
                    if (data.person_results.length > 0) {
                        const filePath = data.person_results[0].profile_path;
                        
                        if(filePath) {
                            // Gunakan h632 (Ukuran standar foto profil vertikal)
                            img.src = `https://image.tmdb.org/t/p/h632${filePath}`;
                        }
                    }
                })
                .catch(err => console.log(err));
        }
    });
</script>

</body>
</html>