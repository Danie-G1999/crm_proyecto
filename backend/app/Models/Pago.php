<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model {
    use HasFactory;

    protected $table = 'pagos';
    protected $fillable = ['producto_cliente_id', 'fecha_pago', 'valor_pagado', 'saldo_pendiente'];

    public function productoCliente() { return $this->belongsTo(ProductoCliente::class, 'producto_cliente_id'); }
}
