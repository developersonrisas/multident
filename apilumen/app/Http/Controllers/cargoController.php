<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\cargo;
use \Firebase\JWT\JWT;

class cargoController extends Controller
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

        $cargo = new cargo();
        $param = [
            'estado_cargo' => '1'
        ];

        $paramsTMP = $request->all();        

        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'cargo.nombre_cargo';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['likecargo']) ? trim($paramsTMP['like']) : '';

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;

        $data = $cargo->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function show($id) {

        $cargo = cargo::find($id);

        if ($cargo) {            
            return $this->crearRespuesta($cargo, 200);
        }

        return $this->crearRespuestaError('Cargo no encotrado', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD
        if (!empty($request['cargo']['nombre_cargo'])) {
            $nombreCargo = $request['cargo']['nombre_cargo'];
            $tmp = cargo::where('nombre_cargo', '=', $nombreCargo)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreCargo . '" ya existe. Pertenece a ' . $tmp->nombre_cargo, [200, 'info']);
            }
        }

        $datos = [
            'nombre_cargo' => $request['cargo']['nombre_cargo'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_cargo' => '1'
        ];

        \DB::beginTransaction();
        try {
            $cargo = cargo::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $cargo->nombre_cargo . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $cargo = cargo::find($id);

        if ($cargo) {
            $request = $request->all();

            //VALIDACIONES 
            $nombreCargo = $request['cargo']['nombre_cargo'];
            $consultado = false;
            if ($nombreCargo !== $cargo->nombre_cargo) {
                $consultado = true;
                $row = cargo::where('nombre_cargo', '=', $nombreCargo)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreCargo . '" ya existe. Pertenece a ' . $row->nombre_cargo, [200, 'info']);
                }
            }

            $cargo->fill($request['cargo']);

            \DB::beginTransaction();
            try {
                                              
                $cargo->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL cargo "' . $cargo->nombre_cargo . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un cargo', 404);
    }

    public function destroy($id) {

        $cargo = cargo::find($id);

        if ($cargo) {

            $datos = [
                'idcargo' => $cargo->idcargo,
                'estado_cargo' => '0'
            ];

            $cargo->fill($datos);

            \DB::beginTransaction();
            try {
                // eliminacion logica        
                $cargo->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL Cargo "' . $cargo->nombre_cargo . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('Cargo no encotrado', 404);
    }



}







