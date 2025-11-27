<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GuestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- USER 1: RUTE GUEST ---

Route::get('/', [GuestController::class, 'homepage'])->name('homepage');

// PERUBAHAN DI SINI: Ganti 'searchTitles' menjadi 'search'
// sesuai dengan nama function baru di Controller Anda.
// Ganti 'searchTitles' menjadi 'search'
Route::get('/search', [GuestController::class, 'search'])->name('search');

Route::get('/title/{tconst}', [GuestController::class, 'showTitleDetail'])->name('title.detail');
Route::get('/person/{nconst}', [GuestController::class, 'showPersonDetail'])->name('person.detail');

// Rute Detail TV Show (Parameter pakai show_id)
Route::get('/tv/{show_id}', [GuestController::class, 'showTvDetail'])->name('tv.detail');

//rute aktor
Route::get('/person/{nconst}', [GuestController::class, 'showPersonDetail'])->name('person.detail');