<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Cliente::with('asesor')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_identificacion'   => 'nullable|in:TARJETA_IDENTIDAD,CEDULA_CIUDADANIA,PASAPORTE',
            'numero_identificacion' => 'required|string|max:255',
            'nombre'                => 'required|string|max:255',
            'apellidos'             => 'required|string|max:255',
            'correo_electronico'    => 'nullable|email|max:255',
            'direccion'             => 'nullable|string|max:255',
            'edad'                  => 'nullable|integer',
            'ingresos_mensuales'    => 'nullable|numeric',
            'nivel_digital'         => 'nullable|in:BAJO,MEDIO,ALTO',
            'canal_habitual'        => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'campaña'               => 'nullable|string|max:255',
            'prioridad'             => 'nullable|in:BAJO,MEDIO,ALTO',
            'estado'                => 'nullable|in:en_gestion,resuelto,cerrado,escalado,seguimiento',
            'canal_inicial'         => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'canal_actual'          => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'ultimo_contacto'       => 'nullable|date',
            'asesor_id'             => 'required|exists:asesores,id',
            'observaciones'         => 'nullable|string',
        ]);

        $cliente = Cliente::create($validated);
        return response()->json($cliente->load('asesor'), 201);
    }

    public function show($id)
    {
        $cliente = Cliente::with(['asesor', 'productosClientes.producto', 'casosSimulacion'])->findOrFail($id);
        return response()->json($cliente, 200);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'tipo_identificacion'   => 'nullable|in:TARJETA_IDENTIDAD,CEDULA_CIUDADANIA,PASAPORTE',
            'numero_identificacion' => 'sometimes|required|string|max:255',
            'nombre'                => 'sometimes|required|string|max:255',
            'apellidos'             => 'sometimes|required|string|max:255',
            'correo_electronico'    => 'nullable|email|max:255',
            'direccion'             => 'nullable|string|max:255',
            'edad'                  => 'nullable|integer',
            'ingresos_mensuales'    => 'nullable|numeric',
            'nivel_digital'         => 'nullable|in:BAJO,MEDIO,ALTO',
            'canal_habitual'        => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'campaña'               => 'nullable|string|max:255',
            'prioridad'             => 'nullable|in:BAJO,MEDIO,ALTO',
            'estado'                => 'nullable|in:en_gestion,resuelto,cerrado,escalado,seguimiento',
            'canal_inicial'         => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'canal_actual'          => 'nullable|in:TELEFONO,WHATSAPP,CHAT_WEB,CORREO_ELECTRONICO,REDES_SOCIALES',
            'ultimo_contacto'       => 'nullable|date',
            'asesor_id'             => 'sometimes|required|exists:asesores,id',
            'observaciones'         => 'nullable|string',
        ]);

        $cliente->update($validated);
        return response()->json($cliente->load('asesor'), 200);
    }

    public function destroy($id)
    {
        Cliente::destroy($id);
        return response()->json(['message' => 'Cliente eliminado exitosamente'], 200);
    }
}
