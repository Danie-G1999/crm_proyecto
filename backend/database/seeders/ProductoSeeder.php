<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $productos = [
            ['id' => 1, 'nombre' => 'Crédito de Consumo'],
            ['id' => 2, 'nombre' => 'Crédito de Libre Inversión'],
            ['id' => 3, 'nombre' => 'Tarjeta de Crédito'],
            ['id' => 4, 'nombre' => 'Crédito Vehicular'],
            ['id' => 5, 'nombre' => 'Crédito Hipotecario'],
            ['id' => 6, 'nombre' => 'Crédito Comercial'],
            ['id' => 7, 'nombre' => 'Microcrédito'],
        ];

        foreach ($productos as $producto) {
            DB::table('productos')->updateOrInsert(
                ['id' => $producto['id']],
                [
                    'nombre' => $producto['nombre'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
}
