<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditoriaQaDetalle extends Model {
    use HasFactory;

    protected $table = 'auditoria_qa_detalles';
    protected $fillable = ['auditoria_qa_id', 'criterio', 'respuesta'];

    public function auditoriaQa() { return $this->belongsTo(AuditoriaQa::class, 'auditoria_qa_id'); }
}
