<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class moneda extends Model
{
    //
    public $timestamps = false;
    protected $table = 'moneda';
    protected $primaryKey = 'idmoneda';
    protected $fillable = [
        'nombre_moneda',	
        'fecha_modif',
        'idusuario',
        'estado_moneda'
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
        $select = \DB::table('moneda')
                ->select('moneda.*')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(moneda.nombre_moneda) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }

    public function updateModulo($data, $idmoneda) {
        \DB::table('cmoneda')->where('idcmoneda', $idmoneda)->update($data);
    }

    public function GrabarCargo($data) {
        if (isset($data['moneda'])) {
            \DB::table('moneda')->insert($data['moneda']);
        }
    }


    public function Cargo($param) {

        $data = \DB::table('moneda')
                ->select('moneda.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function get_monedas($param) {
        $data = \DB::table('moneda')
                ->select('moneda.*')
                ->where($param)
                ->get();

        return $data;
    }

}
