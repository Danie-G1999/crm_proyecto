<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            AsesorSeeder::class,
            ProductoSeeder::class,
            ClienteSeeder::class,
            ProductoClienteSeeder::class,
            CasoSimulacionSeeder::class,
            GuionSeeder::class
        ]);

        // Resincronizar secuencias de IDs en PostgreSQL para evitar colisiones "unique violation"
        if (DB::getDriverName() === 'pgsql') {
            $tables = DB::select("
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE'
                AND table_name != 'migrations'
            ");

            foreach ($tables as $tableInfo) {
                $table = $tableInfo->table_name;
                $sequenceName = "{$table}_id_seq";

                $hasSequence = DB::select("SELECT to_regclass('{$sequenceName}') as seq");

                if (!empty($hasSequence) && $hasSequence[0]->seq !== null) {
                    $maxId = DB::table($table)->max('id');

                    if ($maxId && $maxId > 0) {
                        // Si la tabla tiene datos, el siguiente ID será $maxId + 1
                        DB::statement("SELECT setval('{$sequenceName}', {$maxId});");
                    } else {
                        // Si la tabla está vacía, reinicia la secuencia en 1 para la siguiente inserción
                        DB::statement("SELECT setval('{$sequenceName}', 1, false);");
                    }
                }
            }
        }
    }
}
