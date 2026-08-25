<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model {
    use HasFactory;

    protected $table = 'clientes';
    protected $fillable = [
        'tipo_identificacion', 'numero_identificacion', 'nombre', 'apellidos',
        'correo_electronico', 'direccion', 'edad', 'ingresos_mensuales',
        'nivel_digital', 'canal_habitual', 'campaña', 'prioridad', 'estado',
        'canal_inicial', 'canal_actual', 'ultimo_contacto', 'asesor_id', 'observaciones'
    ];

    public function asesor() { return $this->belongsTo(Asesor::class, 'asesor_id'); }
    public function productosClientes() { return $this->hasMany(ProductoCliente::class, 'cliente_id'); }
    public function casosSimulacion() { return $this->hasMany(CasoSimulacion::class, 'cliente_id'); }
}
