<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cargo extends Model
{
    //
    public $timestamps = false;
    protected $table = 'cargo';
    protected $primaryKey = 'idcargo';
    protected $fillable = [
        'nombre_cargo',	
        'fecha_modif',
        'idusuario',
        'estado_cargo'
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
        $select = \DB::table('cargo')
                ->select('cargo.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(cargo.nombre_cargo) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateModulo($data, $idcago) {
        \DB::table('cargo')->where('idcargo', $idcago)->update($data);
    }

    public function GrabarModulo($data) {
        if (isset($data['cargo'])) {
            \DB::table('cargo')->insert($data['cargo']);
        }
    }


    public function Modulo($param) {

        $data = \DB::table('cargo')
                ->select('cargo.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function get_cargos($param) {
        $data = \DB::table('cargo')
                ->select('cargo.*')
                ->where($param)
                ->get();

        return $data;
    }

}
