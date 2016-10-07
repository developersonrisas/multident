<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sede extends Model
{
    protected $table = 'sede';
    protected $primaryKey = 'idsede';
    public $timestamps = false;
    protected $fillable = [
        'idsede',
        'nombre_sede',
        'idubigeo',
        'direccion',
        'telefono',
        'celular',
        'telefono_adic',
        'idusuario',
        'fecha_modif',
        'estado_sede'
    ];
    //protected $hidden = ['idempresa'];

    public function sede($id) {
        $data = \DB::table('sede')
                ->join('empresa', 'sede.idempresa', '=', 'empresa.idempresa')
                ->leftJoin('entidad', 'sede.identidad', '=', 'entidad.identidad')
                ->select('sede.idsede', 'sede.nombre', 'sede.direccion', 'sede.telefono', 'sede.celular', 'sede.principal', 'entidad.identidad', 'entidad.entidad')
                ->where('sede.idempresa', '=', $id)
                ->orderBy('sede.nombre', 'asc')
                ->get();

        return $data;
    }

    public function updateSede($data, $where) {
        \DB::table('sede')->where($where)->update($data);
    }
    
}
