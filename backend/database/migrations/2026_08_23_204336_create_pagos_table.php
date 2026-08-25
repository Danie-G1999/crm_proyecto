<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_cliente_id')->constrained('productos_clientes')->cascadeOnDelete();
            $table->dateTime('fecha_pago');
            $table->decimal('valor_pagado', 12, 2);
            $table->decimal('saldo_pendiente', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pagos');
    }
};
