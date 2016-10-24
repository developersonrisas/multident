(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('empresaadminService', empresaadminService);

    empresaadminService.$inject = ['$http', '$rootScope'];     
    function empresaadminService($http, $rootScope) {
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
            return $http.get($rootScope.api + '/empresaadmin', {params: request}).then(handleSuccess, handleError('Error al consultar rol'));             
        }
        
        //Visualizar un registro
        function GetShow(id){ 
            return $http.get($rootScope.api + '/empresaadmin/' + id).then(handleSuccess, handleError('Error getting all producto'));
        }
                
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/entidad/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Grabar
        function Create(OBJempresa) {  
            return $http.post($rootScope.api + '/empresaadmin', OBJempresa).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJempresa) {    
            return $http.post($rootScope.api + '/empresaadmin/' + OBJempresa.empresa.idempresa_admin, OBJempresa).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/empresaadmin/delete/' + id).then(handleSuccess, handleError('Error deleting user'));
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
