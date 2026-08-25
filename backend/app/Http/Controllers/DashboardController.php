<?php

namespace App\Http\Controllers;

use App\Models\Bitacora;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        // 1. Obtener registros de la bitácora de interacciones
        $interacciones = Bitacora::all();
        $total = $interacciones->count();

        // 2. Cálculo de métricas
        $resueltas = $interacciones->where('estado', 'Resuelto')->count();
        $escaladas = $interacciones->where('estado', 'Escalado')->count();

        $primerContactoCasos = $interacciones->where('primer_contacto', true);
        $primerContactoTotal = $primerContactoCasos->count();
        $primerContactoResueltos = $primerContactoCasos->where('estado', 'Resuelto')->count();

        $fcr = $primerContactoTotal > 0 ? round(($primerContactoResueltos / $primerContactoTotal) * 100) : 0;
        $tasaResolucion = $total > 0 ? round(($resueltas / $total) * 100) : 0;
        $tasaEscalamiento = $total > 0 ? round(($escaladas / $total) * 100) : 0;

        // 3. Última migración registrada en clientes
        $ultimaMigracion = Cliente::whereColumn('canal_inicial', '!=', 'canal_actual')
            ->latest('updated_at')
            ->first(['nombre', 'canal_inicial', 'canal_actual']);

        // 4. Conteo por canal
        $conteoCanales = Bitacora::selectRaw('canal, COUNT(*) as cantidad')
            ->groupBy('canal')
            ->pluck('cantidad', 'canal')
            ->toArray();

        return response()->json([
            'fcr'               => $fcr,
            'tasaResolucion'    => $tasaResolucion,
            'tasaEscalamiento'  => $tasaEscalamiento,
            'total'             => $total,
            'ultimaMigracion'   => $ultimaMigracion,
            'conteoCanales'     => $conteoCanales,
        ]);
    }
}
