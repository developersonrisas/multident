<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\grupo;

class grupoController extends Controller
{
    //
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

    public function index(Request $request) {

        $grupo = new grupo();
        $param = [
            'estado_grupo' => '1'
        ];

        $paramsTMP = $request->all();


        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'grupo.nombre_grupo';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['likerol']) ? trim($paramsTMP['likerol']) : '';        
        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $grupo->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function show($id) {

        $grupo = grupo::find($id);

        if ($grupo) {            
            return $this->crearRespuesta($grupo, 200);
        }

        return $this->crearRespuestaError('Grupo no encotrado', 404);
    }


    public function store(Request $request) {
        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD
        if (!empty($request['grupo']['nombre_grupo'])) {
            $nombreGrupo = $request['grupo']['nombre_grupo'];
            $tmp = grupo::where('nombre_grupo', '=', $nombreGrupo)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreGrupo . '" ya existe. Pertenece a ' . $tmp->nombre_grupo, [200, 'info']);
            }
        }

        $datos = [
            'nombre_grupo' => $request['grupo']['nombre_grupo'],
            'descripcion' => $request['grupo']['descripcion'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_grupo' => '1'
        ];

        \DB::beginTransaction();
        try {
            $grupo = grupo::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $grupo->nombre_grupo . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $grupo = grupo::find($id);

        if ($grupo) {
            $request = $request->all();

            //VALIDACIONES EN LA BD
            $nombreGrupo = $request['grupo']['nombre_grupo'];
            $consultado = false;
            if ($nombreGrupo !== $grupo->nombre_grupo) {
                $consultado = true;
                $row = grupo::where('nombre_grupo', '=', $nombreGrupo)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreGrupo . '" ya existe. Pertenece a ' . $row->nombre_grupo, [200, 'info']);
                }
            }

            $grupo->fill($request['grupo']);

            \DB::beginTransaction();
            try {
                                              
                $grupo->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL grupo "' . $grupo->nombre_grupo . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un grupo', 404);
    }

    public function destroy($id) {

        $grupo = grupo::find($id);

        if ($grupo) {

            $datos = [
                'idgrupo' => $grupo->idgrupo,
                'estado_grupo' => '0'
            ];

            $grupo->fill($datos);

            \DB::beginTransaction();
            try {       
                $grupo->save();
            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL Grupo "' . $grupo->nombre_grupo . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('Grupo no encotrado', 404);
    }

}







