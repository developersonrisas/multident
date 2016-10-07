<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\empresa_admin;
use \Firebase\JWT\JWT;

class empresaadminController extends Controller
{

    public function index(Request $request) {

        $empresa_admin = new empresa_admin();
        $param = [
            'estado_empresa' => '1'
        ];

        $paramsTMP = $request->all();        

        $orderName = !empty($paramsTMP['orderName']) ? $paramsTMP['orderName'] : 'empresa_admin.nombre_empresa';
        $orderSort = !empty($paramsTMP['orderSort']) ? $paramsTMP['orderSort'] : 'ASC';
        $like = !empty($paramsTMP['likeempresa']) ? trim($paramsTMP['likeempresa']) : '';

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $empresa_admin->grid($param, $like, $pageSize, $orderName, $orderSort);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Empresas Administradoras no encontrada', 404);
    }

    public function show($id) {

        $empresa_admin = empresa_admin::find($id);

        if ($empresa_admin) {            
            return $this->crearRespuesta($empresa_admin, 200);
        }

        return $this->crearRespuestaError('empresa_admin no encotrado', 404);
    }

    public function store(Request $request) {

        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD

        if (!empty($request['empresa_admin']['nombre_empresa'])) {
            $nombreempresa_admin = $request['empresa_admin']['nombre_empresa'];
            $tmp = empresa_admin::where('nombre_empresa', '=', $nombreempresa_admin)->first();
            if ($tmp) {
                return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreempresa_admin . '" ya existe. Pertenece a ' . $tmp->nombre_empresa, [200, 'info']);
            }
        }

        $datos = [
            'nombre_empresa' => $request['empresa_admin']['nombre_empresa'],
            'fecha_modif' => date("Y-m-d H:i:s"),
            'idusuario' => '1',
            'estado_empresa' => '1'
        ];

        \DB::beginTransaction();
        try {
            $empresa_admin = empresa_admin::create($datos);

        } catch (QueryException $e) {
            \DB::rollback();
        }
        \DB::commit();

        return $this->crearRespuesta('"' . $empresa_admin->nombre_empresa . '" ha sido creado.', 201);
    }

    public function update(Request $request, $id) {

        $empresa_admin = empresa_admin::find($id);

        if ($empresa_admin) {
            $request = $request->all();

            //VALIDACIONES 
            $nombreempresa_admin = $request['empresa_admin']['nombre_empresa'];
            $consultado = false;
            if ($nombreempresa_admin !== $empresa_admin->nombre_empresa) {
                $consultado = true;
                $row = empresa_admin::where('nombre_empresa', '=', $nombreempresa_admin)->first();
                if ($row) {
                    return $this->crearRespuesta('No puede registrarse, el nombre del "' . $nombreempresa_admin . '" ya existe. Pertenece a ' . $row->nombre_empresa, [200, 'info']);
                }
            }

            $empresa_admin->fill($request['empresa_admin']);

            \DB::beginTransaction();
            try {
                                              
                $empresa_admin->save();

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL empresa_admin "' . $empresa_admin->nombre_empresa . '" ha sido editado. ', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a un empresa_admin', 404);
    }

    public function destroy($id) {

        $empresa_admin = empresa_admin::find($id);

        if ($empresa_admin) {

            $datos = [
                'idempresa_admin' => $empresa_admin->idempresa_admin,
                'estado_empresa' => '0'
            ];

            $empresa_admin->fill($datos);

            \DB::beginTransaction();
            try {
                //Elimina en 1 tablas(producto, productoservicio)        
                $empresa_admin->save();
            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta('EL empresa_admin "' . $empresa_admin->nombre . '" a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('empresa_admin no encotrado', 404);
    }



}







