<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model {
    use HasFactory;

    protected $table = 'productos';
    protected $fillable = ['nombre', 'precio', 'estado'];

    public function productosClientes() { return $this->hasMany(ProductoCliente::class, 'producto_id'); }
}
