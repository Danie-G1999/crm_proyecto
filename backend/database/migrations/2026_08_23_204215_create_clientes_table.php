<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo_identificacion', ['TARJETA_IDENTIDAD', 'CEDULA_CIUDADANIA', 'PASAPORTE'])->nullable();
            $table->string('numero_identificacion');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('correo_electronico')->nullable();
            $table->string('direccion')->nullable();
            $table->integer('edad')->nullable();
            $table->decimal('ingresos_mensuales', 12, 2)->nullable();
            $table->enum('nivel_digital', ['BAJO', 'MEDIO', 'ALTO'])->nullable();
            $table->enum('canal_habitual', ['TELEFONO', 'WHATSAPP', 'CHAT_WEB', 'CORREO_ELECTRONICO', 'REDES_SOCIALES'])->nullable();
            $table->string('campaña')->nullable();
            $table->enum('prioridad', ['BAJO', 'MEDIO', 'ALTO'])->nullable();
            $table->enum('estado', ['en_gestion', 'resuelto', 'cerrado', 'escalado', 'seguimiento'])->nullable();
            $table->enum('canal_inicial', ['TELEFONO', 'WHATSAPP', 'CHAT_WEB', 'CORREO_ELECTRONICO', 'REDES_SOCIALES'])->nullable();
            $table->enum('canal_actual', ['TELEFONO', 'WHATSAPP', 'CHAT_WEB', 'CORREO_ELECTRONICO', 'REDES_SOCIALES'])->nullable();
            $table->dateTime('ultimo_contacto')->nullable();
            $table->foreignId('asesor_id')->constrained('asesores')->cascadeOnDelete();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('clientes');
    }
};
