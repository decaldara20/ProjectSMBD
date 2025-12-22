import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

// --- KOMPONEN INPUT FIELD (Reusable) ---
const GlassInput = ({ icon, type, value, onChange, placeholder, error }) => (
    <div className="space-y-1.5">
        <div className="relative group">
            {/* Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-cyan-400 text-gray-500">
                <span className="material-symbols-outlined text-[20px] drop-shadow-md">{icon}</span>
            </div>
            
            {/* Input Glassmorphism */}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`
                    w-full bg-white/5 backdrop-blur-md border 
                    ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-400/80'}
                    rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 
                    focus:ring-0 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]
                    transition-all duration-300 outline-none text-sm font-medium
                `}
                placeholder={placeholder}
            />
        </div>
        {error && (
            <p className="text-red-400 text-xs ml-1 flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[14px]">error</span> {error}
            </p>
        )}
    </div>
);

// --- KOMPONEN FORMULIR LOGIN ---
const LoginFormPanel = ({ switchToRegister, isActive }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 transition-all duration-700 ease-in-out ${isActive ? 'z-20 opacity-100 translate-x-0' : 'z-10 opacity-0 -translate-x-10 pointer-events-none'}`}>
            
            {/* Background Decor (Blob) */}
            <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            
            <div className="w-full max-w-[400px] relative z-10">
                {/* Logo Form (Opsional, jika ingin ada logo kecil di form juga) */}
                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mb-6 brightness-200 md:hidden" />

                <div className="mb-10 text-left">
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                        Welcome <br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Back!</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <GlassInput 
                        icon="mail" 
                        type="email" 
                        value={data.email} 
                        onChange={(e) => setData('email', e.target.value)} 
                        placeholder="Enter your email"
                        error={errors.email}
                    />

                    <div className="space-y-2">
                        <GlassInput 
                            icon="lock" 
                            type="password" 
                            value={data.password} 
                            onChange={(e) => setData('password', e.target.value)} 
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                        <div className="flex justify-end">
                             <a href="#" className="text-xs text-cyan-400/80 hover:text-cyan-300 hover:underline transition-colors">Forgot Password?</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                             <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 checked:border-cyan-500 checked:bg-cyan-500 transition-all" />
                             <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                        </div>
                        <span className="text-sm text-gray-400">Remember me for 30 days</span>
                    </div>

                    <button type="submit" disabled={processing} className="group relative w-full py-4 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                        <span className="relative flex items-center justify-center gap-2">
                             {processing ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : <>Sign In <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span></>}
                        </span>
                    </button>
                </form>

                 <div className="mt-10 text-center text-sm text-gray-500 md:hidden">
                    New here? <button onClick={switchToRegister} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Create Account</button>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN FORMULIR REGISTER ---
const RegisterFormPanel = ({ switchToLogin, isActive }) => {
     const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className={`absolute top-0 right-0 h-full w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 transition-all duration-700 ease-in-out ${isActive ? 'z-20 opacity-100 translate-x-0' : 'z-10 opacity-0 translate-x-10 pointer-events-none'}`}>
            
             {/* Background Decor (Blob) */}
             <div className="absolute bottom-[-10%] right-[-20%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            <div className="w-full max-w-[400px] relative z-10">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mb-6 brightness-200 md:hidden" />

                <div className="mb-8 text-left">
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                        Create <br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Account</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Start your cinematic journey today.</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <GlassInput icon="person" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Full Name" error={errors.name} />
                    <GlassInput icon="mail" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email Address" error={errors.email} />
                    <GlassInput icon="lock" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" error={errors.password} />
                    <GlassInput icon="verified_user" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="Confirm Password" />

                    <button type="submit" disabled={processing} className="group relative w-full py-4 mt-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                        <span className="relative flex items-center justify-center gap-2">
                             {processing ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : 'Get Started'}
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 md:hidden">
                    Already a member? <button onClick={switchToLogin} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Sign In</button>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA ---
export default function AuthSlider({ defaultView = 'login' }) {
    const [isRegisterPanelActive, setIsRegisterPanelActive] = useState(defaultView === 'register');

    const switchToRegister = () => setIsRegisterPanelActive(true);
    const switchToLogin = () => setIsRegisterPanelActive(false);

    return (
        <MainLayout>
             <Head title={isRegisterPanelActive ? "Register" : "Login"} />
            
            <style>{`
                /* ANIMASI LATAR BELAKANG */
                @keyframes pan-slow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .bg-hero-animated {
                    background-size: 150% 150%;
                    animation: pan-slow 30s ease-in-out infinite;
                }
                
                /* Grid Background Halus */
                .bg-grid-white {
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>

            <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
                
                {/* 1. LAYER BACKGROUND BASE */}
                <div className="absolute inset-0 bg-grid-white z-0"></div>
                <div className="absolute inset-0 bg-[#050505]/95 z-0"></div>

                {/* === LAYER 2: FORMS (STATIC POSITION) === */}
                <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto">
                    {/* Login di Kiri, Register di Kanan (Selalu disitu) */}
                    <LoginFormPanel switchToRegister={switchToRegister} isActive={!isRegisterPanelActive} />
                    <RegisterFormPanel switchToLogin={switchToLogin} isActive={isRegisterPanelActive} />
                </div>


                {/* === LAYER 3: OVERLAY ANIMASI (SIMETRIS & CERAH) === 
                   Logic: 
                   - Jika Register Aktif (Form Kanan Aktif) -> Overlay Tutup Kiri (translateX(0) / left: 0)
                   - Jika Login Aktif (Form Kiri Aktif)    -> Overlay Tutup Kanan (translateX(100%) / left: 50%)
                */}
                <div 
                    className="hidden md:block absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-50 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-white/10"
                    style={{ 
                        left: isRegisterPanelActive ? '0%' : '50%'
                    }}
                >
                    <div className="relative w-full h-full">
                        
                        {/* A. GAMBAR BACKGROUND (Dibuat Lebih Terang) */}
                        <div className="absolute inset-0 bg-cyan-900 overflow-hidden">
                            {/* Gambar Background: Opacity Tinggi agar jelas */}
                            <div 
                                className="absolute inset-0 bg-hero-animated opacity-90"
                                style={{ backgroundImage: "url('/images/hero-bg.png')" }} 
                            ></div>
                            
                            {/* Gradient Overlay: Ringan & Cerah (Jangan hitam pekat) */}
                            <div className="absolute inset-0 bg-linear-to-tr from-cyan-900/60 to-blue-900/60 mix-blend-multiply"></div>
                            {/* Highlight cerah di pojok untuk kedalaman */}
                            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-black/30"></div>
                        </div>

                        {/* B. TEKS DI DALAM OVERLAY (Beserta Logo) */}
                        <div className="relative h-full flex items-center justify-center text-white px-16">
                            <div className="text-center w-full max-w-md backdrop-blur-sm bg-black/10 p-8 rounded-3xl border border-white/10">
                                
                                {isRegisterPanelActive ? (
                                    // Teks saat Register Aktif (Overlay menutupi Kiri/Login Area)
                                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-forwards">
                                        {/* LOGO DISINI */}
                                        <div className="mb-6 flex justify-center">
                                            <img src="/images/logo.png" alt="IMTVDB Logo" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] brightness-200" />
                                        </div>

                                        <h2 className="text-3xl font-black tracking-tight mb-3 drop-shadow-md">Already have an account?</h2>
                                        <p className="text-base text-cyan-50 mb-8 font-medium leading-relaxed drop-shadow">
                                            Stay connected with your watchlist.<br/>Sign in to continue.
                                        </p>
                                        <button onClick={switchToLogin} className="group relative px-8 py-3 rounded-full overflow-hidden bg-white/10 border-2 border-white/50 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-cyan-900 hover:border-white transition-all duration-300 shadow-lg">
                                            <span className="relative z-10">Sign In</span>
                                        </button>
                                    </div>
                                ) : (
                                    // Teks saat Login Aktif (Overlay menutupi Kanan/Register Area)
                                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-forwards">
                                        {/* LOGO DISINI */}
                                        <div className="mb-6 flex justify-center">
                                             <img src="/images/logo.png" alt="IMTVDB Logo" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] brightness-200" />
                                        </div>

                                        <h2 className="text-3xl font-black tracking-tight mb-3 drop-shadow-md">New to IMTVDB?</h2>
                                        <p className="text-base text-purple-50 mb-8 font-medium leading-relaxed drop-shadow">
                                            Join us today and start your<br/>cinematic journey.
                                        </p>
                                        <button onClick={switchToRegister} className="group relative px-8 py-3 rounded-full overflow-hidden bg-white/10 border-2 border-white/50 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-purple-900 hover:border-white transition-all duration-300 shadow-lg">
                                            <span className="relative z-10">Sign Up</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </MainLayout>
    );
}