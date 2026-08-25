<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        return response()->json(Producto::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'nullable|numeric',
            'estado' => 'nullable|in:ACTIVO,INACTIVO',
        ]);

        $producto = Producto::create($validated);
        return response()->json($producto, 201);
    }

    public function show($id)
    {
        $producto = Producto::findOrFail($id);
        return response()->json($producto, 200);
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'precio' => 'nullable|numeric',
            'estado' => 'nullable|in:ACTIVO,INACTIVO',
        ]);

        $producto->update($validated);
        return response()->json($producto, 200);
    }

    public function destroy($id)
    {
        Producto::destroy($id);
        return response()->json(['message' => 'Producto eliminado exitosamente'], 200);
    }
}
