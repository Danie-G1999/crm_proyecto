<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guion extends Model {
    use HasFactory;

    protected $table = 'guiones';
    protected $fillable = ['titulo', 'canal', 'saludo', 'identificacion', 'proposito', 'sondeo', 'gestion', 'cierre'];
}
