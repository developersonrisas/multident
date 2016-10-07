<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\rol;
use App\Models\modulo;

class rolController extends Controller
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

        $rol = new rol();
        $param = [
            'estado_rol' => '1'
        ];

        $paramsTMP = $request->all();        


        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'rol.idparent';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';

        $order = [
            'rol.idparent' => 'ASC',
            'rol.idrol' => 'ASC'
        ];

        $like = !empty($paramsTMP['likerol']) ? trim($paramsTMP['likerol']) : '';
        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $rol->grid($param, $like, $pageSize, $order);

        if ($data) {
            //return $this->crearRespuesta($data->items(), 200, $data->total(), $data->count() . '|' . $orderName . '|' . $orderSort, $paramsTMP);
            $arrListado = array();
            foreach ($data as $items) {
                $rol = NULL;
                $icono = NULL;
                if($items->idparent == $items->idrol){
                    $rol = $items->nombre_rol;
                    $icono = $items->icono;
                }
                array_push($arrListado, 
                    array(
                        'idrol' => $items->idrol,
                        'nombre_rol' => $rol,
                        'subrol' => $items->nombre_rol,
                        'url_rol' => $items->url_rol,
                        'modulo' => $items->modulo,
                        'icono' => $icono
                    )
                );
            }

            return $this->crearRespuesta($arrListado, 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD

        if (!empty($request['rol']['nombre_rol'])) {
            $nombreRol = $request['rol']['nombre_rol'];
            $tmp = rol::where('nombre_rol', '=', $nombreRol)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreRol . '" ya existe. Pertenece a ' . $tmp->nombre_rol, [200, 'info']);
            }
        }


        $datos = [
            'nombre_rol' => $request['rol']['nombre_rol'],
            'url_rol' => $request['rol']['url_rol'],
            'icono' => $request['rol']['icono'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idmodulo' => $request['rol']['idmodulo'],
            'idusuario' => '1',
            'estado_rol' => '1'
        ];

        \DB::beginTransaction();
        try {
            $rol = rol::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $rol->nombre_rol . '" ha sido creado.', 201);
    }

    public function storeSub(Request $request) {

        $request = $request->all();
        $datos = [];

       // $parent = rol::find($request['sub']['idparent']);
        $idparent = $request['sub']['idparent'];
        $parent = rol::where('idrol', '=', $idparent)->first();

        //VALIDACIONES EN LA BD

        if (!empty($request['sub']['nombre_rol'])) {
            $nombreRol = $request['sub']['nombre_rol'];
            $tmp = rol::where('nombre_rol', '=', $nombreRol)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreRol . '" ya existe. Pertenece a ' . $tmp->nombre_rol, [200, 'info']);
            }
        }

        $datos = [
            'nombre_rol' => $request['sub']['nombre_rol'],
            'url_rol' => $request['sub']['url_rol'],
            'icono' => $request['sub']['icono'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idparent' => $request['sub']['idparent'],
            'idmodulo' => $parent->idmodulo,
            'idusuario' => '1',
            'estado_rol' => '1'
        ];

        \DB::beginTransaction();
        try {
            $rol = rol::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $rol->nombre_rol . '" ha sido creado.', 201);
    }

    public function show($id) {

        $modulo = new modulo();
        $rol = rol::find($id);

        if ($rol) {        
            $param = [
                'estado_modulo' => '1'
            ];

            $listcombox = array(
                'modulos' => $modulo->get_modulos($param)
            );

            return $this->crearRespuesta($rol, 200, '', '', $listcombox);
        }

        return $this->crearRespuestaError('Modulo no encotrado', 404);
    }

    public function newrol() {

        $modulo = new modulo();

        $param = [
            'estado_modulo' => '1'
        ];

        $listcombox = array(
            'modulos' => $modulo->get_modulos($param)
        );

        return $this->crearRespuesta([], 200, '', '', $listcombox);
    }

    public function update(Request $request, $id) {

        $rol = rol::find($id);

        if ($rol) {
            $request = $request->all();

            //VALIDACIONES 
            $nombreRol = $request['rol']['nombre_rol'];
            $consultado = false;
            if ($nombreRol !== $rol->nombre_rol) {
                $consultado = true;
                $row = rol::where('nombre_rol', '=', $nombreRol)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreRol . '" ya existe. Pertenece a ' . $row->nombre_rol, [200, 'info']);
                }
            }

            $rol->fill($request['rol']);

            \DB::beginTransaction();
            try {
                                              
                $rol->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL rol "' . $rol->nombre_rol . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un rol', 404);
    }

}







