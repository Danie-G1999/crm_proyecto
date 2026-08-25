<?php

namespace App\Http\Controllers;

use App\Models\Guion;
use Illuminate\Http\Request;

class GuionController extends Controller
{
    public function index()
    {
        return response()->json(Guion::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'         => 'nullable|string|max:255',
            'canal'          => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'saludo'         => 'nullable|string',
            'identificacion' => 'nullable|string',
            'proposito'      => 'nullable|string',
            'sondeo'         => 'nullable|string',
            'gestion'        => 'nullable|string',
            'cierre'         => 'nullable|string',
        ]);

        $guion = Guion::create($validated);
        return response()->json($guion, 201);
    }

    public function show($id)
    {
        $guion = Guion::findOrFail($id);
        return response()->json($guion, 200);
    }

    public function update(Request $request, $id)
    {
        $guion = Guion::findOrFail($id);

        $validated = $request->validate([
            'titulo'         => 'nullable|string|max:255',
            'canal'          => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'saludo'         => 'nullable|string',
            'identificacion' => 'nullable|string',
            'proposito'      => 'nullable|string',
            'sondeo'         => 'nullable|string',
            'gestion'        => 'nullable|string',
            'cierre'         => 'nullable|string',
        ]);

        $guion->update($validated);
        return response()->json($guion, 200);
    }

    public function destroy($id)
    {
        Guion::destroy($id);
        return response()->json(['message' => 'Guión eliminado exitosamente'], 200);
    }
}
