<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExecutiveController;
use App\Http\Controllers\ProductionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- USER 1: RUTE GUEST ---

// Halaman Beranda
Route::get('/', [GuestController::class, 'homepage'])->name('homepage');

// Halaman Explore (Semua Data)
Route::get('/explore', [GuestController::class, 'explore'])->name('explore.index');

// Halaman Katalog Films
Route::get('/films', [GuestController::class, 'films'])->name('films.index');

// Halaman Katalog TV Shows
Route::get('/tv-shows', [GuestController::class, 'tvShows'])->name('tv.index');

// Halaman Katalog Artis
Route::get('/artists', [GuestController::class, 'artists'])->name('artists.index');

// --- PROTECTED ROUTES (HANYA YANG SUDAH LOGIN) ---
Route::middleware(['auth'])->group(function () {

    // Halaman History
    Route::get('/history', [GuestController::class, 'history'])->name('history.index');

    // Hapus History Keseluruhan
    Route::post('/history/clear', [GuestController::class, 'clearHistory'])->name('history.clear');

    // Hapus Satu Item History
    Route::post('/history/remove', [GuestController::class, 'removeHistoryItem'])->name('history.remove');

    // Halaman Favorit
    Route::get('/favorites', [GuestController::class, 'favorites'])->name('favorites.index');

    // Aksi Toggle (Tambah/Hapus) Favorit
    Route::post('/favorites/toggle', [GuestController::class, 'toggleFavorite'])->name('favorites.toggle');

    // Route Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

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



// GROUP EXECUTIVE
Route::middleware(['auth', 'role:executive'])->prefix('executive')->group(function () {
    Route::get('/dashboard', [ExecutiveController::class, 'dashboard'])->name('executive.dashboard');
    Route::get('/trends', [ExecutiveController::class, 'trends'])->name('executive.trends');
    Route::get('/talents', [ExecutiveController::class, 'talents'])->name('executive.talents');
    Route::get('/platforms', [ExecutiveController::class, 'platforms'])->name('executive.platforms');
    // Nanti tambah route report dll disini
});

// GROUP PRODUCTION
Route::middleware(['auth', 'role:production'])->prefix('production')->group(function () {
    Route::get('/dashboard', [ProductionController::class, 'dashboard'])->name('production.dashboard');
    Route::get('/movies', [ProductionController::class, 'movies'])->name('production.movies');
    Route::get('/tv-shows', [ProductionController::class, 'tvShows'])->name('production.tv_shows');
    Route::get('/people', [ProductionController::class, 'people'])->name('production.people');
    Route::get('/companies', [ProductionController::class, 'companies'])->name('production.companies');
    Route::get('/genres', [ProductionController::class, 'genres'])->name('production.genres');
    // Nanti tambah route CRUD movie disini
});