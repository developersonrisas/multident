<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class usuario extends Model
{
    //
    protected $table = 'usuario';
    protected $primaryKey = 'idusuario';
    protected $fillable = [
        'nombre_usuario',
        'usuario_login',
        'usuario_clave',
        'nivel',
        'fecha_registro',					
        'estado_usuario'
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
        $select = \DB::table('usuario')
                ->select('usuario.*');
                

        $data = $select
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_modif = $this->formatFecha($row->fecha_modif);
        }

        return $data;
    }


    public function updateUsuario($data, $idusuario) {
        \DB::table('usuario')->where('idusuario', $idusuario)->update($data);
    }

    public function GrabarUsuario($data) {
        if (isset($data['usuario'])) {
            \DB::table('usuario')->insert($data['usuario']);
        }
    }


    public function usuario($param) {

        $data = \DB::table('usuario')
                ->select('usuario.*')
                ->where($param)
                ->first();

        return $data;
    }


    public function usuarios($param) {
        $data = \DB::table('usuarios')
                ->select('usuarios.idrol', 'usuarios.usuarios')
                ->where($param)
                ->get();

        return $data;
    }

}
