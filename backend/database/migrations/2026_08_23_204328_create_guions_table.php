<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('guiones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->nullable();
            $table->enum('canal', ['TELEFONO', 'WHATSAPP', 'CHAT_WEB', 'CORREO_ELECTRONICO', 'REDES_SOCIALES'])->nullable();
            $table->text('saludo')->nullable();
            $table->text('identificacion')->nullable();
            $table->text('proposito')->nullable();
            $table->text('sondeo')->nullable();
            $table->text('gestion')->nullable();
            $table->text('cierre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('guiones');
    }
};
