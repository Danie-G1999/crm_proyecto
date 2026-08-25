<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bitacora extends Model {
    use HasFactory;

    protected $table = 'bitacora';
    protected $fillable = [
        'cliente_id', 'asesor_id', 'caso_simulacion_id', 'fecha_hora',
        'canal', 'estado', 'motivo', 'gestion', 'proximo_paso'
    ];

    public function cliente() { return $this->belongsTo(Cliente::class, 'cliente_id'); }
    public function asesor() { return $this->belongsTo(Asesor::class, 'asesor_id'); }
    public function casoSimulacion() { return $this->belongsTo(CasoSimulacion::class, 'caso_simulacion_id'); }
}
