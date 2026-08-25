<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductoClienteSeeder extends Seeder
{
    public function run(): void
    {
        $productosClientes = [
            ['id' => 1, 'cliente_id' => 1, 'producto_id' => 1, 'valor' => 5000000, 'saldo' => 4800000, 'cuota_mensual' => 480000],
            ['id' => 2, 'cliente_id' => 2, 'producto_id' => 2, 'valor' => 4000000, 'saldo' => 3200000, 'cuota_mensual' => 400000],
            ['id' => 3, 'cliente_id' => 3, 'producto_id' => 1, 'valor' => 7000000, 'saldo' => 6500000, 'cuota_mensual' => 550000],
            ['id' => 4, 'cliente_id' => 4, 'producto_id' => 3, 'valor' => 3000000, 'saldo' => 2850000, 'cuota_mensual' => 350000],
            ['id' => 5, 'cliente_id' => 5, 'producto_id' => 4, 'valor' => 20000000, 'saldo' => 18700000, 'cuota_mensual' => 950000],
            ['id' => 6, 'cliente_id' => 6, 'producto_id' => 2, 'valor' => 8000000, 'saldo' => 7200000, 'cuota_mensual' => 650000],
            ['id' => 7, 'cliente_id' => 7, 'producto_id' => 1, 'valor' => 6000000, 'saldo' => 5400000, 'cuota_mensual' => 500000],
            ['id' => 8, 'cliente_id' => 8, 'producto_id' => 4, 'valor' => 15000000, 'saldo' => 12500000, 'cuota_mensual' => 850000],
            ['id' => 9, 'cliente_id' => 9, 'producto_id' => 3, 'valor' => 4500000, 'saldo' => 3950000, 'cuota_mensual' => 450000],
            ['id' => 10, 'cliente_id' => 10, 'producto_id' => 2, 'valor' => 11000000, 'saldo' => 9800000, 'cuota_mensual' => 750000],
            ['id' => 11, 'cliente_id' => 11, 'producto_id' => 1, 'valor' => 3000000, 'saldo' => 2700000, 'cuota_mensual' => 300000],
            ['id' => 12, 'cliente_id' => 12, 'producto_id' => 6, 'valor' => 18000000, 'saldo' => 15600000, 'cuota_mensual' => 1200000],
            ['id' => 13, 'cliente_id' => 13, 'producto_id' => 3, 'valor' => 2000000, 'saldo' => 1850000, 'cuota_mensual' => 220000],
            ['id' => 14, 'cliente_id' => 14, 'producto_id' => 1, 'valor' => 10000000, 'saldo' => 8900000, 'cuota_mensual' => 700000],
        ];

        foreach ($productosClientes as $item) {
            DB::table('productos_clientes')->updateOrInsert(
                ['id' => $item['id']],
                array_merge($item, [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}
