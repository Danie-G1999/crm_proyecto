<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('auditorias_qa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bitacora_id')->constrained('bitacora')->cascadeOnDelete();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('asesor_id')->constrained('asesores')->cascadeOnDelete();
            $table->foreignId('supervisor_id')->constrained('asesores')->cascadeOnDelete();
            $table->foreignId('evaluador_id')->constrained('asesores')->cascadeOnDelete();
            $table->decimal('puntaje_total', 5, 2)->nullable();
            $table->integer('total_evaluados')->default(12);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('auditorias_qa');
    }
};
