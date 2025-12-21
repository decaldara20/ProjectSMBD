<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Tampilkan Halaman Login
    public function showLogin()
    {
        // Panggil komponen AuthSlider, set mode awal ke 'login'
        return Inertia::render('Auth/AuthSlider', [
            'defaultView' => 'login'
        ]);
    }

    // Tampilkan Halaman Register
    public function showRegister()
    {
        // Panggil komponen AuthSlider (FILE YANG SAMA), tapi mode awal 'register'
        return Inertia::render('Auth/AuthSlider', [
            'defaultView' => 'register'
        ]);
    }

    // Proses Login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            // --- LOGIKA REDIRECT BERDASARKAN ROLE ---
            $role = Auth::user()->role;

            if ($role === 'executive') {
                return redirect()->intended(route('executive.dashboard'));
            }

            if ($role === 'production') {
                return redirect()->intended(route('production.dashboard'));
            }
            // ----------------------------------------

            // Default user biasa ke Homepage
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function register(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
        ]);

        // 2. Buat User baru
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
        ]);

        // 3. Login Otomatis setelah Register
        Auth::login($user);

        // 4. Redirect ke Homepage
        return redirect()->route('homepage')->with('success', 'Registration successful! Welcome ' . $user->name);
    }

    // Proses Logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}