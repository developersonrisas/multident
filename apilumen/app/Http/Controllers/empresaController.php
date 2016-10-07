<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\empresa;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class empresaController extends Controller
{

    public function show($enterprise) {
 
        $tema = new tema();
        $sede = new sede();
        
        $empresa = empresa::where('url', '=', $enterprise)->first(); 
        if ($empresa) {
            $idempresa = $empresa->idempresa;
            $listcombox = array(
                'sedes' => $sede->sedes($idempresa),
                'temas' => $tema->temas(),
                'personal' => entidad::select('identidad', 'entidad','created_at','updated_at')->where('tipopersonal', '=', '1')->get()
            ); 
            
            $ubigeo = $empresa->idubigeo;
            if (!empty($ubigeo)) {
                $pais = substr($ubigeo, 0, 2);
                $dpto = substr($ubigeo, 2, 3);
                $prov = substr($ubigeo, 5, 2);
                $dist = substr($ubigeo, 7, 2);
                $listcombox['paises'] = $empresa->paises();
                $listcombox['departamentos'] = $empresa->departamentos($pais);
                $listcombox['provincias'] = $empresa->provincias($pais, $dpto);
                $listcombox['distritos'] = $empresa->distritos($pais, $dpto, $prov);
                $empresa->pais = $pais;
                $empresa->dpto = $dpto;
                $empresa->prov = $prov;
                $empresa->dist = $dist;
            } else {
                $listcombox['paises'] = $empresa->paises();
            }
            //dd($listcombox);
            return $this->crearRespuesta($empresa, 200, '', '', $listcombox);
        }
        return $this->crearRespuestaError('Producto no encotrado', 404);
    }

    public function update(Request $request, $enterprise) {

        $empresa = empresa::where('url', '=', $enterprise)->first();

        if ($empresa) {
            $request['idubigeo'] = NULL;
            if (!empty($request['pais'])) {
                $dpto = empty($request['dpto']) ? '00' : $request['dpto'];
                $prov = empty($request['prov']) ? '00' : $request['prov'];
                $dist = empty($request['dist']) ? '00' : $request['dist'];
                $request['idubigeo'] = $request['pais'] . $dpto . $prov . $dist;
            }

            $empresa->fill($request->all());
            $empresa->save();
            return $this->crearRespuesta('"' . $empresa->razonsocial . '" ha sido editado.', 200);
        }

        return $this->crearRespuestaError('El id especificado no corresponde a una empresa.', 404);
    }
    
}
