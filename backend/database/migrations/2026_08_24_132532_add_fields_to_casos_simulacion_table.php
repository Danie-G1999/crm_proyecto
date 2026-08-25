<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('casos_simulacion', function (Blueprint $table) {
            if (!Schema::hasColumn('casos_simulacion', 'tipo_procedimiento')) {
                $table->enum('tipo_procedimiento', ['negociacion', 'reporte', 'cierre'])->default('negociacion');
            }
            if (!Schema::hasColumn('casos_simulacion', 'canal')) {
                $table->string('canal')->default('TELEFONO');
            }
            if (!Schema::hasColumn('casos_simulacion', 'estado_simulacion')) {
                $table->enum('estado_simulacion', ['Pendiente', 'Solucionado'])->default('Pendiente');
            }
            if (!Schema::hasColumn('casos_simulacion', 'duracion_segundos')) {
                $table->integer('duracion_segundos')->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('casos_simulacion', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['tipo_procedimiento', 'canal', 'estado_simulacion', 'duracion_segundos'] as $column) {
                if (Schema::hasColumn('casos_simulacion', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
