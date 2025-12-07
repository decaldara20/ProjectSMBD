import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Login() {
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
        <MainLayout>
            <Head title="Log In" />

            {/* --- CUSTOM CSS: ANIMASI DIAGONAL --- */}
            <style>{`
                @keyframes diagonal-pan {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }
                .bg-hero-animated {
                    background-size: 150% 150%; /* Di-zoom supaya bisa gerak */
                    animation: diagonal-pan 15s ease infinite alternate; /* Gerak bolak-balik selama 15 detik */
                }
                /* Efek saat loading (Submit) */
                .is-loading .bg-hero-animated {
                    filter: brightness(1.2) blur(2px);
                    transition: all 0.5s ease;
                }
            `}</style>

            <div className={`min-h-[90vh] flex items-center justify-center relative overflow-hidden ${processing ? 'is-loading' : ''}`}>
                
                {/* --- BACKGROUND IMAGE GERAK --- */}
                <div 
                    className="absolute inset-0 bg-hero-animated z-0"
                    style={{ backgroundImage: "url('/images/hero-bg.png')" }}
                ></div>
                
                {/* Overlay Hitam (Supaya tulisan terbaca) */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                {/* --- LOGIN CARD --- */}
                <div className="relative z-10 w-full max-w-md p-8 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,255,255,0.15)]">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4 hover:scale-110 transition-transform duration-300">
                            <img src="/images/logo.png" alt="Logo" className="h-12 w-auto mx-auto drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                        </Link>
                        <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                            Welcome <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">Back</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Sign in to manage your watchlist & favorites.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-[#0a0a0a] border-white/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer" 
                                />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors hover:underline">Forgot password?</a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/5 pt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors hover:underline">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}