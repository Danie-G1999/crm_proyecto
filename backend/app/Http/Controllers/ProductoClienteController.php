<?php

namespace App\Http\Controllers;

use App\Models\ProductoCliente;
use Illuminate\Http\Request;

class ProductoClienteController extends Controller
{
    public function index()
    {
        return response()->json(ProductoCliente::with(['producto', 'cliente'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'producto_id'   => 'required|exists:productos,id',
            'cliente_id'    => 'required|exists:clientes,id',
            'valor'         => 'nullable|numeric',
            'cuota_mensual' => 'nullable|numeric',
            'tipo_plazo'    => 'nullable|in:MENSUAL,QUINCENAL',
            'plazo_maximo'  => 'nullable|integer',
            'plazo_actual'  => 'nullable|integer',
            'saldo'         => 'nullable|numeric',
        ]);

        $registro = ProductoCliente::create($validated);
        return response()->json($registro->load(['producto', 'cliente']), 201);
    }

    public function show($id)
    {
        $registro = ProductoCliente::with(['producto', 'cliente', 'pagos'])->findOrFail($id);
        return response()->json($registro, 200);
    }

    public function update(Request $request, $id)
    {
        $registro = ProductoCliente::findOrFail($id);

        $validated = $request->validate([
            'producto_id'   => 'sometimes|required|exists:productos,id',
            'cliente_id'    => 'sometimes|required|exists:clientes,id',
            'valor'         => 'nullable|numeric',
            'cuota_mensual' => 'nullable|numeric',
            'tipo_plazo'    => 'nullable|in:MENSUAL,QUINCENAL',
            'plazo_maximo'  => 'nullable|integer',
            'plazo_actual'  => 'nullable|integer',
            'saldo'         => 'nullable|numeric',
        ]);

        $registro->update($validated);
        return response()->json($registro->load(['producto', 'cliente']), 200);
    }

    public function destroy($id)
    {
        ProductoCliente::destroy($id);
        return response()->json(['message' => 'Relación Producto-Cliente eliminada exitosamente'], 200);
    }

    public function porCliente($clienteId)
    {
        // Obtiene los productos cargando la relación del producto base
        $productos = ProductoCliente::with('producto')
            ->where('cliente_id', $clienteId)
            ->get();

        return response()->json([
            'data' => $productos
        ], 200);
    }
}
