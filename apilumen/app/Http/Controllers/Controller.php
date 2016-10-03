<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

//class Controller extends BaseController
//{
//    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
//}


class Controller extends BaseController {

    public $objTtoken;

    public function crearRespuesta($datos, $codigo, $total = '', $currentPage = '', $others = []) {   // $success:
        // 1: Success, Procesado y se llevo a cabo con exito la tarea.
        // 2: Suceess, Procesado pero no se llevo la tarea. Ej. Tienes datos relaccionados en otra tabla 
        $success = 'success';
        if (is_array($codigo)) {
            $success = $codigo[1];
            $codigo = $codigo[0];
        }

        return response()->json(['type' => $success, 'data' => $datos, 'total' => $total, 'currentPage' => $currentPage, 'others' => $others], $codigo);
    }

    public function crearRespuestaError($mensaje, $codigo) {
        return response()->json(['message' => $mensaje, 'code' => $codigo], $codigo);
    }

    public function crearRespuestaToken() {
        return response()->json(['message' => 'tokenExpirado', 'code' => 200], 200);
    }

    public function getToken($request) {
        /* Autor: chaucachavez@gmail.com 
         * Objeto Global JWT
         * Ejemplo: iss: "http://wwww.lagranescuela.com" my: 1 myenterprise: "cime" myusername: "44120026A"
         * JWT: //"aud" => "http://example.com", //"iat" => time(), //"exp" => (time() + 10), //"nbf" => 1357000000
         */
        
        if (!empty($request->header('AuthorizationToken'))) {
            $key = "x1TLVtPhZxN64JQB3fN8cHSp69999999";
            $this->objTtoken = JWT::decode($request->header('AuthorizationToken'), $key, array('HS256'));
        }
    }

    protected function buildFailedValidationResponse(Request $request, array $errors) {
        return $this->crearRespuestaError($errors, 422);
    }

    //22.01.2016
    //Generacion de arbol Tree
    function procesarRaiz($data, $OPTION, $idarbol = NULL, $pila = false) {
        //Nota: $idarbol debe ser entero, caso contrario genera ERROR.  

        $i = 1;
        $arbol = [];

        while (count($data) > 0):
            // echo $i++;
            // Extraigo el o los nodos raices.
            foreach ($data as $b => $row) {
                if (empty($row[$OPTION['PARENT']])) {
                    $row[$OPTION['CHILDREN']] = [];
                    $row['nivel'] = 0;
                    $arbol[] = $row;
                    unset($data[$b]);
                }
            }

            // Extraigo los nodos hijos 
            foreach ($data as $b => $row) {
                $row[$OPTION['CHILDREN']] = [];
                $tmp = $this->procesarNiveles($arbol, $row, $OPTION);
                if ($tmp['flat']) {
                    $arbol = $tmp['data'];
                    unset($data[$b]);
                }
            }

        endwhile;

        /* Extrae una determinada raiz.        
         * */
        if (!empty($idarbol)) {
            foreach ($arbol as $fila) {
                if ($fila[$OPTION['ID']] === $idarbol) {
                    $arbol = $fila;
                    break 1;
                }
                foreach ($fila[$OPTION['CHILDREN']] as $fila2) {
                    if ($fila2[$OPTION['ID']] === $idarbol) {
                        $arbol = $fila2;
                        break 2;
                    }
                    foreach ($fila2[$OPTION['CHILDREN']] as $fila3) {
                        if ($fila3[$OPTION['ID']] === $idarbol) {
                            $arbol = $fila3;
                            break 3;
                        }
                        foreach ($fila3[$OPTION['CHILDREN']] as $fila4) {
                            if ($fila4[$OPTION['ID']] === $idarbol) {
                                $arbol = $fila4;
                                break 4;
                            }
                            foreach ($fila4[$OPTION['CHILDREN']] as $fila5) {
                                if ($fila5[$OPTION['ID']] === $idarbol) {
                                    $arbol = $fila5;
                                    break 5;
                                }
                            }
                        }
                    }
                }
            }
        }

        /* Convierte el arbol a un array UNIDIMENSIONAL del tipo PILA.         
         * */
        if ($pila) {
            $arbol = $this->procesarPila($arbol, $OPTION);
        }
        //dd($arbol, $data);
        return $arbol;
    }

