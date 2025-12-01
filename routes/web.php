<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- USER 1: RUTE GUEST ---

// Halaman Beranda
Route::get('/', [GuestController::class, 'homepage'])->name('homepage');

// Halaman Katalog Movies
Route::get('/movies', [GuestController::class, 'movies'])->name('movies.index');

// Halaman Katalog TV Shows
Route::get('/tv-shows', [GuestController::class, 'tvShows'])->name('tv.index');

// Halaman Katalog Artis
Route::get('/artists', [GuestController::class, 'artists'])->name('artists.index');

// Halaman History
Route::get('/history', [GuestController::class, 'history'])->name('history.index');

// Hapus History
Route::post('/history/clear', [GuestController::class, 'clearHistory'])->name('history.clear');

// Halaman Favorit
Route::get('/favorites', [GuestController::class, 'favorites'])->name('favorites.index');

// Aksi Toggle (Tambah/Hapus) Favorit
Route::post('/favorites/toggle', [GuestController::class, 'toggleFavorite'])->name('favorites.toggle');

// PERUBAHAN DI SINI: Ganti 'searchTitles' menjadi 'search'
// sesuai dengan nama function baru di Controller Anda.
// Ganti 'searchTitles' menjadi 'search'
Route::get('/search', [GuestController::class, 'search'])->name('search');

Route::get('/title/{tconst}', [GuestController::class, 'showTitleDetail'])->name('title.detail');
// Rute Detail TV Show (Menggunakan ID Angka)
Route::get('/tv/{show_id}', [GuestController::class, 'showTvDetail'])->name('tv.detail');
Route::get('/person/{nconst}', [GuestController::class, 'showPersonDetail'])->name('person.detail');

// Rute Detail TV Show (Parameter pakai show_id)
Route::get('/tv/{show_id}', [GuestController::class, 'showTvDetail'])->name('tv.detail');

//rute aktor
Route::get('/person/{nconst}', [GuestController::class, 'showPersonDetail'])->name('person.detail');

// Halaman About Us
Route::get('/about', [GuestController::class, 'about'])->name('about');



// Route Autentikasi Custom
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');

// Route Logout (Wajib POST demi keamanan)
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');