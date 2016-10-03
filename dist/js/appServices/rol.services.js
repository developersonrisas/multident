(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('rolService', rolService);

    rolService.$inject = ['$http', '$rootScope'];     
    function rolService($http, $rootScope) {
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
            return $http.get($rootScope.api + '/rol', {params: request}).then(handleSuccess, handleError('Error al consultar rol'));             
        }
    
        
        //Visualizar un registro
        function GetShow(id, request){ 
            return $http.get($rootScope.api + '/rol/' + id, {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/rol/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Grabar
        function Create(OBJrol) {  
            return $http.post($rootScope.api + '/rol', OBJrol).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJrol) {    
            return $http.post($rootScope.api + '/rol/' + OBJrol.rol.idrol, OBJrol).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/rol/delete/' + id,  request).then(handleSuccess, handleError('Error deleting user'));
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
