<?php

namespace App\Http\Controllers;

use App\Models\Asesor;
use Illuminate\Http\Request;

class AsesorController extends Controller
{
    public function index()
    {
        return response()->json(Asesor::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'correo' => 'required|email|unique:asesores,correo',
            'rol'    => 'required|in:ASESOR,SUPERVISOR,EVALUADOR_CALIDAD,ADMIN',
            'estado' => 'nullable|string|max:50',
        ]);

        $asesor = Asesor::create($validated);
        return response()->json($asesor, 201);
    }

    public function show($id)
    {
        $asesor = Asesor::with(['clientes', 'bitacoras', 'reflexiones'])->findOrFail($id);
        return response()->json($asesor, 200);
    }

    public function update(Request $request, $id)
    {
        $asesor = Asesor::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'correo' => 'sometimes|required|email|unique:asesores,correo,' . $id,
            'rol'    => 'sometimes|required|in:ASESOR,SUPERVISOR,EVALUADOR_CALIDAD,ADMIN',
            'estado' => 'nullable|string|max:50',
        ]);

        $asesor->update($validated);
        return response()->json($asesor, 200);
    }

    public function destroy($id)
    {
        Asesor::destroy($id);
        return response()->json(['message' => 'Asesor eliminado exitosamente'], 200);
    }
}
