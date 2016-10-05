<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class tipocambio extends Model
{
    //
    public $timestamps = false;
    protected $table = 'tipo_cambio';
    protected $primaryKey = 'idtipocambio';
    protected $fillable = [
        'fecha',	
        'valor_compra',
        'valor_venta',
        'idusuario',
        'fecha_modif',
        'estado_tipocambio',
        'idmonedainicial',
        'idmonedafinal'
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
        $select = \DB::table('tipo_cambio')
                ->leftJoin('moneda as mi', 'mi.idmoneda', '=', 'tipo_cambio.idmonedainicial')
                ->leftJoin('moneda as mf', 'mf.idmoneda', '=', 'tipo_cambio.idmonedafinal')
                ->select('tipo_cambio.*','mi.nombre_moneda as moneda_inicial','mf.nombre_moneda as moneda_final')
                ->where($param);

        if (!empty($likename)) {
            $select->whereRaw('sp_ascii(tipo_cambio.fecha) ilike sp_ascii(?) ', ['%' . $likename . '%']);
        }

        $data = $select
                ->orderBy($orderName, $orderSort)
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha =date("d-m-Y", strtotime($row->fecha));
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
