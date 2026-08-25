<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bitacora', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('asesor_id')->constrained('asesores')->cascadeOnDelete();
            $table->foreignId('caso_simulacion_id')->constrained('casos_simulacion')->cascadeOnDelete();
            $table->dateTime('fecha_hora')->nullable();
            $table->enum('canal', ['TELEFONO', 'WHATSAPP', 'CHAT_WEB', 'CORREO_ELECTRONICO', 'REDES_SOCIALES'])->nullable();
            $table->enum('estado', ['en_gestion', 'resuelto', 'cerrado', 'escalado', 'seguimiento'])->nullable();
            $table->string('motivo')->nullable();
            $table->text('gestion')->nullable();
            $table->string('proximo_paso')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bitacora');
    }
};
