<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    public function index()
    {
        return response()->json(Pago::with('productoCliente')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'producto_cliente_id' => 'required|exists:productos_clientes,id',
            'fecha_pago'          => 'required|date',
            'valor_pagado'        => 'required|numeric',
            'saldo_pendiente'     => 'required|numeric',
        ]);

        $pago = Pago::create($validated);
        return response()->json($pago->load('productoCliente'), 201);
    }

    public function show($id)
    {
        $pago = Pago::with('productoCliente')->findOrFail($id);
        return response()->json($pago, 200);
    }

    public function update(Request $request, $id)
    {
        $pago = Pago::findOrFail($id);

        $validated = $request->validate([
            'producto_cliente_id' => 'sometimes|required|exists:productos_clientes,id',
            'fecha_pago'          => 'sometimes|required|date',
            'valor_pagado'        => 'sometimes|required|numeric',
            'saldo_pendiente'     => 'sometimes|required|numeric',
        ]);

        $pago->update($validated);
        return response()->json($pago->load('productoCliente'), 200);
    }

    public function destroy($id)
    {
        Pago::destroy($id);
        return response()->json(['message' => 'Pago eliminado exitosamente'], 200);
    }
}
