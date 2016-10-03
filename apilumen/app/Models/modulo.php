<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class modulo extends Model
{
    //
    public $timestamps = false;
    protected $table = 'modulo';
    protected $primaryKey = 'idmodulo';
    protected $fillable = [
        'nombre_modulo',		// tipodocumento
        'descripcion',					
        'fecha_modif',					// empresa_admin_sede
        'idusuario',
        'estado_modulo'
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
        $select = \DB::table('modulo')
                ->select('modulo.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(modulo.nombre_modulo) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }


        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateModulo($data, $idModulo) {
        \DB::table('Modulo')->where('idModulo', $idModulo)->update($data);
    }

    public function GrabarModulo($data) {
        if (isset($data['Modulo'])) {
            \DB::table('Modulo')->insert($data['Modulo']);
        }
    }


    public function Modulo($param) {

        $data = \DB::table('Modulo')
                ->select('Modulo.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function get_modulos($param) {
        $data = \DB::table('modulo')
                ->select('modulo.*')
                ->where($param)
                ->get();

        return $data;
    }

}
