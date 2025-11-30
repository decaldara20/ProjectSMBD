@extends('layouts.app')

@section('title', 'Register')

@section('content')
<div class="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
     style="background-image: url('{{ asset('images/hero-bg.png') }}');">
    
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[pulse_4s_infinite]"></div>

    <div class="relative z-10 w-full max-w-[360px] p-6 bg-[#121212]/85 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-fade-in-up">
        
        <div class="text-center mb-5">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
                <i class="fas fa-user-plus text-white text-base"></i>
            </div>
            <h2 class="text-xl font-bold text-white mb-0.5 font-display tracking-tight">Create Account</h2>
            <p class="text-gray-400 text-[11px]">Join IMTVDB to curate your watchlist</p>
        </div>

        <form action="#" method="POST" class="space-y-3">
            @csrf
            
            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors ml-1">Full Name</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <i class="fas fa-user text-xs"></i>
                    </span>
                    <input type="text" name="name" placeholder="John Doe" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-purple-500 text-white text-xs rounded-xl pl-9 p-3 outline-none transition-all focus:ring-1 focus:ring-purple-500 placeholder-gray-600">
                </div>
            </div>

            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors ml-1">Email</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <i class="fas fa-envelope text-xs"></i>
                    </span>
                    <input type="email" name="email" placeholder="name@example.com" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-purple-500 text-white text-xs rounded-xl pl-9 p-3 outline-none transition-all focus:ring-1 focus:ring-purple-500 placeholder-gray-600">
                </div>
            </div>

            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors ml-1">Password</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <i class="fas fa-lock text-xs"></i>
                    </span>
                    <input type="password" name="password" placeholder="Create password" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-purple-500 text-white text-xs rounded-xl pl-9 p-3 outline-none transition-all focus:ring-1 focus:ring-purple-500 placeholder-gray-600">
                </div>
            </div>

            <div class="space-y-0.5 group">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors ml-1">Confirm Password</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <i class="fas fa-check-circle text-xs"></i>
                    </span>
                    <input type="password" name="password_confirmation" placeholder="Confirm password" 
                           class="w-full bg-[#1E1E1E] border border-gray-700 focus:border-purple-500 text-white text-xs rounded-xl pl-9 p-3 outline-none transition-all focus:ring-1 focus:ring-purple-500 placeholder-gray-600">
                </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all transform active:scale-95 mt-8 flex items-center justify-center gap-2 shadow-lg">
                <span>Sign Up</span> <i class="fas fa-arrow-right text-[10px]"></i>
            </button>
        </form>
    </div>

    <div class="relative z-10 mt-6 text-center animate-fade-in-up" style="animation-delay: 0.1s;">
        <p class="text-gray-400 text-xs bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
            Already have an account? 
            <a href="{{ route('login') }}" class="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-colors ml-1">
                Sign in
            </a>
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