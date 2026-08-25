<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CasoSimulacion extends Model {
    use HasFactory;

    protected $table = 'casos_simulacion';
    protected $fillable = [
    'nombre',
    'cliente_id',
    'producto_id',
    'tipo_procedimiento',
    'canal',
    'estado_simulacion',
    'duracion_segundos',
];

    public function cliente() { return $this->belongsTo(Cliente::class, 'cliente_id'); }
    public function productoCliente() { return $this->belongsTo(ProductoCliente::class, 'producto_cliente_id'); }
    public function bitacoras() { return $this->hasMany(Bitacora::class, 'caso_simulacion_id'); }
}
