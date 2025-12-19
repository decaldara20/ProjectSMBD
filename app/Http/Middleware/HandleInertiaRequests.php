<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\DB;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // 1. DATA USER LOGIN
            'auth' => [
                'user' => $request->user(),
            ],

            // 2. FLASH MESSAGES
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // 3. DATA GLOBAL GENRES (REVISI SESUAI STRUKTUR DB ANDA)
            // Kita ambil dari 'title_genres' agar semua genre (IMDb + TV) tertangkap.
            'globalGenres' => \Illuminate\Support\Facades\Cache::remember('nav_global_genres', 60 * 60 * 24, function () {
                try {
                    return DB::connection('sqlsrv')
                        ->table('title_genres')
                        ->select('genre_name')
                        ->distinct() // PENTING: Agar tidak ada duplikat (misal 'Drama' muncul 1000x)
                        ->whereNotNull('genre_name')
                        ->where('genre_name', '!=', '')
                        ->orderBy('genre_name')
                        ->get();
                        
                } catch (\Exception $e) {
                    return [];
                }
            }),
        ]);
    }
}
