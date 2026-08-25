<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductoCliente extends Model {
    use HasFactory;

    protected $table = 'productos_clientes';
    protected $fillable = [
        'producto_id', 'cliente_id', 'valor', 'cuota_mensual',
        'tipo_plazo', 'plazo_maximo', 'plazo_actual', 'saldo'
    ];

    public function producto() { return $this->belongsTo(Producto::class, 'producto_id'); }
    public function cliente() { return $this->belongsTo(Cliente::class, 'cliente_id'); }
    public function pagos() { return $this->hasMany(Pago::class, 'producto_cliente_id'); }
}
