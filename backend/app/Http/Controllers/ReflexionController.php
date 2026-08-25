<?php

namespace App\Http\Controllers;

use App\Models\Reflexion;
use Illuminate\Http\Request;

class ReflexionController extends Controller
{
    public function index()
    {
        return response()->json(Reflexion::with('asesor')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asesor_id' => 'required|exists:asesores,id',
            'reflexion' => 'required|string',
        ]);

        $reflexion = Reflexion::create($validated);
        return response()->json($reflexion->load('asesor'), 201);
    }

    public function show($id)
    {
        $reflexion = Reflexion::with('asesor')->findOrFail($id);
        return response()->json($reflexion, 200);
    }

    public function update(Request $request, $id)
    {
        $reflexion = Reflexion::findOrFail($id);

        $validated = $request->validate([
            'asesor_id' => 'sometimes|required|exists:asesores,id',
            'reflexion' => 'sometimes|required|string',
        ]);

        $reflexion->update($validated);
        return response()->json($reflexion->load('asesor'), 200);
    }

    public function destroy($id)
    {
        Reflexion::destroy($id);
        return response()->json(['message' => 'Reflexión eliminada exitosamente'], 200);
    }
}
