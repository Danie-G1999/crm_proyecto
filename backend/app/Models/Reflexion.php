<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reflexion extends Model {
    use HasFactory;

    protected $table = 'reflexion';
    protected $fillable = ['asesor_id', 'reflexion'];

    public function asesor() { return $this->belongsTo(Asesor::class, 'asesor_id'); }
}
