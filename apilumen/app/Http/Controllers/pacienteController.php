<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\paciente;

class pacienteController extends Controller
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

        $paciente = new paciente();
        $param = array();

        $paramsTMP = $request->all();        

        $pageSize = !empty($paramsTMP['pageSize']) ? $paramsTMP['pageSize'] : 25;


        $data = $paciente->grid($param, $pageSize);

        if ($data) {
            return $this->crearRespuesta($data->items(), 200, $data->total());
        }

        return $this->crearRespuestaError('Entidad no encontrada', 404);
    }

}







