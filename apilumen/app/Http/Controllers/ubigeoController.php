<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Models\empresa;
use App\Http\Controllers\Controller;

class ubigeoController extends Controller
{
    public function index(Request $request) {

        $paramsTMP = $request->all();
        $empresa = new empresa();
        

        $data = [];
        switch (count($paramsTMP)) {
            case 0://Departamentos
                $data = $empresa->departamentos();
                break;
            case 1://Provincias
                if (isset($paramsTMP['iddepartamento'])) {
                    $data = $empresa->provincias($paramsTMP['iddepartamento']);
                }
                break;
            case 2://Distritos          
                if (isset($paramsTMP['iddepartamento']) && isset($paramsTMP['idprovincia'])) {
                    $data = $empresa->distritos($paramsTMP['iddepartamento'], $paramsTMP['idprovincia']);
                }
                break;
            default:
                break;
        }

        if ($data) {
            return $this->crearRespuesta($data, 200, '', '', $paramsTMP);
        }

        return $this->crearRespuestaError('Ubigeo no encontrado', 404);
    }
}
