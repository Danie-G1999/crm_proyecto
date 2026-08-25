<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('productos_clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->decimal('valor', 12, 2)->nullable();
            $table->decimal('cuota_mensual', 12, 2)->nullable();
            $table->enum('tipo_plazo', ['MENSUAL', 'QUINCENAL'])->nullable();
            $table->integer('plazo_maximo')->nullable();
            $table->integer('plazo_actual')->nullable();
            $table->decimal('saldo', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('productos_clientes');
    }
};
