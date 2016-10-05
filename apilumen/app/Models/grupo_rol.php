<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class grupo_rol extends Model
{
    //
    public $timestamps = false;
    protected $table = 'grupo_rol';
    protected $primaryKey = 'idgruporol';
    protected $fillable = [
        'idgrupo',
        'idrol',					
        'estado_gruporol'
    ];

    public function update($data, $idgrupo_rol) {
        \DB::table('grupo_rol')->where('idgruporol', $idgrupo_rol)->update($data);
    }
}
