@extends('layouts.app')

@section('title', 'About Us')

@section('content')

<style>
    /* Animasi Fade In Up saat Scroll */
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }

    /* Efek Kartu Hologram */
    .holo-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.4s ease;
    }
    .holo-card:hover {
        transform: translateY(-10px);
        border-color: var(--cyan-glow, #00FFFF);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }

    /* Floating Animation untuk Tech Stack */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    .animate-float {
        animation: float 4s ease-in-out infinite;
    }
    .delay-1 { animation-delay: 1s; }
    .delay-2 { animation-delay: 2s; }
</style>

<section class="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
    <div id="aboutHeroBg" class="absolute inset-0 w-full h-full bg-cover bg-center scale-110"
         style="background-image: url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop');">
    </div>
    <div class="absolute inset-0 bg-black/70"></div>
    <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#121212] to-transparent"></div>

    <div class="relative z-10 text-center px-4 max-w-4xl">
        <h1 class="text-5xl md:text-7xl font-black text-white font-display mb-4 tracking-tight drop-shadow-2xl">
            We Are <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">IMTVDB</span>
        </h1>
        <p class="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between massive data and cinematic experience.
            <br>Sebuah proyek Sistem Manajemen Basis Data untuk menaklukkan jutaan data hiburan.
        </p>
    </div>
</section>

<section class="py-20 px-4 md:px-10 max-w-7xl mx-auto bg-[#121212]">
    <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="reveal">
            <h2 class="text-neon-cyan font-bold tracking-widest text-sm uppercase mb-2">Our Mission</h2>
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Mengubah Data Mentah Menjadi <br> Wawasan Berharga.
            </h3>
            <p class="text-gray-400 text-lg leading-relaxed mb-6">
                IMTVDB bukan sekadar database film. Ini adalah eksperimen teknologi untuk mengintegrasikan IMDb dan TV Shows Dataset menjadi satu ekosistem yang mulus.
            </p>
            <ul class="space-y-4">
                <li class="flex items-center gap-3 text-gray-300">
                    <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                    30+ Tabel Terintegrasi
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                    <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                    Performa Query Lumayanlah (Indexed Views)
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                    <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                    UI Modern berbasis Laravel & Tailwind
                </li>
            </ul>
        </div>
        <div class="reveal relative">
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-4">
                    <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop" class="rounded-2xl shadow-lg w-full h-64 object-cover opacity-80 hover:opacity-100 transition duration-500">
                    <img src="https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=500&auto=format&fit=crop" class="rounded-2xl shadow-lg w-full h-40 object-cover opacity-80 hover:opacity-100 transition duration-500">
                </div>
                <div class="space-y-4 pt-8">
                    <img src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop" class="rounded-2xl shadow-lg w-full h-40 object-cover opacity-80 hover:opacity-100 transition duration-500">
                    <img src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500&auto=format&fit=crop" class="rounded-2xl shadow-lg w-full h-64 object-cover opacity-80 hover:opacity-100 transition duration-500">
                </div>
            </div>
        </div>
    </div>
</section>

<section class="py-20 px-4 bg-[#0F0F0F]">
    <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-16 reveal">Meet The Creators</h2>
        
        <div class="grid md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            
            <div class="reveal holo-card rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-600 mb-6 group-hover:scale-105 transition-transform duration-300 z-10">
                    <img src="{{ asset('images/trisha.png') }}" 
                        class="w-full h-full rounded-full object-cover border-4 border-[#121212]" alt="Trisha">
                </div>
                
                <div class="relative z-10">
                    <h3 class="text-2xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                        Trisha Garnis Wahningyun
                    </h3>
                    <p class="text-pink-500 font-mono text-sm mb-4 tracking-wider">NIM: L0224012</p>
                    
                    <div class="text-gray-400 text-sm leading-relaxed space-y-2">
                        <p class="font-semibold text-gray-200">Database Integrator & UX Engineer</p>
                        <p>
                            Bertanggung jawab atas integrasi tabel kompleks, normalisasi data (1NF), pembuatan Views & Stored Procedures, serta melengkapi indexing database.
                        </p>
                        </p>
                        <p class="text-xs text-gray-500 border-t border-white/10 pt-2 mt-2">
                            Menangani integrasi logika Backend ke Frontend serta penyempurnaan final sistem.
                        </p>
                    </div>

                    <div class="flex justify-center gap-4 mt-6">
                        <a href="https://github.com/trishagarniss" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="mailto:trishagarnis77@student.uns.ac.id" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all" title="Email Campus">
                            <i class="fas fa-envelope text-lg"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="reveal holo-card rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-blue-600 mb-6 group-hover:scale-105 transition-transform duration-300 z-10">
                    <img src="{{ asset('images/kunto.png') }}" 
                        class="w-full h-full rounded-full object-cover border-4 border-[#121212]" alt="Kunto">
                </div>
                
                <div class="relative z-10">
                    <h3 class="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        Kunto Rossindu Hidayatullah
                    </h3>
                    <p class="text-cyan-500 font-mono text-sm mb-4 tracking-wider">NIM: L0224020</p>
                    
                    <div class="text-gray-400 text-sm leading-relaxed space-y-2">
                        <p class="font-semibold text-gray-200">Database Optimizer & UI Developer</p>
                        <p>
                            Berfokus pada optimasi performa database melalui strategi Indexing utama untuk mempercepat kueri data skala besar.
                        </p>
                        <p class="text-xs text-gray-500 border-t border-white/10 pt-2 mt-2">
                            Berkolaborasi dalam pengembangan antarmuka untuk memastikan penyajian data yang interaktif dan responsif.
                        </p>
                    </div>

                    <div class="flex justify-center gap-4 mt-6">
                        <a href="https://github.com/decaldara20" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-600 hover:text-white transition-all">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="mailto:kuntohidayat20@student.uns.ac.id" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all" title="Email Campus">
                            <i class="fas fa-envelope text-lg"></i>
                        </a>
                </div>
            </div>

        </div>
    </div>
</section>

<section class="py-20 px-4 border-t border-white/5 bg-[#0A0A0A]">
    <div class="max-w-4xl mx-auto text-center">
        <p class="text-gray-500 uppercase tracking-[0.3em] text-xs mb-12">Powered By Modern Technology</p>
        
        <div class="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div class="flex flex-col items-center gap-2 animate-float">
                <i class="fab fa-laravel text-5xl text-[#FF2D20]"></i>
                <span class="text-xs text-gray-500">Laravel 10</span>
            </div>

            <div class="flex flex-col items-center gap-2 animate-float delay-1">
                <i class="fas fa-database text-5xl text-[#CC2927]"></i>
                <span class="text-xs text-gray-500">SQL Server</span>
            </div>

            <div class="flex flex-col items-center gap-2 animate-float delay-2">
                <i class="fab fa-css3-alt text-5xl text-[#38B2AC]"></i> <span class="text-xs text-gray-500">Tailwind CSS</span>
            </div>

            <div class="flex flex-col items-center gap-2 animate-float">
                <div class="text-4xl font-black text-[#90CEA1]">TMDb</div>
                <span class="text-xs text-gray-500">API Provider</span>
            </div>
        </div>
    </div>
</section>

<script>
    // 1. Parallax Hero
    window.addEventListener('scroll', function() {
        const hero = document.getElementById('aboutHeroBg');
        let scrollPosition = window.pageYOffset;
        hero.style.transform = 'scale(1.1) translateY(' + scrollPosition * 0.5 + 'px)';
    });

    // 2. Scroll Reveal Animation
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    // Trigger sekali saat load
    reveal();
</script>

@endsection