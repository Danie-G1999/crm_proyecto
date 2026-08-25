<?php

namespace App\Http\Controllers;

use App\Models\CasoSimulacion;
use Illuminate\Http\Request;

class CasoSimulacionController extends Controller
{
    public function index()
    {
        return response()->json(CasoSimulacion::with(['cliente', 'productoCliente.producto'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'             => 'required|string',
            'cliente_id'         => 'required|exists:clientes,id',
            'producto_id'        => 'required|exists:productos,id',
            'tipo_procedimiento' => 'required|in:negociacion,reporte,cierre',
            'canal'              => 'required|string',
            'estado_simulacion'  => 'required|in:Pendiente,Solucionado',
            'duracion_segundos'  => 'required|integer|min:0',
        ]);

        $caso = CasoSimulacion::create($validated);
        return response()->json($caso->load(['cliente', 'productoCliente.producto']), 201);
    }

    public function show($id)
    {
        $caso = CasoSimulacion::with(['cliente', 'productoCliente.producto', 'bitacoras'])->findOrFail($id);
        return response()->json($caso, 200);
    }

    public function update(Request $request, $id)
    {
        $caso = CasoSimulacion::findOrFail($id);

        $validated = $request->validate([
            'nombre'             => 'required|string',
            'cliente_id'         => 'required|exists:clientes,id',
            'producto_id'        => 'required|exists:productos,id',
            'tipo_procedimiento' => 'required|in:negociacion,reporte,cierre',
            'canal'              => 'required|string',
            'estado_simulacion'  => 'required|in:Pendiente,Solucionado',
            'duracion_segundos'  => 'required|integer|min:0',
        ]);

        $caso->update($validated);
        return response()->json($caso->load(['cliente', 'productoCliente.producto']), 200);
    }

    public function destroy($id)
    {
        CasoSimulacion::destroy($id);
        return response()->json(['message' => 'Caso de simulación eliminado exitosamente'], 200);
    }
}
