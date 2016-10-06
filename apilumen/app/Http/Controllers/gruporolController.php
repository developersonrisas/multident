<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\grupo_rol;


class gruporolController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $grupo_rol = new grupo_rol();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }


    public function store(Request $request){
        $request = $request->all();
        $datos = [];

        //VALIDACIONES EN LA BD
        $idGrupo = $request['idgrupo'];
        $idRol = $request['idrol'];

        $gruporol = grupo_rol::where('idgrupo', '=', $idGrupo)->where('idrol', '=', $idRol)->first();
        if ($gruporol) {
            $datos = [
                'estado_gruporol' => '1'
            ];
            \DB::beginTransaction();
            try {
                $gruporol->update($datos,$gruporol->idgruporol);

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();
            
        }else{

            $datos = [
                'idgrupo' => $idGrupo,
                'idrol' => $idRol,
                'estado_gruporol' => '1'
            ];

            \DB::beginTransaction();
            try {
                $grupo_rol = grupo_rol::create($datos);

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();
        }

        return $this->crearRespuesta(' ha sido creado.', 201);
        
    }


    public function destroy($id) {

        $gruporol = grupo_rol::find($id);

        if ($gruporol) {

            $datos = [
                'idgruporol' => $gruporol->idgruporol,
                'estado_gruporol' => '0'
            ];

            $gruporol->fill($datos);

            \DB::beginTransaction();
            try {       
                $gruporol->save();
            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();

            return $this->crearRespuesta(' a sido eliminado.', 200);
        }
        return $this->crearRespuestaError('Grupo no encotrado', 404);
    }
}
