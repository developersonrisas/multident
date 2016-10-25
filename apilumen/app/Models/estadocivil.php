<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class estadocivil extends Model
{
    //
    public $timestamps = false;
    protected $table = 'estado_civil';
    protected $primaryKey = 'idestadocivil';
    protected $fillable = [
        'nombre_estadocivil',	
        'idusuario',
        'fecha_modif',
        'estado_estadocivil'
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
        $select = \DB::table('estado_civil')
                ->select('estado_civil.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(estado_civil.nombre_estadocivil) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateEstadocivil($data, $idcago) {
        \DB::table('cargo')->where('idcargo', $idcago)->update($data);
    }

    public function GrabarEstadocivil($data) {
        if (isset($data['cargo'])) {
            \DB::table('cargo')->insert($data['cargo']);
        }
    }


    public function Estadocivil($param) {

        $data = \DB::table('cargo')
                ->select('cargo.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function get_Estadocivil($param) {
        $data = \DB::table('estado_civil')
                ->select('estado_civil.*')
                ->where($param)
                ->get();

        return $data;
    }

}
