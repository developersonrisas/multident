<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class grupo extends Model
{
    //
    public $timestamps = false;
    protected $table = 'grupo';
    protected $primaryKey = 'idgrupo';
    protected $fillable = [
        'idgrupo',
        'nombre_grupo',
        'descripcion',					
        'fecha_modif',
        'idusuario',
        'key_grupo',
        'estado_grupo'
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
        $select = \DB::table('grupo')
                ->select('grupo.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(grupo.nombre_rol) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateGrupo($data, $idgrupo) {
        \DB::table('grupo')->where('idgrupo', $idgrupo)->update($data);
    }

    public function GrabarGrupo($data) {
        if (isset($data['grupo'])) {
            \DB::table('grupo')->insert($data['grupo']);
        }
    }


    public function grupo($param) {

        $data = \DB::table('grupo')
                ->select('grupo.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function grupos($param) {
        $data = \DB::table('grupo')
                ->select('grupo.idgrupo', 'grupo.grupo')
                ->where($param)
                ->get();

        return $data;
    }

}
