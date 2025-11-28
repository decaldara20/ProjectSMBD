<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMTVDB - @yield('title', 'Home')</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    @yield('styles')
</head>
<body>

    <nav class="navbar">
        <div class="nav-left">
            <a href="/" class="logo">
                <i class="fas fa-film"></i> IMTVDB
            </a>
            
            <div class="nav-links">
                <a href="/" class="nav-item active"><i class="fas fa-home"></i> Home</a>
                <a href="/search?type=movie" class="nav-item"><i class="fas fa-video"></i> Movies</a>
                <a href="/search?type=tvSeries" class="nav-item"><i class="fas fa-tv"></i> TV Shows</a>
                <a href="#" class="nav-item"><i class="fas fa-users"></i> Artists</a>
                
                <div class="dropdown-menu-item">
                    <a href="#" class="nav-item"><i class="fas fa-layer-group"></i> Genres</a>
                    </div>
            </div>
        </div>

        <div class="nav-right">
            <form action="/search" method="GET" class="search-wrapper">
                <input type="text" name="q" class="search-input" placeholder="Cari film, serial, sutradara, aktor...">
                <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
            </form>

            <button class="action-btn" id="themeToggle" title="Ganti Tema">
                <i class="fas fa-moon"></i>
            </button>

            <a href="#" class="action-btn" title="Login">
                <i class="fas fa-user"></i>
            </a>
        </div>
    </nav>

    <div style="min-height: 80vh;">
        @yield('content')
    </div>

    <footer class="main-footer">
        <div class="footer-content">
            <div class="footer-text">&copy; 2025 IMTVDB. Powered by Laravel</div>
            <div class="footer-links">
                <a href="#">About Us</a>
                <!-- <a href="#">Copyright</a> -->
            </div>
        </div>
    </footer>

    <button id="backToTop" onclick="scrollToTop()"><i class="fas fa-arrow-up"></i></button>

    <script>
        // SCRIPT LIGHT MODE YANG BENAR
        const themeBtn = document.getElementById('themeToggle');
        const themeIcon = themeBtn.querySelector('i');
        const htmlTag = document.documentElement;

        // Cek LocalStorage saat load
        if (localStorage.getItem('theme') === 'light') {
            htmlTag.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            if (htmlTag.getAttribute('data-theme') === 'light') {
                htmlTag.removeAttribute('data-theme'); // Hapus atribut = Dark Mode
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlTag.setAttribute('data-theme', 'light'); // Tambah atribut = Light Mode
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            }
        });

        // Script Back to Top
        const backToTopBtn = document.getElementById("backToTop");
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        };
        function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    </script>
</body>
</html>