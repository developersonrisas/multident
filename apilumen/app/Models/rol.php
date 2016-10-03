<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class rol extends Model
{
    //
    public $timestamps = false;
    protected $table = 'rol';
    protected $primaryKey = 'idrol';
    protected $fillable = [
        'idrol',
        'nombre_rol',
        'url_rol',
        'icono',
        'idusuario',					
        'fecha_modif',
        'idparent',
        'order_rol',
        'idmodulo',
        'estado_rol'
    ];
    //protected $hidden = ['password', 'idempresa','created_at','updated_at'];

    private function formatFecha($fecha, $format = 'dd/mm/yyyy') {
        $newFecha = NULL;
        if (!empty($fecha) && strlen($fecha) == 10) {
            if ($format === 'dd/mm/yyyy') {
                //de: yyyy-mm-dd a: dd/mm/yyyy 
                $fecha = explode('-', $fecha);
                $newFecha = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
            }
            if ($format === 'yyyy-mm-dd') {
                //de: dd/mm/yyyy a: yyyy-mm-dd 
                $fecha = explode('/', $fecha);
                $newFecha = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
            }
        }
        
        return $newFecha;
    }

    public function grid($param, $likename, $items = 25, $orderName, $orderSort) {
        $select = \DB::table('rol')
                ->leftJoin('modulo', 'rol.idmodulo', '=', 'modulo.idmodulo')
                ->select('rol.*','modulo.nombre_modulo as modulo')
                ->where($param);
                

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }


    public function updateRol($data, $idrol) {
        \DB::table('rol')->where('idrol', $idrol)->update($data);
    }

    public function GrabarRol($data) {
        if (isset($data['rol'])) {
            \DB::table('rol')->insert($data['rol']);
        }
    }


    public function rol($param) {

        $data = \DB::table('rol')
                ->select('rol.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function roles($param) {
        $data = \DB::table('rol')
                ->select('rol.idrol', 'rol.rol')
                ->where($param)
                ->get();

        return $data;
    }

}
