<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class empresa extends Model
{
    public $table = 'empresa_admin';
    public $primaryKey = 'idempresa_admin';
    public $timestamps = true;
    public $fillable = [
        'ruc',
        'nombre_empresa',
        'telefono',
        'email',
        'celular',
        'telefono_adicional',
        'direccion',
        'idubigeo',    
        'representante_legal',
        'logo',
        'idusuario',
        'fecha_modif',
        'estado_empresa'
    ];
    protected $hidden = ['idempresa_admin'];

    public function empresa($param) {
        $data = \DB::table('empresa_admin')
                //->join('tema', 'empresa.idtema', '=', 'tema.idtema')
                ->select('nombre_empresa', 'ruc', 'telefono', 'email', 'celular', 'telefono_adicional', 'direccion','idubigeo','representante_legal','logo','idusuario','fecha_modif','estado_empresa')
                ->where($param)
                ->first();
        
        return $data;
    }

    public function departamentos($where = NULL) {
        $select = \DB::table('ubigeo')
                ->select('iddepartamento', 'descripcion_ubig')
                ->where('idprovincia', '=', '00')
                ->where('iddistrito', '=', '00');
        if (!empty($where)) {
            $select->where($where);
        }
        $data = $select
                ->orderBy('descripcion_ubig', 'asc')
                ->get();

        return $data;
    }

    public function provincias($departamento, $where = NULL) {
        $select = \DB::table('ubigeo')
                ->select('idprovincia', 'descripcion_ubig')
                ->where('iddepartamento', '=', $departamento)
                ->where('idprovincia', '!=', '00')
                ->where('iddistrito', '=', '00');
        if (!empty($where)) {
            $select->where($where);
        }
        $data = $select
                ->orderBy('descripcion_ubig', 'asc')
                ->get();
        return $data;
    }

    public function distritos($departamento, $provincia, $where = NULL) {
        $select = \DB::table('ubigeo')
                ->select('idubigeo','iddistrito', 'descripcion_ubig')
                ->where('iddepartamento', '=', $departamento)
                ->where('idprovincia', '=', $provincia)
                ->where('iddistrito', '!=', '00');
        if (!empty($where)) {
            $select->where($where);
        }
        $data = $select
                ->orderBy('descripcion_ubig', 'asc')
                ->get();
        return $data;
    }

    public function ubigeo($idubigeo) {
        $select = \DB::table('ubigeo')
                ->select('*')
                ->where('idubigeo', '=', $idubigeo);
        $data = $select
                ->get();
        return $data;
    }

    public function tipo_documento_identidad() {
        $data = \DB::table('tipo_documento_identidad')
                ->select('tipo_documento_identidad.*')
                ->where('estado_tipodocumento', '=', 1)
                ->get();
        return $data;
    }

    public function tipo_documento_contable() {
        $data = \DB::table('tipo_documento_contable')
                ->select('tipo_documento_contable.*')
                ->where('estado_tipodocumento', '=', 1)
                ->get();
        return $data;
    }

    public function moneda() {
        $data = \DB::table('moneda')
                ->select('moneda.*')
                ->where('estado_moneda', '=', 1)
                ->get();
        return $data;
    }

    public function unidad_medida($id) {
        $data = \DB::table('unidad_medida')
                ->select('unidad_medida.*')
                ->where('estado_unidadmedida', '=', 1)
                ->get();
        return $data;
    }


}
