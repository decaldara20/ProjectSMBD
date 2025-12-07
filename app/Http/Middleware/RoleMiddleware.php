<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user login?
        if (!Auth::check()) {
            return redirect('/login');
        }

        // 2. Cek apakah role user sesuai dengan yang diminta route?
        // Kita bisa pakai parameter $role yang dikirim dari route (misal: 'executive' atau 'production')
        if (Auth::user()->role !== $role) {
            // Jika salah kamar, lempar error 403 (Forbidden) atau redirect dashboard masing-masing
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }
        
        return $next($request);
    }
}
