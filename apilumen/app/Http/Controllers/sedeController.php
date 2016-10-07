<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\sede;


class sedeController extends Controller
{

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

        $sede = new sede();
        $param = [
            'estado_sede' => '1'
        ];

        $paramsTMP = $request->all();        

        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'sede.nombre_sede';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['likesede']) ? trim($paramsTMP['likesede']) : '';

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $sede->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function show($id) {

        $sede = sede::find($id);

        if ($sede) {            
            return $this->crearRespuesta($sede, 200);
        }

        return $this->crearRespuestaError('sede no encotrado', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD

        if (!empty($request['sede']['nombre_sede'])) {
            $nombresede = $request['sede']['nombre_sede'];
            $tmp = sede::where('nombre_sede', '=', $nombresede)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombresede . '" ya existe. Pertenece a ' . $tmp->nombre_sede, [200, 'info']);
            }
        }

        $datos = [
            'nombre_sede' => $request['sede']['nombre_sede'],
            'direccion' => $request['sede']['direccion'],
            'telefono' => $request['sede']['telefono'],
            'celular' => $request['sede']['celular'],
            'telefono_adic' => $request['sede']['telefono_adic'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_sede' => '1'
        ];

        \DB::beginTransaction();
        try {
            $sede = sede::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $sede->nombre_sede . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $sede = sede::find($id);

        if ($sede) {
            $request = $request->all();

            //VALIDACIONES 
            $nombresede = $request['sede']['nombre_sede'];
            $consultado = false;
            if ($nombresede !== $sede->nombre_sede) {
                $consultado = true;
                $row = sede::where('nombre_sede', '=', $nombresede)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombresede . '" ya existe. Pertenece a ' . $row->nombre_sede, [200, 'info']);
                }
            }

            $sede->fill($request['sede']);

            \DB::beginTransaction();
            try {
                                              
                $sede->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL sede "' . $sede->nombre_sede . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un sede', 404);
    }

    public function destroy($id) {

        $sede = sede::find($id);

        if ($sede) {

            $datos = [
                'idsede' => $sede->idsede,
                'estado_sede' => '0'
            ];

            $sede->fill($datos);

            \DB::beginTransaction();
            try {
                //Elimina en 1 tablas(producto, productoservicio)        
                $sede->save();
            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL sede "' . $sede->nombre . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('sede no encotrado', 404);
    }



}


