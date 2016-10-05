(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('tipoCambioService', tipoCambioService);

    tipoCambioService.$inject = ['$http', '$rootScope'];     
    function tipoCambioService($http, $rootScope) {
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
            return $http.get($rootScope.api + '/tipoCambio', {params: request}).then(handleSuccess, handleError('Error al consultar grupo'));             
        }

        //Visualizar un registro
        function GetShow(id, request){ 
            return $http.get($rootScope.api + '/tipoCambio/' + id, {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/tipoCambio/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Grabar
        function Create(OBJgruporol) {  
            return $http.post($rootScope.api + '/tipoCambio', OBJgruporol).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJgrupo) {    
            return $http.post($rootScope.api + '/tipoCambio/' + OBJgrupo.grupo.idgrupo, OBJgrupo).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/tipoCambio/delete/' + id,  request).then(handleSuccess, handleError('Error deleting user'));
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
