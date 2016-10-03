<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class personal extends Model
{
    //
    protected $table = 'personal';
    protected $primaryKey = 'idpersonal';
    protected $fillable = [
        'idtipodocumento_identidad',		// tipodocumento
        'numero_documento',					
        'idempadmin_sede',					// empresa_admin_sede
        'nombres',
        'ape_paterno',
        'ape_materno',
        'fecha_nacimiento',
        'sexo',
        'idubigeo',							// ubigeo
        'direccion',
        'telefono',
        'celular',
        'telefono_adic',
        'email',
        'idusuario',						// usuario
        'idestado_civil',					// estado civil
        'foto',
        'fecha_ingreso',
        'estado_personal',
        'idcargo'
    ];
    //protected $hidden = ['password', 'idempresa','created_at','updated_at'];

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

    public function grid($param, $items = 25) {
        $select = \DB::table('personal')
                ->select('personal.*');
//                ->leftJoin('tipo_documento_identidad', 'personal.idtipodocumento_identidad', '=', 'personal.idtipodocumento_identidad')
//               ->leftJoin('empresaadmin_sede', 'personal.idempadmin_sede', '=', 'empresaadmin_sede.idempadmin_sede')
//                ->leftJoin('ubigeo', 'ubigeo.idubigeo', '=', 'personal.idubigeo')
//                ->leftJoin('usuario', 'usuario.idusuario', '=', 'personal.idusuario')
//               ->leftJoin('estado_civil', 'estado_civil.idestado_civil', '=', 'personal.idestado_civil')
//                ->select('personal.idpersonal', 'personal.idtipodocumento_identidad', 'tipo_documento_identidad.nombre_tipodocumento as nombredoc','personal.numero_documento', 'personal.idempadmin_sede', 'personal.nombres', 'personal.ape_paterno', 'personal.ape_materno', 'personal.fecha_nacimiento', 'personal.sexo', 'personal.idubigeo', 'personal.direccion', 'personal.telefono', 'personal.celular', 'personal.telefono_adic', 'personal.email', 'personal.idusuario','personal.idestado_civil', 'personal.foto','personal.fecha_ingreso','personal.estado_personal');

        $data = $select
                ->paginate($items);

        foreach ($data as $row) {
            $row->fecha_nacimiento = $this->formatFecha($row->fecha_nacimiento);
        }

        return $data;
    }

    public function password($param) {
        $data = DB::table('entidad')
                ->select('entidad.password')
                ->where($param)
                ->first();

        return $data;
    }

    public function clientes($param) {
        $data = \DB::table('cliente')
                ->select('cliente.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function medicos($param) {
        $data = \DB::table('medico')
                ->select('medico.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function conductores($param) {
        $data = \DB::table('conductor')
                ->select('conductor.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function proveedores($param) {
        $data = \DB::table('proveedor')
                ->select('proveedor.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function personales($param) {
        $data = \DB::table('personal')
                ->select('personal.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function vendedores($param) {
        $data = \DB::table('vendedor')
                ->select('vendedor.*')
                ->where($param)
                ->first();

        return $data;
    }

    public function updateEntidad($data, $identidad) {
        \DB::table('entidad')->where('identidad', $identidad)->update($data);
    }

    public function EliminarSubEntidades($identidad, $all = true, $tabla = '') {
        if ($all) {
            \DB::table('cliente')->where('identidad', $identidad)->delete();
            \DB::table('personal')->where('identidad', $identidad)->delete();
            \DB::table('medico')->where('identidad', $identidad)->delete();
            \DB::table('proveedor')->where('identidad', $identidad)->delete();
        } else {
            \DB::table($tabla)->where('identidad', $identidad)->delete();
        }
    }

    public function GrabarSubEntidades($data) {

        if (isset($data['cliente']['idcliente'])) {
            \DB::table('cliente')->where('idcliente', $data['cliente']['idcliente'])->update($data['cliente']);
        } else {
            if (isset($data['cliente'])) {
                \DB::table('cliente')->insert($data['cliente']);
            }
        }

        if (isset($data['personal']['idpersonal'])) {
            \DB::table('personal')->where('idpersonal', $data['personal']['idpersonal'])->update($data['personal']);
        } else {
            if (isset($data['personal'])) {
                \DB::table('personal')->insert($data['personal']);
            }
        }

        if (isset($data['medico']['idmedico'])) {
            \DB::table('medico')->where('idmedico', $data['medico']['idmedico'])->update($data['medico']);
        } else {
            if (isset($data['medico'])) {
                \DB::table('medico')->insert($data['medico']);
            }
        }

        if (isset($data['proveedor']['idproveedor'])) {
            \DB::table('proveedor')->where('idproveedor', $data['proveedor']['idproveedor'])->update($data['proveedor']);
        } else {
            if (isset($data['proveedor'])) {
                \DB::table('proveedor')->insert($data['proveedor']);
            }
        }
    }

    public function GrabarEntidadPerfil($data, $identidad) {
        \DB::table('entidadperfil')->where('identidad', $identidad)->delete();
        \DB::table('entidadperfil')->insert($data);
    }

    public function GrabarEntidadEspecialidad($data, $identidad) {
        \DB::table('entidadespecialidad')->where('identidad', $identidad)->delete();
        \DB::table('entidadespecialidad')->insert($data);
    }

    public function GrabarEntidadTurno($data, $identidad) {
        \DB::table('entidadturno')->where('identidad', $identidad)->delete();
        \DB::table('entidadturno')->insert($data);
    }

    public function GrabarEntidadSede($data, $identidad) {
        \DB::table('entidadsede')->where('identidad', $identidad)->delete();
        \DB::table('entidadsede')->insert($data);
    }

    public function entidad($param) {

        $data = \DB::table('entidad')
                ->leftJoin('entidadperfil', 'entidad.identidad', '=', 'entidadperfil.identidad')
                ->leftJoin('perfil', 'entidadperfil.idperfil', '=', 'perfil.idperfil')
                ->leftJoin('documento', 'entidad.iddocumento', '=', 'documento.iddocumento')
                ->leftJoin('cargoorg', 'entidad.idcargoorg', '=', 'cargoorg.idcargoorg')
                ->select('entidad.*', 'documento.nombre as documento', 'cargoorg.nombre as cargoorg ', 'perfil.nombre as perfil', 'entidadperfil.idperfil')
                ->where($param)
                ->first();

        return $data;
    }

    public function getCumpleanos($param) {
        $data = \DB::table('entidad')
                ->join('documento', 'entidad.iddocumento', '=', 'documento.iddocumento')
                ->leftJoin('cargoorg', 'entidad.idcargoorg', '=', 'cargoorg.idcargoorg')
                ->select('entidad.entidad', 'tipopersonal', 'tipovendedor', 'tipomedico', 'tipocliente', 'tipoproveedor', 'fechanacimiento', 'imgperfil', 'sexo'
                        //\DB::raw('TIMESTAMPDIFF(YEAR, fechanacimiento, CURDATE()) as edad')) //Mysql
                        , \DB::raw("date_part('year', age( fechanacimiento )) as edad")) //Postgresql
                ->where($param)
                //->whereRaw("day(fechanacimiento)=day(NOW()) and month(fechanacimiento)=month(NOW())")
                ->whereRaw("extract(day from fechanacimiento) = extract(day from NOW()) and extract(month from fechanacimiento) = extract(month from NOW())")
                ->get();

        foreach ($data as $row) {
            if ($row->tipopersonal === '1') {
                $row->tipoentidaddesc = 'personal';
            }
            if ($row->tipocliente === '1') {
                $row->tipoentidaddesc = 'cliente';
            }
            if ($row->tipoproveedor === '1') {
                $row->tipoentidaddesc = 'proveedor';
            }
            if ($row->tipomedico === '1') {
                $row->tipoentidaddesc = 'médico';
            }
            $row->fechanacimiento = $this->formatFecha($row->fechanacimiento);
        }

        return $data;
    }

    public function entidades($param) {
        $data = \DB::table('entidad')
                ->select('entidad.identidad', 'entidad.entidad')
                ->where($param)
                ->get();

        return $data;
    }

    public function ListaEmpresas($param) {
        $data = \DB::table('empresa')
                ->join('entidad', 'empresa.idempresa', '=', 'entidad.idempresa')
                ->select('empresa.ruc', 'empresa.razonsocial', 'empresa.url')
                ->where($param)
                ->get();

        return $data;
    }

    public function listaEntidadModulo($param) {
        $data = \DB::table('entidadmodulo')
                ->join('modulo', 'entidadmodulo.idmodulo', '=', 'modulo.idmodulo')
                ->select('entidadmodulo.idmodulo', 'modulo.nombre')
                ->where($param)
                ->get();

        return $data;
    }

    public function listaEntidadEspecialidad($param) {
        $data = \DB::table('entidadespecialidad')
                ->join('especialidad', 'entidadespecialidad.idespecialidad', '=', 'especialidad.idespecialidad')
                ->leftJoin('tipoespecialidad', 'especialidad.idtipoespecialidad', '=', 'tipoespecialidad.idtipoespecialidad')
                ->select('especialidad.idespecialidad', 'especialidad.nombre', 'tipoespecialidad.nombre as tipoespecialidad')
                ->where($param)
                ->get();

        return $data;
    }

    public function listaEntidadTurno($param) {
        $data = \DB::table('entidadturno')
                ->join('dia', 'entidadturno.iddia', '=', 'dia.iddia')
                ->join('hora as horaini1', 'entidadturno.idhoraini1', '=', 'horaini1.idhora')
                ->join('hora as horafin1', 'entidadturno.idhorafin1', '=', 'horafin1.idhora')
                ->join('hora as horaini2', 'entidadturno.idhoraini2', '=', 'horaini2.idhora')
                ->join('hora as horafin2', 'entidadturno.idhorafin2', '=', 'horafin2.idhora')
                ->select('entidadturno.idturno','entidadturno.iddia','dia.nombre_dia', 'entidadturno.idhoraini1','horaini1.nombre_hora as nombre_horaini1','entidadturno.idhorafin1','horafin1.nombre_hora as nombre_horafin1','entidadturno.idhoraini2','horaini2.nombre_hora as nombre_horaini2','entidadturno.idhorafin2','horafin2.nombre_hora as nombre_horafin2' , 'entidadturno.activo')
                ->where($param)
                ->orderBy('entidadturno.iddia', 'ASC')
                ->get();

        return $data;
    }

    public function listaTurno($param) {
        $data = \DB::table('hora')
                ->select('idhora','nombre_hora')
                ->whereRaw('idhora between '.$param['idhoraini1'].' and '. $param['idhorafin1'].' or idhora between '.$param['idhoraini2'].' and '.$param['idhorafin2'])
                ->orderBy('idhora','ASC')
                ->get();

        return $data;                
    }

    public function listaEntidadSede($param) {
        $data = \DB::table('entidadsede')
                ->join('sede', 'entidadsede.idsede', '=', 'sede.idsede')
                ->select('sede.idsede', 'sede.nombre', 'sede.direccion')
                ->where($param)
                ->get();

        return $data;
    }

    public function ListaModules($param, $leftJoin = false) {
        /** Martes 12 Ene 2016
         * Se retira JOIN entidadmodulo, 
         * Se coloca JOIN entidadperfil, perfil, perfilmodulo
         * El cliente necesita manejar autentificacion de opciones basado en perfiles. 
         * No desea opciones basado en opcion por opcion para entidad.
         */
        $select = \DB::table('empresa')
                //->join('person', 'users.id', '=', 'person.id')                
                ->join('tema', 'empresa.idtema', '=', 'tema.idtema');
        if ($leftJoin) {
            $select->join('moduloempresa', 'empresa.idempresa', '=', 'moduloempresa.idempresa')
                    ->join('modulo', 'moduloempresa.idmodulo', '=', 'modulo.idmodulo');
        } else {
            $select->join('entidad', 'empresa.idempresa', '=', 'entidad.idempresa')
                    //->join('entidadmodulo', 'entidad.identidad', '=', 'entidadmodulo.identidad')
                    ->join('entidadperfil', 'entidad.identidad', '=', 'entidadperfil.identidad')
                    ->join('perfil', 'entidadperfil.idperfil', '=', 'perfil.idperfil')
                    ->join('perfilmodulo', 'perfil.idperfil', '=', 'perfilmodulo.idperfil')
                    ->join('modulo', 'perfilmodulo.idmodulo', '=', 'modulo.idmodulo')
                    ->join('moduloempresa', 'modulo.idmodulo', '=', 'moduloempresa.idmodulo');
        }
        $data = $select
                ->select('modulo.idmodulo', 'modulo.parent', 'modulo.orden', 'modulo.nombre', 'modulo.url as urlvista', 'modulo.icono', 'modulo.nivel', 'empresa.idempresa', 'empresa.url', 'empresa.razonsocial', 'tema.nombre as temanombre', 'tema.archivo', 'tema.imgvista')
                ->where($param)
                ->orderBy('modulo.parent', 'ASC')
                ->orderBy('modulo.orden', 'ASC')
                ->get();

        $modules = array();
        foreach ($data as $fila) {
            $modules[$fila->url]['name'] = $fila->razonsocial;
            $modules[$fila->url]['namethem'] = $fila->temanombre;
            $modules[$fila->url]['filethem'] = $fila->archivo;
            $modules[$fila->url]['imagethem'] = $fila->imgvista;
            $modules[$fila->url]['modules'][] = $fila;
        }

        foreach ($modules as $urlente => $fila) {

            $modules[$urlente]['modules'] = $this->_ordenarModuleEnterprise($fila['modules']);

            $newmodulos = array();
            foreach ($modules[$urlente]['modules'] as $valor) {
                if ($valor['level'] == 1) {
                    $newmodulos[$valor['idmodulo']]['id'] = $valor['idmodulo'];
                    $newmodulos[$valor['idmodulo']]['name'] = $valor['descripcion'];
                    $newmodulos[$valor['idmodulo']]['level'] = $valor['level'];
                    $newmodulos[$valor['idmodulo']]['icon'] = $valor['iconmodu'];
                }
                if ($valor['level'] == 2) {
                    $newmodulos[$valor['parent']]['menus'][$valor['idmodulo']]['id'] = $valor['idmodulo'];
                    $newmodulos[$valor['parent']]['menus'][$valor['idmodulo']]['name'] = $valor['descripcion'];
                    $newmodulos[$valor['parent']]['menus'][$valor['idmodulo']]['uri'] = $valor['urlvista'];
                    $newmodulos[$valor['parent']]['menus'][$valor['idmodulo']]['children'] = $valor['condicion'];
                    $newmodulos[$valor['parent']]['menus'][$valor['idmodulo']]['icon'] = $valor['iconmodu'];
                }
                if ($valor['level'] == 3) {
                    $newmodulos[$valor['moduloselect']]['menus'][$valor['parent']]['options'][$valor['idmodulo']]['id'] = $valor['idmodulo'];
                    $newmodulos[$valor['moduloselect']]['menus'][$valor['parent']]['options'][$valor['idmodulo']]['name'] = $valor['descripcion'];
                    $newmodulos[$valor['moduloselect']]['menus'][$valor['parent']]['options'][$valor['idmodulo']]['uri'] = $valor['urlvista'];
                }
            }
            $modules[$urlente]['modules'] = $newmodulos;
        }

        //Eliminar los indice de los array en los modulos
        /* Esto es si queremos que los indices no sean los id de modulos, sino un correlativo.
         * Esta nueva matriz hara que el orden en angularjs se refleje ya que se trata de indice ascendente.
         * Si omito esto el AngularJs reordenara los indices ascedente que no es otro que los idmodulos */

        $modulesFormat = [];
        foreach ($modules as $pk => $row) {
            $modulesFormat[$pk] = $row;
            $im = 0;
            unset($modulesFormat[$pk]['modules']);
            foreach ($row['modules'] as $modulo) {
                $modulesFormat[$pk]['modules'][$im] = $modulo;
                if (!empty($modulo['menus'])) {
                    $ime = 0;
                    unset($modulesFormat[$pk]['modules'][$im]['menus']);
                    foreach ($modulo['menus'] as $menu) {
                        $modulesFormat[$pk]['modules'][$im]['menus'][$ime] = $menu;
                        if (!empty($menu['options'])) {
                            $io = 0;
                            unset($modulesFormat[$pk]['modules'][$im]['menus'][$ime]['options']);
                            foreach ($menu['options'] as $option) {
                                $modulesFormat[$pk]['modules'][$im]['menus'][$ime]['options'][$io] = $option;
                                $io++;
                            }
                        }
                        $ime++;
                    }
                }
                $im++;
            }
        }

        return $modulesFormat;
        //return $modules;
    }

    public function ListaPerfiles($param) {
        $data = \DB::table('empresa')
                ->join('entidad', 'empresa.idempresa', '=', 'entidad.idempresa')
                ->join('entidadperfil', 'entidad.identidad', '=', 'entidadperfil.identidad')
                ->join('perfil', 'entidadperfil.idperfil', '=', 'perfil.idperfil')
                ->select('entidad.identidad', 'entidad.apellidopat', 'entidad.apellidomat', 'entidad.nombre', 'entidad.iddocumento', 'entidad.numerodoc', 'entidad.imgperfil', 'entidad.sexo', 'entidad.entidad', 'perfil.idperfil', 'perfil.nombre as perfil', 'empresa.url', 'empresa.razonsocial', 'empresa.imglogologin', 'empresa.imglogosistema')
                ->where($param)
                ->orderBy('empresa.idempresa', 'ASC')
                ->orderBy('entidadperfil.idperfil', 'ASC')
                ->get();

        $profiles = array();
        foreach ($data as $fila) {
            $profiles['empresas'][$fila->url]['razonsocial'] = $fila->razonsocial;
            $profiles['empresas'][$fila->url]['imglogologin'] = $fila->imglogologin;
            $profiles['empresas'][$fila->url]['imglogosistema'] = $fila->imglogosistema;
            $profiles['empresas'][$fila->url]['numerodoc'] = $fila->numerodoc;
            $profiles['empresas'][$fila->url]['identidad'] = $fila->identidad;
            $profiles['empresas'][$fila->url]['entidad'] = $fila->apellidopat . ' ' . $fila->apellidomat . ', ' . $fila->nombre;
            $profiles['empresas'][$fila->url]['nombres'] = empty($fila->nombre) ? $fila->entidad : $fila->nombre;
            $profiles['empresas'][$fila->url]['apellidos'] = $fila->apellidopat . ' ' . $fila->apellidomat;
            $profiles['empresas'][$fila->url]['imgperfil'] = $fila->imgperfil;
            $profiles['empresas'][$fila->url]['sexo'] = $fila->sexo;
            $profiles['empresas'][$fila->url]['perfiles'][$fila->idperfil] = $fila->perfil;
            $profiles['empresas'][$fila->url]['perfilnombre'] = $fila->perfil; //La linea de arriba no debe ir porque los perfiles son unicos
        }

        return $profiles;
    }

    private function _ordenarModuleEnterprise($data) {
        $tablaorden = array();
        foreach ($data as $fila) {
            $tablaorden[$fila->idmodulo] = '';
        }

        $tablaorden = $this->_ordenarPorJerarquia($tablaorden, $data);

        $matriz = array();
        $matrizTmp = $data;
        $i = 0;
        foreach ($data as $fila) {
            $condic = 0;
            foreach ($matrizTmp as $row) {
                if ($fila->idmodulo == $row->parent) {
                    $condic = 1;
                    break;
                }
            }

            $matriz[$i] = array(
                'idmodulo' => $fila->idmodulo,
                'parent' => $fila->parent,
                'descripcion' => $fila->nombre,
                'archivo' => $fila->url,
                'iconmodu' => $fila->icono,
                'level' => $fila->nivel,
                'orden' => $tablaorden[$fila->idmodulo],
                'condicion' => $condic,
                'urlvista' => $fila->urlvista
            );

            $i++;
        }

        $data1 = $matriz;
        $data2 = $matriz;
        $data3 = $matriz;
        $nuevaMatriz = array();
        foreach ($data1 as $fila1) {
            if ($fila1['orden'] == '1') {
                $nuevaMatriz[] = $fila1;
                foreach ($data2 as $fila2) {
                    if ($fila2['orden'] == '2' && $fila1['idmodulo'] == $fila2['parent']) {
                        $nuevaMatriz[] = $fila2;
                        foreach ($data3 as $fila3) {
                            if ($fila3['orden'] == '3' && $fila2['idmodulo'] == $fila3['parent']) {
                                $nuevaMatriz[] = $fila3;
                            }
                        }
                    }
                }
            }
        }

        $data = array();
        $idmodulotmp = '';
        foreach ($nuevaMatriz as $fila) {
            if ($fila['orden'] == '1')
                $idmodulotmp = $fila['idmodulo'];

            $fila['moduloselect'] = $idmodulotmp;
            $data[] = $fila;
        }

        return $data;
    }

    private function _ordenarPorJerarquia($tablaorden, $data) {
        $data1 = $data;
        $data2 = $data;
        $orden = '';
        foreach ($data1 as $fila1) {
            $encontrado = FALSE;
            foreach ($data2 as $fila2) {
                if ($fila1->parent == $fila2->idmodulo) {
                    $encontrado = TRUE;
                    $orden = $tablaorden[$fila1->parent];
                    if (!empty($orden)) {
                        $orden = $orden + 1;
                        $tablaorden[$fila1->idmodulo] = $orden;
                        break;
                    }
                }
            }
            if (!$encontrado) {
                $tablaorden[$fila1->idmodulo] = 1;
            }
        }

        $entro = false;
        foreach ($tablaorden as $ind => $orden) {
            if (empty($orden)) {
                $entro = true;
                break;
            }
        }
        if ($entro) {
            $tablaorden = $this->_ordenarPorJerarquia($tablaorden, $data);
        }
        return $tablaorden;
    }

}
