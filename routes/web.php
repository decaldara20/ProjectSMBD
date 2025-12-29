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

// API Route untuk Live Search
Route::get('/api/search/suggestions', [GuestController::class, 'getSuggestions']);

// Route Autentikasi Custom
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

Route::post('/register', [AuthController::class, 'register'])->name('register.post');
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
    // Dashboard
    Route::get('/dashboard', [ProductionController::class, 'dashboard'])->name('production.dashboard');
    
    // Films (Global Read Only)
    Route::get('/films', [ProductionController::class, 'films'])->name('production.films');
    
    // TV Shows (List)
    Route::get('/tv-shows', [ProductionController::class, 'tvShows'])->name('production.tv-shows'); // Konsisten pakai tv-shows (dash)
    
    // TV Shows (CRUD Functions) 
    Route::post('/tv-shows', [ProductionController::class, 'storeTvShow'])->name('production.tv-shows.store');
    Route::put('/tv-shows/{id}', [ProductionController::class, 'updateTvShow'])->name('production.tv-shows.update');
    Route::delete('/tv-shows/{id}', [ProductionController::class, 'destroyTvShow'])->name('production.tv-shows.destroy');
    
    // People & Companies
    Route::get('/people', [ProductionController::class, 'people'])->name('production.people');
    Route::get('/companies', [ProductionController::class, 'companies'])->name('production.companies');
    
    // Genres (List + CRUD untuk Modal di Dashboard)
    Route::get('/genres', [ProductionController::class, 'genres'])->name('production.genres');
    
    // Modal Genre di Dashboard
    Route::post('/genres', [ProductionController::class, 'storeGenre'])->name('production.genres.store');
    Route::delete('/genres/{id}', [ProductionController::class, 'destroyGenre'])->name('production.genres.destroy');
});

