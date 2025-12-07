<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('search_logs', function (Blueprint $table) {
        $table->id();
        $table->string('keyword');     // Kata kunci yang dicari (misal: "Avatar 3")
        $table->integer('results_count'); // Berapa hasil yang ditemukan (0 = Gagal)
        $table->ipAddress('ip_address')->nullable(); // Opsional: Lacak IP
        $table->timestamps(); // Mencatat waktu (created_at) untuk filter "30 Days"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('search_logs');
    }
};
