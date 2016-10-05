<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\tipocambio;
use \Firebase\JWT\JWT;

class tipoCambioController extends Controller
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

        $tipocambio = new tipocambio();
        $param = [
            'estado_tipocambio' => '1'
        ];

        $paramsTMP = $request->all();        

        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'tipo_cambio.fecha';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['liketipomoneda']) ? trim($paramsTMP['like']) : '';

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;

        $data = $tipocambio->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Moneda no encontrada', 404);
    }

    public function show($id) {

        $moneda = moneda::find($id);

        if ($moneda) {            
            return $this->crearRespuesta($moneda, 200);
        }

        return $this->crearRespuestaError('Moneda no encotrado', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD
        if (!empty($request['moneda']['nombre_moneda'])) {
            $nombreMoneda = $request['moneda']['nombre_moneda'];
            $tmp = moneda::where('nombre_moneda', '=', $nombreMoneda)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreMoneda . '" ya existe. Pertenece a ' . $tmp->nombre_moneda, [200, 'info']);
            }
        }

        $datos = [
            'nombre_moneda' => $request['moneda']['nombre_moneda'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_moneda' => '1'
        ];

        \DB::beginTransaction();
        try {
            $moneda = moneda::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $moneda->nombre_moneda . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $moneda = moneda::find($id);

        if ($moneda) {
            $request = $request->all();

            //VALIDACIONES 
            $nombreMoneda = $request['moneda']['nombre_moneda'];
            $consultado = false;
            if ($nombreMoneda !== $moneda->nombre_moneda) {
                $consultado = true;
                $row = moneda::where('nombre_moneda', '=', $nombreMoneda)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreMoneda . '" ya existe. Pertenece a ' . $row->nombre_moneda, [200, 'info']);
                }
            }

            $moneda->fill($request['moneda']);

            \DB::beginTransaction();
            try {
                                              
                $moneda->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('La moneda "' . $moneda->nombre_moneda . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a una moneda', 404);
    }

    public function destroy($id) {

        $moneda = moneda::find($id);

        if ($moneda) {

            $datos = [
                'idmoneda' => $moneda->idmoneda,
                'estado_moneda' => '0'
            ];

            $moneda->fill($datos);

            \DB::beginTransaction();
            try {
                // eliminacion logica        
                $moneda->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('La moneda "' . $moneda->nombre_moneda . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('Moneda no encotrado', 404);
    }



}







