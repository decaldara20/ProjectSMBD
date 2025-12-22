<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       // 1. AKUN EXECUTIVE (Untuk Dashboard Grafik/Analisa)
        User::updateOrCreate(
            ['email' => 'admin@imtvdb.com'], 
            [
                'name' => 'Boss Executive',
                'password' => Hash::make('password123'), 
                'role' => 'executive', 
                'email_verified_at' => now(),
            ]
        );

        // 2. AKUN PRODUCTION (Untuk Dashboard CRUD Film/TV)
        User::updateOrCreate(
            ['email' => 'prod@imtvdb.com'],
            [
                'name' => 'Production Lead',
                'password' => Hash::make('password123'),
                'role' => 'production', 
                'email_verified_at' => now(),
            ]
        );

        // 3. AKUN USER BIASA (Opsional, buat tes halaman Guest/User)
        User::updateOrCreate(
            ['email' => 'user@imtvdb.com'],
            [
                'name' => 'Movie Fan',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}
