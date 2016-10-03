<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class paciente extends Model
{
    //
    protected $table = 'paciente';
    protected $primaryKey = 'idpaciente';
    protected $fillable = [
        'idtipodocumento_idenditad',
        'numero_documento',
        'idempadmin_sede',
        'idhistoria_clinica',
        'nombres',
        'ape_paterno',
        'ape_materno',
        'fecha_nacimiento',					
        'sexo',
        'idubigeo',
        'direccion',
        'telefono',
        'celular',
        'telefono_adic',
        'email',
        'idestado_civil',
        'idmotivo_captacion',
        'fecha_ingreso',
        'telefono_mensajeria',
        'fecha_modif',
        'idusuario',
        'key_grupo'
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

    public function grid($param, $items = 25) {
        $select = \DB::table('paciente')
                ->select('paciente.*');

        $data = $select
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
