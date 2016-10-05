(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('monedaService', monedaService);

    monedaService.$inject = ['$http', '$rootScope'];     
    function monedaService($http, $rootScope) {
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
            return $http.get($rootScope.api + '/moneda', {params: request}).then(handleSuccess, handleError('Error al consultar moneda'));             
        }
        
        //Visualizar un registro
        function GetShow(id){ 
            return $http.get($rootScope.api + '/moneda/' + id).then(handleSuccess, handleError('Error getting all moneda'));
        }
                
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/entidad/new', {params: request}).then(handleSuccess, handleError('Error getting all moneda'));
        }
        
        //Grabar
        function Create(OBJmoneda) {  
            return $http.post($rootScope.api + '/moneda', OBJmoneda).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJmoneda) {    
            return $http.post($rootScope.api + '/moneda/' + OBJmoneda.moneda.idmoneda, OBJmoneda).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/moneda/delete/' + id).then(handleSuccess, handleError('Error deleting user'));
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
