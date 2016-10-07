<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sede extends Model
{
    //
    public $timestamps = false;
    protected $table = 'sede';
    protected $primaryKey = 'idsede';
    protected $fillable = [
        'nombre_sede',
        'idubigeo',
        'direccion',
        'telefono',
        'celular',
        'telefono_adic',				
        'fecha_modif',
        'idusuario',
        'estado_sede'
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
        $select = \DB::table('sede')
                ->select('sede.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(sede.nombre_sede) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }


        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateSede($data, $idModulo) {
        \DB::table('sede')->where('idsede', $idsede)->update($data);
    }

    public function GrabarModulo($data) {
        if (isset($data['sede'])) {
            \DB::table('sede')->insert($data['sede']);
        }
    }


    public function Sede($param) {

        $data = \DB::table('sede')
                ->select('sede.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function get_sedes($param) {
        $data = \DB::table('sede')
                ->select('sede.*')
                ->where($param)
                ->get();

        return $data;
    }

}
