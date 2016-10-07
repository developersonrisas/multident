<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*Route::get('/', function () {
    return view('welcome');
});
*/

use App\Models\entidad;

Route::get('/personal', 'personalController@index');
Route::get('/personal/new', 'personalController@newpersonal');
Route::get('/personal/documento/nro', 'personalController@nrodocumento');

Route::get('/ubigeo', 'ubigeoController@index'); 
// GRUPO
Route::get('/grupo/rolesAgregados', 'grupoController@rolesAgregados');
Route::get('/grupo/rolesNoAgregados', 'grupoController@rolesNoAgregados');

Route::get('/grupo', 'grupoController@index');
Route::get('/grupo/{id}', 'grupoController@show');
//Route::get('/grupo/rolesNoAgregados', 'grupoController@rolesNoAgregados');


Route::post('/grupo', 'grupoController@store');
Route::post('/grupo/{id}', 'grupoController@update');
Route::post('/grupo/delete/{id}', 'grupoController@destroy');
// FIN DE GRUPO

// ROLES	
Route::get('/rol', 'rolController@index');
Route::get('/rol/new', 'rolController@newrol');
Route::post('/rol', 'rolController@store');
Route::get('/rol/{id}', 'rolController@show');
Route::post('/rol/subrol', 'rolController@storeSub');
Route::post('/rol/{id}', 'rolController@update');
Route::post('/rol/delete/{id}', 'rolController@destroy');
// FIN DE ROLES	

// GRUPO_ROLES	
Route::get('/grupoRol', 'gruporolController@index');
Route::get('/grupoRol/new', 'gruporolController@newrol');
Route::post('/grupoRol', 'gruporolController@store');
Route::get('/grupoRol/{id}', 'gruporolController@show');
Route::post('/grupoRol/{id}', 'gruporolController@update');
Route::post('/grupoRol/delete/{id}', 'gruporolController@destroy');
// FIN DE GRUPO_ROLES	




// USUARIOS	
Route::get('/usuario', 'usuarioController@index');

// FIN DE USUARIOS

// MODULOS	
Route::get('/modulo', 'moduloController@index');
Route::get('/modulo/{id}', 'moduloController@show');
Route::post('/modulo', 'moduloController@store');
Route::post('/modulo/{id}', 'moduloController@update');
Route::post('/modulo/delete/{id}', 'moduloController@destroy');
// FIN DE MODULOS		

// PACIENTES	
Route::get('/paciente', 'pacienteController@index');
// FIN DE PACIENTES	

// ODONTOLOGOS		
Route::get('/odontologo', 'odontologoController@index');
// FIN DE ODONTOLOGOS		


// CARGOS	
Route::get('/cargo', 'cargoController@index');
Route::get('/cargo/{id}', 'cargoController@show');
Route::post('/cargo', 'cargoController@store');
Route::post('/cargo/{id}', 'cargoController@update');
Route::post('/cargo/delete/{id}', 'cargoController@destroy');
// FIN DE CARGOS	


// MONEDAS	
Route::get('/moneda', 'monedaController@index');
Route::get('/moneda/{id}', 'monedaController@show');
Route::post('/moneda', 'monedaController@store');
Route::post('/moneda/{id}', 'monedaController@update');
Route::post('/moneda/delete/{id}', 'monedaController@destroy');
// FIN DE MONEDAS	

// TIPO DE CAMBIO		
Route::get('/tipoCambio', 'tipoCambioController@index');
Route::get('/tipoCambio/{id}', 'tipoCambioController@show');
Route::post('/tipoCambio', 'tipoCambioController@store');
Route::post('/tipoCambio/{id}', 'tipoCambioController@update');
Route::post('/tipoCambio/delete/{id}', 'tipoCambioController@destroy');
// FIN DE TIPO DE CAMBIO		