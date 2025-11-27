<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hasil Pencarian: {{ $query }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* --- Reset & Base --- */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: #0F0F0F;
            color: #e0e0e0;
            min-height: 100vh;
            padding: 30px;
        }

        /* --- Header Section --- */
        .container { max-width: 1200px; margin: 0 auto; }

        .header-nav { margin-bottom: 30px; }
        
        .btn-back {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }
        .btn-back:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
        }

        h1 { font-size: 28px; margin-bottom: 40px; color: #fff; }
        h1 span { color: #06b6d4; }

        /* --- Grid Layout --- */
        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 24px;
        }

        /* --- Card Style --- */
        .card {
            background: #1a1a1a;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .card:hover {
            transform: translateY(-5px);
            border-color: #06b6d4;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .card a { text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column; }

        /* Poster Image */
        .poster-wrapper {
            width: 100%;
            aspect-ratio: 2/3;
            background: #222;
            overflow: hidden;
            position: relative;
        }

        .poster-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .card:hover .poster-wrapper img { transform: scale(1.05); }

        /* Card Content */
        .card-content {
            padding: 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .card h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            line-height: 1.4;
            color: #fff;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #aaa;
            margin-top: auto;
        }

        /* Badge Styles */
        .badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            border: 1px solid transparent;
        }
        .badge-cyan { background: rgba(6, 182, 212, 0.15); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3); }
        .badge-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); }
        .badge-yellow { background: rgba(234, 179, 8, 0.15); color: #eab308; border-color: rgba(234, 179, 8, 0.3); }
        .badge-gray { background: rgba(255, 255, 255, 0.1); color: #ccc; border-color: rgba(255, 255, 255, 0.2); }

        .rating { color: #fbbf24; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        /* --- Empty State --- */
        .no-results {
            text-align: center;
            padding: 60px;
            background: #1a1a1a;
            border-radius: 16px;
            border: 1px dashed #333;
        }
        .no-results p { font-size: 18px; color: #888; }

        @media (max-width: 768px) {
            .results-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header-nav">
            <a href="{{ route('homepage') }}" class="btn-back">← Kembali ke Home</a>
        </div>

        <h1>Hasil Pencarian: <span>"{{ $query }}"</span></h1>

        @if (empty($results))
            <div class="no-results">
                <p>Tidak ditemukan hasil yang cocok untuk pencarian Anda.</p>
                <p style="font-size: 14px; margin-top: 10px;">Coba kata kunci lain atau ubah filter.</p>
            </div>
        @else
            <div class="results-grid">
                @foreach ($results as $item)
                    <div class="card">
                        
                        {{-- LOGIKA PENENTUAN LINK & BADGE --}}
                        @php
                            $route = '#';
                            $badge = 'UNKNOWN';
                            $badgeClass = 'badge-gray';
                            $isPerson = false; // Penanda apakah ini orang

                            // 1. FILM (Dari IMDb)
                            if ($item->type == 'movie') {
                                $route = route('title.detail', $item->id);
                                $badge = 'FILM';
                                $badgeClass = 'badge-cyan';
                            } 
                            // 2. TV SHOW PREMIUM (Dari tabel TV Anda)
                            elseif ($item->type == 'tvSeries') {
                                $route = route('tv.detail', $item->id);
                                $badge = 'TV SERIES';
                                $badgeClass = 'badge-blue';
                            }
                            // 3. TV SHOW CADANGAN (Dari IMDb)
                            elseif ($item->type == 'tvSeries_imdb') {
                                $route = route('title.detail', $item->id); 
                                $badge = 'TV (IMDb)';
                                $badgeClass = 'badge-yellow';
                            }
                            // 4. AKTOR (INI YANG KEMARIN HILANG)
                            elseif ($item->type == 'person') {
                                $route = route('person.detail', $item->id); 
                                $badge = 'AKTOR';
                                $badgeClass = 'badge-gray';
                                $isPerson = true;
                            }
                        @endphp

                        {{-- Link Utama --}}
                        <a href="{{ $route }}">
                            
                            <div class="poster-wrapper">
                                <img 
                                    src="https://placehold.co/300x450/222/888?text=Loading..." 
                                    data-imdb-id="{{ $item->id }}" 
                                    data-type="{{ $item->type }}"
                                    alt="{{ $item->title }}" 
                                    class="poster-img"
                                    loading="lazy"
                                >
                            </div>

                            <div class="card-content">
                                <h3>{{ $item->title }}</h3>
                                
                                <div class="meta">
                                    <span>
                                        {{-- Jika orang, labelnya 'Lahir: 1990' --}}
                                        {{ $item->startYear ? ($isPerson ? '' : '') . $item->startYear : '' }}
                                        
                                        <span class="badge {{ $badgeClass }}">{{ $badge }}</span>
                                    </span>

                                    {{-- Rating hanya muncul untuk Film/TV (Bukan Orang) --}}
                                    @if(!$isPerson && isset($item->averageRating))
                                        <span class="rating">
                                            ★ {{ number_format($item->averageRating, 1) }}
                                        </span>
                                    @endif
                                </div>

                                {{-- Jika Aktor, tampilkan 'Known For' --}}
                                @if($isPerson && isset($item->known_for))
                                    <div style="margin-top: 8px; font-size: 11px; color: #888; line-height: 1.3;">
                                        <em>{{ \Illuminate\Support\Str::limit($item->known_for, 40) }}</em>
                                    </div>
                                @endif
                            </div>
                        </a>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
<script>
    const TMDB_API_KEY = 'f19a5ce3a90ddee4579a9f37d5927676'; 

    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('.poster-img');

        images.forEach(img => {
            const id = img.getAttribute('data-imdb-id'); // Bisa ID IMDb (tt..) atau TMDB (123..)
            const type = img.getAttribute('data-type');
            const title = img.getAttribute('alt');

            // Fungsi Fallback (Placeholder)
            const showPlaceholder = () => {
                img.src = `https://placehold.co/300x450/1a1a1a/666?text=${encodeURIComponent(title)}`;
                img.style.opacity = 1;
            };

            if (!id || !TMDB_API_KEY) { showPlaceholder(); return; }

            // --- LOGIKA PENENTUAN URL ---
            let url = '';
            
            // KASUS KHUSUS: Jika ini TV SHOW UTAMA (Dari Local DB), ID-nya adalah ID TMDB (Angka)
            if (type === 'tvSeries') {
                // Gunakan endpoint 'Get TV Details' langsung
                url = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            } 
            // KASUS LAIN: Film, Orang, atau TV Backup (Dari IMDb), ID-nya adalah IMDb (tt/nm)
            else {
                // Gunakan endpoint 'Find by External ID'
                url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
            }

            // --- EKSEKUSI FETCH ---
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    let filePath = null;

                    if (type === 'tvSeries') {
                        // Respon langsung object TV, bukan array results
                        filePath = data.poster_path;
                    } else {
                        // Logika FIND (IMDb ID)
                        if (type === 'person' && data.person_results?.length > 0) {
                            filePath = data.person_results[0].profile_path;
                        } else if (data.movie_results?.length > 0) {
                            filePath = data.movie_results[0].poster_path;
                        } else if (data.tv_results?.length > 0) {
                            filePath = data.tv_results[0].poster_path;
                        }
                    }

                    if (filePath) {
                        const finalUrl = `https://image.tmdb.org/t/p/w500${filePath}`;
                        // Preload agar mulus
                        const tempImg = new Image();
                        tempImg.src = finalUrl;
                        tempImg.onload = () => {
                            img.src = finalUrl;
                            img.style.opacity = 1;
                        };
                        tempImg.onerror = showPlaceholder;
                    } else {
                        showPlaceholder();
                    }
                })
                .catch(err => {
                    // console.error(err); // Uncomment untuk debug
                    showPlaceholder();
                });
        });
    });
</script>

</body> 
</html>