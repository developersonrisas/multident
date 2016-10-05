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
        $idGrupo = $request['grupo_rol']['idgrupo'];
        $idRol = $request['grupo_rol']['idrol'];

        $tmp = grupo_rol::where('idgrupo', '=', $idGrupo)->where('idrol', '=', $idrol)->first();
        if ($tmp) {
            $datos = [
                'estado_gruporol' => '1'
            ];
            \DB::beginTransaction();
            try {
                $grupo_rol->update($datos,$tmp->idgruporol);

            } catch (QueryException $e) {
                \DB::rollback();
            }
            \DB::commit();
        }

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

        return $this->crearRespuesta('"' . $grupo->nombre_grupo . '" ha sido creado.', 201);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
