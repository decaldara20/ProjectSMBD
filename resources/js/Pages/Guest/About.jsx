import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [options]);

    return [ref, isVisible];
};

// KOMPONEN KARTU TEAM
const TeamCard = ({ name, nim, role, desc, task, img, github, email, delay, color }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    
    const colorClasses = {
        pink: { bg: 'from-pink-500/20 to-purple-500/5', glow: 'shadow-pink-500/20', text: 'text-pink-600 dark:text-pink-400' },
        cyan: { bg: 'from-cyan-500/20 to-blue-500/5', glow: 'shadow-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400' },
    }[color] || { bg: 'from-gray-500/20', glow: '', text: 'text-gray-500 dark:text-gray-400' };

    return (
        <div 
            ref={ref}
            className={`relative group bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-700 transform hover:-translate-y-3 hover:shadow-2xl dark:hover:shadow-2xl ${colorClasses.glow} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`absolute inset-0 rounded-3xl bg-linear-to-b ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
            
            <div className="relative mb-6">
                <div className={`absolute inset-0 rounded-full bg-linear-to-tr ${color === 'pink' ? 'from-pink-600 to-purple-600' : 'from-cyan-600 to-blue-600'} blur-md opacity-30 dark:opacity-50 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity duration-500 animate-pulse`}></div>
                <div className="relative w-40 h-40 rounded-full p-[3px] bg-white dark:bg-[#121212] overflow-hidden z-10 ring-4 ring-transparent group-hover:ring-gray-200 dark:group-hover:ring-white/10 transition-all duration-500 shadow-xl dark:shadow-none">
                    <img src={img} alt={name} className="w-full h-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
            </div>

            <div className="relative z-10 w-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">{name}</h3>
                <p className={`font-mono text-sm mb-6 ${colorClasses.text} tracking-wider font-bold`}>{nim}</p>

                <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-gray-100 dark:border-white/5 mb-6">
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-2 uppercase tracking-wide">{role}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{desc}</p>
                    <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-3"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">"{task}"</p>
                </div>

                <div className="flex justify-center gap-4">
                    <a href={github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110">
                        <i className="fab fa-github text-lg"></i>
                    </a>
                    <a href={`mailto:${email}`} className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all hover:scale-110 ${color === 'pink' ? 'hover:bg-pink-600' : 'hover:bg-cyan-600'}`}>
                        <i className="fas fa-envelope text-lg"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default function About() {
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const handleScroll = () => setOffset(window.pageYOffset);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [missionRef, missionVisible] = useOnScreen({ threshold: 0.3 });
    const [techRef, techVisible] = useOnScreen({ threshold: 0.3 });

    return (
        <MainLayout>
            <Head title="About Us" />

            {/* HERO SECTION */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-black transition-colors duration-500">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-100 dark:opacity-100 transition-all duration-500 hero-bg-image"
                    style={{ 
                        transform: `translateY(${offset * 0.5}px) scale(1.1)`, 
                    }}
                ></div>
                
                <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white dark:from-black/40 dark:via-black/20 dark:to-[#121212]"></div>
                
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-600/10 dark:bg-cyan-500/20 border border-cyan-600/20 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold tracking-[0.2em] mb-4 backdrop-blur-md shadow-lg">
                        THE ARCHITECTS
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter drop-shadow-2xl">
                        ABOUT <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">IMTVDB</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                        Building the ultimate cinematic database universe,<br className="hidden md:block" /> one query at a time.
                    </p>
                </div>
            </section>

            {/* --- 2. MISSION SECTION --- */}
            <section ref={missionRef} className="py-24 px-6 bg-white dark:bg-[#121212] relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className={`transition-all duration-1000 transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 relative">
                            Our Mission
                            <span className="absolute -bottom-2 left-0 w-50 h-1 bg-linear-to-r from-cyan-500 to-transparent"></span>
                        </h2>
                        <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            <p>
                                <strong className="text-cyan-700 dark:text-white">IMTVDB</strong> aims to provide the most comprehensive, accurate, and up-to-date information about the entertainment industry. From blockbuster hits to indie gems, we track it all with precision.
                            </p>
                            <p>
                                Built with passion for cinema lovers, by cinema lovers. We believe data should not just be stored, but experienced.
                            </p>
                        </div>
                    </div>
                    
                    <div className={`transition-all duration-1000 delay-200 transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                        <div className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all shadow-xl dark:shadow-none">
                            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                                <i className="fas fa-server text-9xl text-gray-900 dark:text-white"></i>
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-cyan-500/20 mb-6">
                                    <i className="fas fa-database"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Big Data Architecture</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Powered by robust <span className="text-cyan-600 dark:text-cyan-400 font-bold">SQL Server</span> database handling millions of records efficiently. Optimized with advanced indexing strategies to ensure lightning-fast search results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. TEAM SECTION --- */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-[#0F0F0F] relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Meet The Creators</h2>
                        <p className="text-gray-500 dark:text-gray-500">The minds behind the code.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 justify-center max-w-5xl mx-auto">
                        <TeamCard 
                            name="Trisha Garnis Wahningyun"
                            nim="NIM: L0224012"
                            role="Database Integrator & UX Engineer"
                            desc="Bertanggung jawab atas integrasi tabel kompleks, normalisasi data (1NF), pembuatan Views & Stored Procedures."
                            task="Handling Backend Logic & Frontend Integration"
                            img="/images/trisha.png"
                            github="https://github.com/trishagarniss"
                            email="trishagarnis77@student.uns.ac.id"
                            color="pink"
                            delay={100}
                        />

                        <TeamCard 
                            name="Kunto Rossindu Hidayatullah"
                            nim="NIM: L0224020"
                            role="Database Optimizer & UI Developer"
                            desc="Fokus pada optimasi performa database (Indexing), pengembangan antarmuka responsif, dan interaksi pengguna."
                            task="Optimizing Queries & Designing UI System"
                            img="/images/kunto.png"
                            github="https://github.com/decaldara20"
                            email="kuntohidayat20@student.uns.ac.id"
                            color="cyan"
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* --- 4. TECH STACK SECTION --- */}
            <section ref={techRef} className="py-20 bg-white dark:bg-[#121212] overflow-hidden border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-xl font-bold text-gray-400 dark:text-gray-500 mb-12 uppercase tracking-[0.3em] transition-all duration-700 ${techVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
                        Powered By
                    </h2>
                    
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-90 dark:opacity-80">
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
                            <i className="fab fa-laravel text-5xl text-[#FF2D20]"></i> <span className="text-xs font-bold text-gray-500">Laravel 12</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                            <i className="fab fa-react text-5xl text-[#61DAFB]"></i> <span className="text-xs font-bold text-gray-500">React</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
                            <i className="fas fa-database text-5xl text-[#CC2927]"></i> <span className="text-xs font-bold text-gray-500">SQL Server</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
                            <i className="fab fa-css3-alt text-5xl text-[#38B2AC]"></i> <span className="text-xs font-bold text-gray-500">Tailwind CSS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
                            <div className="text-4xl font-black text-[#90CEA1]">TMDb</div> <span className="text-xs font-bold text-gray-500">API Provider</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CSS CUSTOM UNTUK BACKGROUND IMAGE --- */}
            <style>{`
                /* Default (Light Mode) */
                .hero-bg-image {
                    background-image: url('/images/hero-bg(1).png');
                }
                
                /* Dark Mode (Jika class 'dark' ada di tag <html>) */
                .dark .hero-bg-image {
                    background-image: url('/images/hero-bg.png');
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

        </MainLayout>
    );
}