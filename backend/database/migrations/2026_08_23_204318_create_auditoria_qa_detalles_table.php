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
        Schema::create('auditoria_qa_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auditoria_qa_id')->constrained('auditorias_qa')->cascadeOnDelete();
            $table->string('criterio');
            $table->enum('respuesta', ['SI', 'NO', 'NA']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_qa_detalles');
    }
};
