(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('grupoService', grupoService);

    grupoService.$inject = ['$http', '$rootScope'];     
    function grupoService($http, $rootScope) {
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
            return $http.get($rootScope.api + '/grupo', {params: request}).then(handleSuccess, handleError('Error al consultar grupo'));             
        }

        //Visualizar un registro
        function GetShow(id, request){ 
            return $http.get($rootScope.api + '/grupo/' + id, {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/grupo/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Grabar
        function Create(OBJgrupo) {  
            return $http.post($rootScope.api + '/grupo', OBJgrupo).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJgrupo) {    
            return $http.post($rootScope.api + '/grupo/' + OBJgrupo.grupo.idgrupo, OBJgrupo).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.api + '/grupo/delete/' + id,  request).then(handleSuccess, handleError('Error deleting user'));
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
