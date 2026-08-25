<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditoriaQa extends Model {
    use HasFactory;

    protected $table = 'auditorias_qa';
    protected $fillable = [
        'bitacora_id', 'cliente_id', 'asesor_id', 'supervisor_id',
        'evaluador_id', 'puntaje_total', 'total_evaluados', 'observaciones'
    ];

    public function bitacora() { return $this->belongsTo(Bitacora::class, 'bitacora_id'); }
    public function cliente() { return $this->belongsTo(Cliente::class, 'cliente_id'); }
    public function asesor() { return $this->belongsTo(Asesor::class, 'asesor_id'); }
    public function supervisor() { return $this->belongsTo(Asesor::class, 'supervisor_id'); }
    public function evaluador() { return $this->belongsTo(Asesor::class, 'evaluador_id'); }
    public function detalles() { return $this->hasMany(AuditoriaQaDetalle::class, 'auditoria_qa_id'); }
}
