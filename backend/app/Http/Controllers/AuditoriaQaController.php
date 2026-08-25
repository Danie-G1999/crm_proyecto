<?php

namespace App\Http\Controllers;

use App\Models\AuditoriaQa;
use App\Models\AuditoriaQaDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditoriaQaController extends Controller
{
    public function index()
    {
        return response()->json(AuditoriaQa::with(['detalles', 'cliente', 'asesor', 'supervisor', 'evaluador', 'bitacora'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bitacora_id'     => 'required|exists:bitacora,id',
            'cliente_id'      => 'required|exists:clientes,id',
            'asesor_id'       => 'required|exists:asesores,id',
            'supervisor_id'   => 'required|exists:asesores,id',
            'evaluador_id'    => 'required|exists:asesores,id',
            'puntaje_total'   => 'nullable|numeric',
            'total_evaluados' => 'nullable|integer',
            'observaciones'   => 'nullable|string',
            'detalles'        => 'required|array',
            'detalles.*.criterio'  => 'required|string',
            'detalles.*.respuesta' => 'required|in:SI,NO,NA,si,no,na',
        ]);

        return DB::transaction(function () use ($validated) {
            $auditoria = AuditoriaQa::create([
                'bitacora_id'     => $validated['bitacora_id'],
                'cliente_id'      => $validated['cliente_id'],
                'asesor_id'       => $validated['asesor_id'],
                'supervisor_id'   => $validated['supervisor_id'],
                'evaluador_id'    => $validated['evaluador_id'],
                'puntaje_total'   => $validated['puntaje_total'] ?? 0,
                'total_evaluados' => $validated['total_evaluados'] ?? 12,
                'observaciones'   => $validated['observaciones'] ?? null,
            ]);

            foreach ($validated['detalles'] as $detalle) {
                AuditoriaQaDetalle::create([
                    'auditoria_qa_id' => $auditoria->id,
                    'criterio'        => $detalle['criterio'],
                    'respuesta'       => $detalle['respuesta'],
                ]);
            }

            return response()->json($auditoria->load('detalles'), 201);
        });
    }

    public function show($id)
    {
        $auditoria = AuditoriaQa::with(['detalles', 'cliente', 'asesor', 'supervisor', 'evaluador', 'bitacora'])->findOrFail($id);
        return response()->json($auditoria, 200);
    }

    public function update(Request $request, $id)
    {
        $auditoria = AuditoriaQa::findOrFail($id);

        $validated = $request->validate([
            'puntaje_total' => 'nullable|numeric',
            'observaciones' => 'nullable|string',
        ]);

        $auditoria->update($validated);
        return response()->json($auditoria->load('detalles'), 200);
    }

    public function destroy($id)
    {
        AuditoriaQa::destroy($id);
        return response()->json(['message' => 'Auditoría QA eliminada exitosamente'], 200);
    }
}
