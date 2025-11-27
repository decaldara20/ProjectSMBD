<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMTVDB - Pencarian Film & TV</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: #0F0F0F;
            color: #FFFFFF;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow-x: hidden;
        }

        /* Gradient Background Effect */
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
            animation: pulse 15s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        /* Main Container */
        .container {
            position: relative;
            z-index: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .logo {
            margin-bottom: 60px;
            text-align: center;
            animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo h1 {
            font-size: 64px;
            font-weight: 700;
            letter-spacing: -2px;
            line-height: 1;
        }

        .logo .im { color: #FFFFFF; }
        .logo .tvdb { color: #06b6d4; }

        .logo p {
            color: #B3B3B3;
            font-size: 16px;
            font-weight: 400;
            margin-top: 8px;
            letter-spacing: 1px;
        }

        /* Search Form & Wrapper */
        .search-form {
            width: 100%;
            max-width: 800px; /* Diperlebar sedikit untuk mengakomodasi filter */
            animation: scaleIn 0.8s ease-out 0.2s both;
        }

        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .search-wrapper {
            position: relative;
            display: flex;
            gap: 12px;
            align-items: stretch;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
            background: rgba(255, 255, 255, 0.08);
            border-color: #06b6d4;
            box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
            transform: translateY(-2px);
        }

        /* --- NEW: Filter Dropdown Styles --- */
.filter-container {
    position: relative;
    min-width: 140px;
    border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 1000; /* Pastikan ini tinggi */
}

        .filter-toggle {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            color: #FFFFFF;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            border-radius: 8px;
            transition: background 0.3s;
        }

        .filter-toggle:hover {
            background: rgba(255,255,255,0.05);
        }

        .filter-icon {
            margin-right: 8px;
            color: #06b6d4;
            width: 20px;
            text-align: center;
        }

.dropdown-menu {
    position: absolute;
    /* Ubah dari 120% ke 100% agar menempel tepat di bawah tombol */
    top: 100%; 
    left: 0;
    width: 180px;
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 6px; /* Padding sedikit diperkecil agar rapi */
    
    display: none;
    flex-direction: column;
    gap: 2px; /* Jarak antar item diperkecil */
    
    box-shadow: 0 10px 40px rgba(0,0,0,0.6); /* Shadow dipertebal agar kontras */
    opacity: 0;
    
    /* Animasi masuk tetap ada, tapi lebih cepat */
    transform: translateY(-5px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    
    /* WAJIB: Agar tetap paling atas */
    z-index: 9999 !important; 
    
    /* Trik Jembatan Gaib: Menutup celah antara tombol dan menu */
    /* Ini mencegah menu menutup sendiri saat mouse digerakkan pelan */
    padding-top: 5px; 
    margin-top: 5px;
}

.dropdown-menu.active {
    display: flex;
    opacity: 1;
    transform: translateY(0);
}

.dropdown-item {
    padding: 12px 16px; /* Area klik diperbesar */
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #B3B3B3;
    
    /* UBAHAN PENTING: Transisi dipercepat jadi 0.1s (sangat responsif) */
    transition: background 0.1s ease, color 0.1s ease; 
    
    /* Mencegah teks terpilih tidak sengaja */
    user-select: none; 
}

.dropdown-item:hover {
    background: rgba(6, 182, 212, 0.2); /* Warna sedikit lebih terang */
    color: #FFFFFF;
}

.dropdown-item.selected {
    background: rgba(6, 182, 212, 0.15);
    color: #06b6d4; /* Teks jadi Cyan agar beda */
    font-weight: 500;
}

        .dropdown-item i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }
        /* --- End Filter Styles --- */

.search-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    background: transparent;
    border: none;
    color: #FFFFFF;
    outline: none;
    /* TAMBAHAN PENTING: Memastikan input berada di bawah filter */
    position: relative;
    z-index: 1; 
}

        .search-input::placeholder {
            color: #B3B3B3;
        }

        .search-button {
            padding: 12px 32px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .search-button:hover {
            background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
            box-shadow: 0 8px 24px rgba(6, 182, 212, 0.4);
        }

        /* Quick Suggestions */
.suggestions {
    margin-top: 32px;
    text-align: center;
    animation: fadeIn 0.8s ease-out 0.4s both;
    position: relative;
    
    /* UBAHAN PENTING: Agar tidak menghalangi dropdown yang menggantung di atasnya */
    z-index: 1; 
    pointer-events: none; 
}

        .suggestions p {
            color: #B3B3B3;
            font-size: 14px;
            margin-bottom: 12px;
        }

.suggestion-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    
    /* UBAHAN PENTING: Mengaktifkan kembali klik untuk tag */
    pointer-events: auto; 
}

        .tag {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            color: #B3B3B3;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .tag:hover {
            background: rgba(6, 182, 212, 0.15);
            border-color: #06b6d4;
            color: #FFFFFF;
            transform: translateY(-2px);
        }

        /* Footer */
        footer {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px 20px;
            color: #666666;
            font-size: 14px;
            animation: fadeIn 0.8s ease-out 0.6s both;
        }

        footer .divider {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #06b6d4, transparent);
            margin: 0 auto 16px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .logo h1 { font-size: 48px; }
            
            .search-wrapper {
                flex-direction: column;
                padding: 12px;
                gap: 8px;
            }
            
            .filter-container {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 8px;
            }

            .filter-toggle {
                padding: 10px;
            }

            .dropdown-menu {
                width: 100%;
                top: 100%;
                margin-top: 10px;
            }

            .search-button { width: 100%; padding: 14px; }
        }

        /* Loading Animation for Input */
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
    </style>
</head>
<body>
<body>
    <div class="container">
        <div class="logo">
            <h1><span class="im">IM</span><span class="tvdb">TVDB</span></h1>
            <p>GREATEST SEARCH OF ALL TIME</p>
        </div>

        <form action="/search" method="GET" class="search-form">
            <div class="search-wrapper">
                <div class="filter-container">
                    <input type="hidden" name="type" id="searchType" value="multi">
                    
                    <button type="button" class="filter-toggle" id="dropdownBtn">
                        <span id="selectedLabel">
                            <i class="fa-solid fa-layer-group filter-icon"></i> Semua
                        </span>
                        <i class="fa-solid fa-chevron-down" style="font-size: 12px; color: #666;"></i>
                    </button>

                    <div class="dropdown-menu" id="filterDropdown">
                        <div class="dropdown-item selected" data-value="multi" data-label="Semua" data-icon="fa-layer-group">
                            <i class="fa-solid fa-layer-group"></i> Semua
                        </div>
<div class="dropdown-item" data-value="movie" data-label="Film" data-icon="fa-film">
    <i class="fa-solid fa-film"></i> Film
</div>
                        <div class="dropdown-item" data-value="tv" data-label="Serial TV" data-icon="fa-tv">
                            <i class="fa-solid fa-tv"></i> Serial TV
                        </div>
                        <div class="dropdown-item" data-value="person" data-label="Aktor" data-icon="fa-user">
                            <i class="fa-solid fa-user"></i> Aktor
                        </div>
                    </div>
                </div>
                
                <input 
                    type="text" 
                    name="q" 
                    class="search-input" 
                    placeholder="Cari judul film, serial, atau nama aktor..." 
                    required 
                    autofocus
                    autocomplete="off"
                >
                
                <button type="submit" class="search-button">Cari</button>
            </div>

            <div class="suggestions">
                <p>Sedang populer:</p>
                <div class="suggestion-tags">
                    <span class="tag" onclick="searchQuery('Oppenheimer')">Oppenheimer</span>
                    <span class="tag" onclick="searchQuery('Breaking Bad')">Breaking Bad</span>
                    <span class="tag" onclick="searchQuery('Rush Hour')">Rush Hour</span>
                    <span class="tag" onclick="searchQuery('Lovely Runner')">Lovely Runner</span>
                    <span class="tag" onclick="searchQuery('Crash Landing On You')">Crash Landing On You</span>
                </div>
            </div>
        </form>
    </div>

    <footer>
        <div class="divider"></div>
        <p>© 2025 IMTVDB | Pencarian Film & TV terlengkap</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Ambil elemen-elemen penting
            const dropdownBtn = document.getElementById('dropdownBtn');
            const dropdownMenu = document.getElementById('filterDropdown');
            const hiddenInput = document.getElementById('searchType');
            const selectedLabel = document.getElementById('selectedLabel');
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            const filterContainer = document.querySelector('.filter-container');

            // 1. Toggle Dropdown saat tombol diklik
            dropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Mencegah event bubbling
                dropdownMenu.classList.toggle('active');
            });

            // 2. Logic saat Item dipilih
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation(); // Mencegah dropdown menutup sebelum logic selesai

                    // Ambil data dari atribut HTML
                    const value = this.getAttribute('data-value');
                    const label = this.getAttribute('data-label');
                    const icon = this.getAttribute('data-icon');

                    // Update Input Hidden (ini yang dikirim ke Laravel)
                    hiddenInput.value = value;

                    // Update Tampilan Tombol Utama
                    selectedLabel.innerHTML = `<i class="fa-solid ${icon} filter-icon"></i> ${label}`;

                    // Update Styling 'Selected'
                    dropdownItems.forEach(i => i.classList.remove('selected'));
                    this.classList.add('selected');

                    // Tutup Dropdown
                    dropdownMenu.classList.remove('active');
                    
                    console.log("Tipe pencarian diubah ke:", value); // Cek console (F12) jika masih error
                });
            });

            // 3. Tutup dropdown jika klik di luar area filter
            document.addEventListener('click', function(e) {
                if (!filterContainer.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });

            // 4. Parallax Effect
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                const container = document.querySelector('.container');
                if(container) {
                    container.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
        });

        // Quick Search Function (Global)
        function searchQuery(query) {
            const input = document.querySelector('.search-input');
            if(input) {
                input.value = query;
                document.querySelector('.search-form').submit();
            }
        }
    </script>
</body>
</html>