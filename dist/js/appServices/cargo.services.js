(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('cargoService', cargoService);

    cargoService.$inject = ['$http', '$rootScope'];     
    function cargoService($http, $rootScope) {
        var service = {}; 
        
        service.GetIndex = GetIndex;  
        service.GetShow = GetShow; 
        service.GetNew = GetNew;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;        
        return service; 
        
        //Grid
        function GetIndex(request) {  
            return $http.get($rootScope.api + '/cargo', {params: request}).then(handleSuccess, handleError('Error al consultar rol'));             
        }
        
        //Visualizar un registro
        function GetShow(id){ 
            return $http.get($rootScope.api + '/cargo/' + id).then(handleSuccess, handleError('Error getting all cargos'));
        }
                
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/entidad/new', {params: request}).then(handleSuccess, handleError('Error getting all cargo'));
        }
        
        //Grabar
        function Create(OBJcargo) {  
            return $http.post($rootScope.api + '/cargo', OBJcargo).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJcargo) {    
            return $http.post($rootScope.api + '/cargo/' + OBJcargo.cargo.idcargo, OBJcargo).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/cargo/delete/' + id).then(handleSuccess, handleError('Error deleting user'));
        }
        
        // private functions
        function handleSuccess(res) { 
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }
    }
})();
