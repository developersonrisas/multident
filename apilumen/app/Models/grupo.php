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

    public function roles_no_agregados($datos){
        $sql = 'SELECT rol.idrol, idparent, orden_rol, nombre_rol, url_rol, icono 
                FROM rol
                WHERE rol.idrol NOT IN( 
                    SELECT rol.idrol FROM grupo_rol 
                    LEFT JOIN rol ON rol.idrol = grupo_rol.idrol AND grupo_rol.estado_gruporol = 1 
                    LEFT JOIN grupo ON grupo_rol.idgrupo=grupo.idgrupo AND grupo.estado_grupo = '.$datos['idgrupo'].'
                    WHERE rol.estado_rol=1 AND grupo_rol.idgrupo = 1
                )
                AND estado_rol = 1 AND idmodulo='.$datos['idmodulo'].'';
        //$sql .= $datos['sortName'] ? ' ORDER BY' . $datos['sortName']. ' '. $datos['sort'] : ''; 

        $data = \DB::select($sql);

        return $data;
    }


    public function roles_agregados($datos){
        $sql = 'SELECT rol.idrol,rol.idparent, rol.orden_rol, rol.nombre_rol, rol.url_rol, rol.icono ,grupo_rol.idgruporol
            FROM grupo_rol 
            LEFT JOIN rol ON rol.idrol = grupo_rol.idrol AND grupo_rol.estado_gruporol = 1 
            LEFT JOIN grupo ON grupo_rol.idgrupo=grupo.idgrupo AND grupo.estado_grupo = 1 
            WHERE rol.estado_rol=1 AND grupo_rol.idgrupo = '.$datos['idgrupo'].'';
        if($datos['idmodulo'] >0 ){
            $sql .= ' AND idmodulo='.$datos['idmodulo'];
        }
        //$sql .= $datos['sortName'] ? ' ORDER BY' . $datos['sortName']. ' '. $datos['sort'] : ''; 

        $data = \DB::select($sql); 

        return $data;
    }

    public function agregar_rol_grupo($datos)
    {
        $data = array(
            'idgroup' => $datos['groupId'],
            'idrol' => $datos['id']
        );
        return $this->db->insert('groups_roles', $data);
    }

}