    function procesarNiveles($arbol, $row, $OPTION) {
        $flat = false;

        //Nivel 1
        foreach ($arbol as $i => $fila) {
            if ($fila[$OPTION['ID']] == $row[$OPTION['PARENT']]) {
                $row['nivel'] = 1;
                array_push($arbol[$i][$OPTION['CHILDREN']], $row);
                $flat = true;
                break 1;
            }
            //Nivel 2
            foreach ($fila[$OPTION['CHILDREN']] as $i2 => $fila2) {
                if ($fila2[$OPTION['ID']] == $row[$OPTION['PARENT']]) {
                    $row['nivel'] = 2;
                    array_push($arbol[$i][$OPTION['CHILDREN']][$i2][$OPTION['CHILDREN']], $row);
                    $flat = true;
                    break 2;
                }
                //Nivel 3
                foreach ($fila2[$OPTION['CHILDREN']] as $i3 => $fila3) {
                    if ($fila3[$OPTION['ID']] == $row[$OPTION['PARENT']]) {
                        $row['nivel'] = 3;
                        array_push($arbol[$i][$OPTION['CHILDREN']][$i2][$OPTION['CHILDREN']][$i3][$OPTION['CHILDREN']], $row);
                        $flat = true;
                        break 3;
                    }
                    //Nivel 4 
                    foreach ($fila3[$OPTION['CHILDREN']] as $i4 => $fila4) {
                        if ($fila4[$OPTION['ID']] == $row[$OPTION['PARENT']]) {
                            $row['nivel'] = 4;
                            array_push($arbol[$i][$OPTION['CHILDREN']][$i2][$OPTION['CHILDREN']][$i3][$OPTION['CHILDREN']][$i4][$OPTION['CHILDREN']], $row);
                            $flat = true;
                            break 4;
                        }
                        //Nivel 5
                        foreach ($fila4[$OPTION['CHILDREN']] as $i5 => $fila5) {
                            if ($fila5[$OPTION['ID']] == $row[$OPTION['PARENT']]) {
                                $row['nivel'] = 5;
                                array_push($arbol[$i][$OPTION['CHILDREN']][$i2][$OPTION['CHILDREN']][$i3][$OPTION['CHILDREN']][$i4][$OPTION['CHILDREN']][$i5][$OPTION['CHILDREN']], $row);
                                $flat = true;
                                break 5;
                            }
                        }
                    }
                }
            }
        }
        //dd($arbol);
        return array('data' => $arbol, 'flat' => $flat);
    }

    function procesarPila($arbol, $OPTION) {

        $pila = [];

        //Nivel 0
        $tmp = $arbol;
        unset($tmp[$OPTION['CHILDREN']]);
        array_push($pila, $tmp);
        //Nivel 1
        foreach ($arbol[$OPTION['CHILDREN']] as $fila) {
            $tmp = $fila;
            unset($tmp[$OPTION['CHILDREN']]);
            array_push($pila, $tmp);
            //Nivel 2
            foreach ($fila[$OPTION['CHILDREN']] as $i2 => $fila2) {
                $tmp = $fila2;
                unset($tmp[$OPTION['CHILDREN']]);
                array_push($pila, $tmp);
                //Nivel 3
                foreach ($fila2[$OPTION['CHILDREN']] as $i3 => $fila3) {
                    $tmp = $fila3;
                    unset($tmp[$OPTION['CHILDREN']]);
                    array_push($pila, $tmp);
                    //Nivel 4 
                    foreach ($fila3[$OPTION['CHILDREN']] as $i4 => $fila4) {
                        $tmp = $fila4;
                        unset($tmp[$OPTION['CHILDREN']]);
                        array_push($pila, $tmp);
                        //Nivel 5
                        foreach ($fila4[$OPTION['CHILDREN']] as $i5 => $fila5) {
                            $tmp = $fila5;
                            unset($tmp[$OPTION['CHILDREN']]);
                            array_push($pila, $tmp);
                        }
                    }
                }
            }
        }
        //dd($arbol);
        return $pila;
    }

}
