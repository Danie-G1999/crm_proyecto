<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AsesorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProductoClienteController;
use App\Http\Controllers\CasoSimulacionController;
use App\Http\Controllers\BitacoraController;
use App\Http\Controllers\AuditoriaQaController;
use App\Http\Controllers\GuionController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ReflexionController;
use App\Http\Controllers\DashboardController;

// Ruta específica para consultar productos asociados a un cliente
Route::get('clientes/{cliente}/productos', [ProductoClienteController::class, 'porCliente']);
Route::get('dashboard/stats', [DashboardController::class, 'stats']);

Route::apiResources([
    'asesores'           => AsesorController::class,
    'clientes'           => ClienteController::class,
    'productos'          => ProductoController::class,
    'productos-clientes' => ProductoClienteController::class,
    'casos-simulacion'   => CasoSimulacionController::class,
    'bitacora'           => BitacoraController::class,
    'auditorias-qa'      => AuditoriaQaController::class,
    'guiones'            => GuionController::class,
    'pagos'              => PagoController::class,
    'reflexiones'        => ReflexionController::class,
]);
