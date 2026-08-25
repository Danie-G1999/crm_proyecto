<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = [
            ['id' => 1, 'nombre' => 'Carlos', 'apellidos' => 'Martínez', 'edad' => 35, 'ingresos_mensuales' => 2800000],
            ['id' => 2, 'nombre' => 'Andrés Felipe', 'apellidos' => 'Gómez', 'edad' => 29, 'ingresos_mensuales' => 4500000],
            ['id' => 3, 'nombre' => 'Diana Marcela', 'apellidos' => 'Rodríguez', 'edad' => 42, 'ingresos_mensuales' => 0],
            ['id' => 4, 'nombre' => 'Jorge Alberto', 'apellidos' => 'Pérez', 'edad' => 38, 'ingresos_mensuales' => 3800000],
            ['id' => 5, 'nombre' => 'Natalia Andrea', 'apellidos' => 'Torres', 'edad' => 31, 'ingresos_mensuales' => 5000000],
            ['id' => 6, 'nombre' => 'Sebastián', 'apellidos' => 'Ramírez', 'edad' => 36, 'ingresos_mensuales' => 3000000],
            ['id' => 7, 'nombre' => 'Mauricio', 'apellidos' => 'Herrera', 'edad' => 45, 'ingresos_mensuales' => 4200000],
            ['id' => 8, 'nombre' => 'Ricardo Antonio', 'apellidos' => 'López', 'edad' => 50, 'ingresos_mensuales' => 5500000],
            ['id' => 9, 'nombre' => 'Paola Andrea', 'apellidos' => 'Martínez', 'edad' => 34, 'ingresos_mensuales' => 2600000],
            ['id' => 10, 'nombre' => 'Fernando', 'apellidos' => 'Castillo', 'edad' => 40, 'ingresos_mensuales' => 6000000],
            ['id' => 11, 'nombre' => 'Laura Vanessa', 'apellidos' => 'Moreno', 'edad' => 27, 'ingresos_mensuales' => 2750000],
            ['id' => 12, 'nombre' => 'Óscar Javier', 'apellidos' => 'Méndez', 'edad' => 47, 'ingresos_mensuales' => 2500000],
            ['id' => 13, 'nombre' => 'Camila Juliana', 'apellidos' => 'Rojas', 'edad' => 25, 'ingresos_mensuales' => 3000000],
            ['id' => 14, 'nombre' => 'Juan Carlos', 'apellidos' => 'Vargas', 'edad' => 52, 'ingresos_mensuales' => 3800000],
        ];

        foreach ($clientes as $c) {
            DB::table('clientes')->updateOrInsert(
                ['id' => $c['id']],
                [
                    'numero_identificacion' => '10000000' . $c['id'],
                    'nombre' => $c['nombre'],
                    'apellidos' => $c['apellidos'],
                    'edad' => $c['edad'],
                    'ingresos_mensuales' => $c['ingresos_mensuales'],
                    'asesor_id' => 1, // Asesor asignado por defecto
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
}
