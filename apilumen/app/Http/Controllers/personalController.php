<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\personal;
use App\Models\empresa;
use App\Models\sede;
use App\Models\cargo;
use App\Models\estadocivil;

class personalController extends Controller
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

        $personal = new personal();
        $param = array();

        $paramsTMP = $request->all();        

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $personal->grid($param, $pageSize);

        if ($data) {
            //return $this->crearRespuesta($data->items(), 200, $data->total(), $data->count() . '|' . $orderName . '|' . $orderSort, $paramsTMP);
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

    public function nrodocumento(Request $request) {

        $paramsTMP = $request->all();

        $row = array('existeEntidad' => false);

        $personal = personal::where('numero_documento', '=', $paramsTMP['numero_documento'])->first();

        if ($personal) {
            $row['existeEntidad'] = true;
            $row['nombreEntidad'] = $personal->nombres;
            $row['numeroDocEntidad'] = $personal->numero_documento;
            $row['idPersonal'] = $personal->idpersonal;
        }
        return $this->crearRespuesta($row, 201);
    }
    
    public function newpersonal(Request $request) {

        $empresa = new empresa();

        $paramsTMP = $request->all();

        $listcombox = array(
            'documentos' => $empresa->tipo_documento_identidad(),
            'departamentos' => $empresa->departamentos()
        );

        $listcombox['sedes'] = sede::select('idsede', 'nombre_sede', 'direccion')->where('estado_sede', '=', 1)->get();
        $listcombox['cargos'] = cargo::where('estado_cargo', '=', 1)->get();
        $listcombox['estado_civil'] = estadocivil::where('estado_estadocivil', '=', 1)->get();

        return $this->crearRespuesta([], 200, '', '', $listcombox);
    }


}







