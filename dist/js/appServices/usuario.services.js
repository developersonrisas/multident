(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('usuarioService', usuarioService);

    usuarioService.$inject = ['$http', '$rootScope'];     
    function usuarioService($http, $rootScope) {
        var service = {}; 
        
        service.GetIndex = GetIndex;  
        service.GetSearch = GetSearch;
        service.GetShow = GetShow; 
        service.GetNew = GetNew;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;        
        service.Updatepersonal = Updatepersonal;
        return service; 
        
        //Grid
        function GetIndex(request) {  
            return $http.get($rootScope.api + '/usuario', {params: request}).then(handleSuccess, handleError('Error al consultar rol'));             
        }
        
        //Autocompletable
        function GetSearch(request) {     // le mando el likepersonal 
            return $http.get($rootScope.servidor + '/usuario', {params: request});
        }
        
        //Visualizar un registro
        function GetShow(id, request){ 
            return $http.get($rootScope.servidor + '/usuario/' + id, {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        
        //Actualizar personal Con una nueva personal
        function Updatepersonal(personal){
            return $http.post($rootScope.servidor + '/personal/subpersonal/'+personal.idpersonal, personal).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.servidor + '/entidad/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Grabar
        function Create(OBJentidad) {  
            return $http.post($rootScope.servidor + '/entidad', OBJentidad).then(handleSuccess, handleError('Error creating entidad'));
        }
        
        //Actualizar
        function Update(OBJentidad) {    
            return $http.post($rootScope.servidor + '/entidad/' + OBJentidad.entidad.identidad, OBJentidad).then(handleSuccess, handleError('Error updating entidad'));
        }
        
        //Eliminar
        function Delete(id, request) {
            return $http.post($rootScope.servidor + '/entidad/delete/' + id,  request).then(handleSuccess, handleError('Error deleting user'));
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
