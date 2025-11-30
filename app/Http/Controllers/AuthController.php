<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    // Tampilkan Halaman Login
    public function showLogin()
    {
        return view('auth.login');
    }

    // Tampilkan Halaman Register
    public function showRegister()
    {
        return view('auth.register');
    }

    // Proses Login (Placeholder)
    public function login(Request $request)
    {
        // Nanti diisi logika validasi ke tabel 'users'
        return redirect()->route('homepage'); 
    }
}