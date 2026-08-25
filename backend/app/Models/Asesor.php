<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asesor extends Model {
    use HasFactory;

    protected $table = 'asesores';
    protected $fillable = ['nombre', 'correo', 'rol', 'estado'];

    public function clientes() { return $this->hasMany(Cliente::class, 'asesor_id'); }
    public function bitacoras() { return $this->hasMany(Bitacora::class, 'asesor_id'); }
    public function reflexiones() { return $this->hasMany(Reflexion::class, 'asesor_id'); }
}
