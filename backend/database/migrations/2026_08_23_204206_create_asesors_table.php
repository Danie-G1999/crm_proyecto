<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('asesores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('correo')->unique();
            $table->enum('rol', ['ASESOR', 'SUPERVISOR', 'EVALUADOR_CALIDAD', 'ADMIN'])->default('ASESOR');
            $table->string('estado')->default('activo');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('asesores');
    }
};
