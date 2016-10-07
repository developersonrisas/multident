<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class empresa_admin extends Model
{
    //
    public $timestamps = false;
    protected $table = 'empresa_admin';
    protected $primaryKey = 'idempresa_admin';
    protected $fillable = [
        'ruc',
        'nombre_empresa',					
        'telefono',
        'email',
        'celular',
        'telefono_adicional',
        'direccion',
        'idubigeo',
        'representante legal',
        'logo',
        'fecha_modif',
        'idusuario',
        'estado_empresa'
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
        $select = \DB::table('empresa_admin')
                ->select('empresa_admin.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(empresa_admin.nombre_empresa) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }


        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

}
