<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class grupo_rol extends Model
{
    //
    public $timestamps = false;
    public $incrementing = false;

    protected $table = 'grupo_rol';
    protected $primaryKey = 'idgruporol';
    protected $fillable = [
        'idgrupo',
        'idrol',					
        'estado_gruporol'
    ];

}
