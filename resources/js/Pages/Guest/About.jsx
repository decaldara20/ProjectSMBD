import React, { useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    
    // --- 1. ANIMATION LOGIC ---
    useEffect(() => {
        const handleScroll = () => {
            const hero = document.getElementById('aboutHeroBg');
            if (hero) {
                let scrollPosition = window.pageYOffset;
                hero.style.transform = `scale(1.1) translateY(${scrollPosition * 0.5}px)`;
            }
            reveal(); 
        };

        const reveal = () => {
            const reveals = document.querySelectorAll(".reveal");
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;

                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                    reveals[i].classList.remove("opacity-0", "translate-y-[30px]");
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        reveal(); 

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <MainLayout>
            <Head title="About Us" />

            {/* --- HERO SECTION --- */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div 
                    id="aboutHeroBg" 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out scale-110"
                    style={{ backgroundImage: "url('/images/hero-bg.png')" }}
                ></div>
                <div className="absolute inset-0 bg-black/60"></div>
                
                <div className="relative z-10 text-center animate-fade-in-up px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">
                        ABOUT <span className="text-cyan-400">IMTVDB</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                        The ultimate database for movies, TV shows, and entertainment personalities.
                    </p>
                </div>
            </section>

            {/* --- MISSION SECTION --- */}
            <section className="py-20 px-6 bg-[#121212] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="reveal opacity-0 translate-y-[30px] transition-all duration-700 ease-out">
                        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed mb-4 text-lg">
                            We aim to provide the most comprehensive, accurate, and up-to-date information about the entertainment industry. 
                            From blockbuster hits to indie gems, we track it all.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Built with passion for cinema lovers, by cinema lovers.
                        </p>
                    </div>
                    
                    <div className="reveal opacity-0 translate-y-[30px] transition-all duration-700 ease-out delay-200">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
                                    <i className="fas fa-database text-xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white">Big Data</h3>
                            </div>
                            <p className="text-gray-400">
                                Powered by robust SQL Server database handling millions of records efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TEAM SECTION (CUSTOM REQUEST) --- */}
            <section className="py-20 px-4 bg-[#0F0F0F]">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 reveal opacity-0 translate-y-[30px] transition-all duration-700">Meet The Creators</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
                        
                        {/* Member 1: Trisha */}
                        <div className="reveal opacity-0 translate-y-[30px] transition-all duration-700 ease-out delay-100 bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden hover:border-pink-500/30">
                            <div className="absolute inset-0 bg-linear-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative w-40 h-40 rounded-full p-1 bg-linear-to-tr from-pink-500 to-purple-600 mb-6 group-hover:scale-105 transition-transform duration-300 z-10">
                                <img src="/images/trisha.png" 
                                    className="w-full h-full rounded-full object-cover border-4 border-[#121212]" alt="Trisha" />
                            </div>
                            
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                                    Trisha Garnis Wahningyun
                                </h3>
                                <p className="text-pink-500 font-mono text-sm mb-4 tracking-wider">NIM: L0224012</p>
                                
                                <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                                    <p className="font-semibold text-gray-200">Database Integrator & UX Engineer</p>
                                    <p>
                                        Bertanggung jawab atas integrasi tabel kompleks, normalisasi data (1NF), pembuatan Views & Stored Procedures, serta melengkapi indexing database.
                                    </p>
                                    <p className="text-xs text-gray-500 border-t border-white/10 pt-2 mt-2">
                                        Menangani integrasi logika Backend ke Frontend serta penyempurnaan final sistem.
                                    </p>
                                </div>

                                <div className="flex justify-center gap-4 mt-6">
                                    <a href="https://github.com/trishagarniss" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                                        <i className="fab fa-github"></i>
                                    </a>
                                    <a href="mailto:trishagarnis77@student.uns.ac.id" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all" title="Email Campus">
                                        <i className="fas fa-envelope text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Member 2: Kunto */}
                        <div className="reveal opacity-0 translate-y-[30px] transition-all duration-700 ease-out delay-200 bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden hover:border-cyan-500/30">
                            <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative w-40 h-40 rounded-full p-1 bg-linear-to-tr from-cyan-500 to-blue-600 mb-6 group-hover:scale-105 transition-transform duration-300 z-10">
                                <img src="/images/kunto.png" 
                                    className="w-full h-full rounded-full object-cover border-4 border-[#121212]" alt="Kunto" />
                            </div>
                            
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                    Kunto Rossindu Hidayatullah
                                </h3>
                                <p className="text-cyan-500 font-mono text-sm mb-4 tracking-wider">NIM: L0224020</p>
                                
                                <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                                    <p className="font-semibold text-gray-200">Database Optimizer & UI Developer</p>
                                    <p>
                                        Berfokus pada optimasi performa database melalui strategi Indexing utama untuk mempercepat kueri data skala besar.
                                    </p>
                                    <p className="text-xs text-gray-500 border-t border-white/10 pt-2 mt-2">
                                        Berkolaborasi dalam pengembangan antarmuka untuk memastikan penyajian data yang interaktif dan responsif.
                                    </p>
                                </div>

                                <div className="flex justify-center gap-4 mt-6">
                                    <a href="https://github.com/decaldara20" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-600 hover:text-white transition-all">
                                        <i className="fab fa-github"></i>
                                    </a>
                                    <a href="mailto:kuntohidayat20@student.uns.ac.id" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all" title="Email Campus">
                                        <i className="fas fa-envelope text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- TECH STACK (FLOATING ICONS) --- */}
            <section className="py-20 bg-[#121212] overflow-hidden border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-xl font-bold text-gray-500 mb-12 uppercase tracking-[0.3em] reveal opacity-0 translate-y-[30px] transition-all duration-700">Powered By</h2>
                    
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-80">
                        {/* Icons sama seperti sebelumnya */}
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
                            <i className="fab fa-laravel text-5xl text-[#FF2D20]"></i> <span className="text-xs text-gray-500">Laravel 12</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite] delay-1000" style={{ animationDelay: '1s' }}>
                            <i className="fab fa-react text-5xl text-[#61DAFB]"></i> <span className="text-xs text-gray-500">React</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite] delay-500" style={{ animationDelay: '0.5s' }}>
                            <i className="fas fa-database text-5xl text-[#CC2927]"></i> <span className="text-xs text-gray-500">SQL Server</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite] delay-[2s]" style={{ animationDelay: '2s' }}>
                            <i className="fab fa-css3-alt text-5xl text-[#38B2AC]"></i> <span className="text-xs text-gray-500">Tailwind CSS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
                            <div className="text-4xl font-black text-[#90CEA1]">TMDb</div> <span className="text-xs text-gray-500">API Provider</span>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

        </MainLayout>
    );
}