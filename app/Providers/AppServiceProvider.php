<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Kirim variabel $globalGenres ke SEMUA View
        // Gunakan try-catch agar tidak error saat migrasi pertama kali
        try {
            if (DB::connection('sqlsrv')->getSchemaBuilder()->hasTable('genre_types')) {
                $globalGenres = DB::connection('sqlsrv')
                    ->table('genre_types')
                    ->orderBy('genre_name')
                    ->get();
                
                View::share('globalGenres', $globalGenres);
            }
        } catch (\Exception $e) {
            // Diamkan saja jika belum konek DB
        }
    }
}
