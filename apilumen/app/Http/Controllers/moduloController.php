<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\modulo;
use \Firebase\JWT\JWT;

class moduloController extends Controller
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

        $modulo = new modulo();
        $param = [
            'estado_modulo' => '1'
        ];

        $paramsTMP = $request->all();        

        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'modulo.nombre_modulo';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['likemodulo']) ? trim($paramsTMP['likemodulo']) : '';

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $modulo->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function show($id) {

        $modulo = modulo::find($id);

        if ($modulo) {            
            return $this->crearRespuesta($modulo, 200);
        }

        return $this->crearRespuestaError('Modulo no encotrado', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD

        if (!empty($request['modulo']['nombre_modulo'])) {
            $nombreModulo = $request['modulo']['nombre_modulo'];
            $tmp = modulo::where('nombre_modulo', '=', $nombreModulo)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreModulo . '" ya existe. Pertenece a ' . $tmp->nombre_modulo, [200, 'info']);
            }
        }

        $datos = [
            'nombre_modulo' => $request['modulo']['nombre_modulo'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_modulo' => '1'
        ];

        \DB::beginTransaction();
        try {
            $modulo = modulo::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $modulo->nombre_modulo . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $modulo = modulo::find($id);

        if ($modulo) {
            $request = $request->all();

            //VALIDACIONES 
            $nombreModulo = $request['modulo']['nombre_modulo'];
            $consultado = false;
            if ($nombreModulo !== $modulo->nombre_modulo) {
                $consultado = true;
                $row = modulo::where('nombre_modulo', '=', $nombreModulo)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreModulo . '" ya existe. Pertenece a ' . $row->nombre_modulo, [200, 'info']);
                }
            }

            $modulo->fill($request['modulo']);

            \DB::beginTransaction();
            try {
                                              
                $modulo->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL modulo "' . $modulo->nombre_modulo . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un modulo', 404);
    }

    public function destroy($id) {

        $modulo = modulo::find($id);

        if ($modulo) {

            $datos = [
                'idmodulo' => $modulo->idmodulo,
                'estado_modulo' => '0'
            ];

            $modulo->fill($datos);

            \DB::beginTransaction();
            try {
                //Elimina en 1 tablas(producto, productoservicio)        
                $modulo->save();
            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL Modulo "' . $modulo->nombre . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('Modulo no encotrado', 404);
    }



}







