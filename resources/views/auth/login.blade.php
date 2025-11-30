@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
     style="background-image: url('{{ asset('images/hero-bg.png') }}');">
    
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[pulse_4s_infinite]"></div>

    <div class="relative z-10 w-full max-w-[360px] p-5 bg-[#121212]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] animate-fade-in-up">
        
        <div class="text-center mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
            <h2 class="text-xl font-bold text-white mb-0.5 font-display tracking-tight">Welcome Back</h2>
            <p class="text-gray-400 text-[11px]">Sign in to continue to IMTVDB</p>
        </div>

        <form action="{{ route('login.post') }}" method="POST" class="space-y-3">
            @csrf
            
            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">Email</label>
                <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                        <i class="fas fa-envelope text-xs"></i>
                    </span>
                    <input type="email" name="email" placeholder="name@example.com" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-cyan-500 text-white text-xs rounded-lg pl-8 p-2.5 outline-none transition-all focus:ring-1 focus:ring-cyan-500 placeholder-gray-600">
                </div>
            </div>

            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">Password</label>
                <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                        <i class="fas fa-lock text-xs"></i>
                    </span>
                    <input type="password" name="password" placeholder="••••••••" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-cyan-500 text-white text-xs rounded-lg pl-8 p-2.5 outline-none transition-all focus:ring-1 focus:ring-cyan-500 placeholder-gray-600">
                </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                <label class="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group">
                    <input type="checkbox" class="rounded bg-[#333] border-gray-600 text-cyan-500 focus:ring-0 w-3 h-3 group-hover:border-cyan-500 transition-colors">
                    <span>Remember me</span>
                </label>
                <a href="#" class="hover:text-cyan-400 transition-colors hover:underline">Forgot?</a>
            </div>

            <button type="submit" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform active:scale-95 mt-3 flex items-center justify-center gap-2">
                <span>Sign In</span> <i class="fas fa-arrow-right text-[10px]"></i>
            </button>
        </form>

        <div class="my-4 flex items-center gap-2 opacity-40">
            <div class="h-px bg-gray-500 flex-1"></div>
            <span class="text-[9px] text-gray-300 uppercase tracking-widest">OR</span>
            <div class="h-px bg-gray-500 flex-1"></div>
        </div>

        <div class="flex justify-center gap-3">
            <!-- <button class="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center text-gray-400 text-sm" title="Google">
                <i class="fab fa-google"></i>
            </button> -->
            <button class="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white hover:text-white transition-all flex items-center justify-center text-gray-400 text-sm" title="GitHub">
                <i class="fab fa-github"></i>
            </button>
            <!-- <button class="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400 hover:text-blue-400 transition-all flex items-center justify-center text-gray-400 text-sm" title="Twitter">
                <i class="fab fa-twitter"></i>
            </button> -->
        </div>

        <p class="mt-4 text-center text-gray-500 text-[11px]">
            New here? 
            <a href="{{ route('register') }}" class="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-colors">Create Account</a>
        </p>
    </div>
</div>

<style>
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
</style>
@endsection