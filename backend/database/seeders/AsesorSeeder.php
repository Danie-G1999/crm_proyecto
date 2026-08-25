<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AsesorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $asesores = [
            [
                'id' => 1,
                'nombre' => 'Alejandro Morales',
                'correo' => 'alejandro.morales@empresa.com',
                'rol' => 'ASESOR',
                'estado' => 'activo',
            ],
            [
                'id' => 2,
                'nombre' => 'Beatriz Pinzón',
                'correo' => 'beatriz.pinzon@empresa.com',
                'rol' => 'ASESOR',
                'estado' => 'activo',
            ],
            [
                'id' => 3,
                'nombre' => 'Camilo Sesto',
                'correo' => 'camilo.sesto@empresa.com',
                'rol' => 'SUPERVISOR',
                'estado' => 'activo',
            ],
            [
                'id' => 4,
                'nombre' => 'Daniela Ospina',
                'correo' => 'daniela.ospina@empresa.com',
                'rol' => 'ASESOR',
                'estado' => 'activo',
            ],
        ];

        foreach ($asesores as $asesor) {
            DB::table('asesores')->updateOrInsert(
                ['id' => $asesor['id']],
                array_merge($asesor, [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}
