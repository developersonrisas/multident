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

// GRUPO
Route::get('/grupo', 'grupoController@index');
Route::get('/grupo/{id}', 'grupoController@show');
Route::post('/grupo', 'grupoController@store');
Route::post('/grupo/{id}', 'grupoController@update');
Route::post('/grupo/delete/{id}', 'grupoController@destroy');
// FIN DE GRUPO

// ROLES	
Route::get('/rol', 'rolController@index');
Route::get('/rol/new', 'rolController@newrol');
Route::post('/rol', 'rolController@store');
Route::get('/rol/{id}', 'rolController@show');
Route::post('/rol/{id}', 'rolController@update');
Route::post('/rol/delete/{id}', 'rolController@destroy');
// FIN DE ROLES	

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