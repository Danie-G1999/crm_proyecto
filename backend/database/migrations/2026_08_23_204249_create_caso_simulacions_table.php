<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('casos_simulacion', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('producto_cliente_id')->constrained('productos_clientes')->cascadeOnDelete();
            $table->integer('dias_mora')->default(0);
            $table->date('ultimo_pago_fecha')->nullable();
            $table->string('situacion');
            $table->decimal('capacidad_estimada_pago', 12, 2)->nullable();
            $table->text('actitud_cliente')->nullable();
            $table->text('objetivo_asesor')->nullable();
            $table->string('estado_simulacion')->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('casos_simulacion');
    }
};
