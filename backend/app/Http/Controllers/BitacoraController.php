<?php

namespace App\Http\Controllers;

use App\Models\Bitacora;
use Illuminate\Http\Request;

class BitacoraController extends Controller
{
    public function index()
    {
        return response()->json(Bitacora::with(['cliente', 'asesor', 'casoSimulacion'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id'         => 'required|exists:clientes,id',
            'asesor_id'          => 'required|exists:asesores,id',
            'caso_simulacion_id' => 'required|exists:casos_simulacion,id',
            'fecha_hora'         => 'nullable|date',
            'canal'              => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'estado'             => 'nullable|in:en_gestion,resuelto,cerrado,escalado,seguimiento',
            'motivo'             => 'nullable|string|max:255',
            'gestion'            => 'nullable|string',
            'proximo_paso'       => 'nullable|string|max:255',
        ]);

        $bitacora = Bitacora::create($validated);
        return response()->json($bitacora->load(['cliente', 'asesor', 'casoSimulacion']), 201);
    }

    public function show($id)
    {
        $bitacora = Bitacora::with(['cliente', 'asesor', 'casoSimulacion'])->findOrFail($id);
        return response()->json($bitacora, 200);
    }

    public function update(Request $request, $id)
    {
        $bitacora = Bitacora::findOrFail($id);

        $validated = $request->validate([
            'cliente_id'         => 'sometimes|required|exists:clientes,id',
            'asesor_id'          => 'sometimes|required|exists:asesores,id',
            'caso_simulacion_id' => 'sometimes|required|exists:casos_simulacion,id',
            'fecha_hora'         => 'nullable|date',
            'canal'              => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'estado'             => 'nullable|in:en_gestion,resuelto,cerrado,escalado,seguimiento',
            'motivo'             => 'nullable|string|max:255',
            'gestion'            => 'nullable|string',
            'proximo_paso'       => 'nullable|string|max:255',
        ]);

        $bitacora->update($validated);
        return response()->json($bitacora->load(['cliente', 'asesor', 'casoSimulacion']), 200);
    }

    public function destroy($id)
    {
        Bitacora::destroy($id);
        return response()->json(['message' => 'Bitácora eliminada exitosamente'], 200);
    }
}
