(function () {
    'use strict';
    
    angular
            .module('adminLTE')
            .factory('personalService', personalService);

    personalService.$inject = ['$http', '$rootScope'];     
    function personalService($http, $rootScope) {
        var service = {}; 
        
        service.GetIndex = GetIndex;  
        service.GetCumpleanos = GetCumpleanos; 
        service.GetModulos = GetModulos; 
        service.GetSearch = GetSearch;
        service.GetShow = GetShow; 
        service.GetNew = GetNew;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;        
        service.GetNumero = GetNumero;
        service.Updatepersonal = Updatepersonal;
        service.UpdatePassword = UpdatePassword;
        service.GetProfile = GetProfile; 
        return service; 
        
        //Grid
        function GetIndex(request) {  
            return $http.get($rootScope.api + '/personal', {params: request}).then(handleSuccess, handleError('Error al consultar personal'));             
        }
        
        //Cumpleaños del dia
        function GetCumpleanos(request) {  
            return $http.get($rootScope.servidor + '/personal/cumpleanos', {params: request}).then(handleSuccess, handleError('Error al consultar personal'));             
        }
        
        //Modulos del usuario
        function GetModulos(request) {
            return $http.get($rootScope.servidor + '/personal/modulos', {params: request}).then(handleSuccess, handleError('Error al consultar modulos de personal'));             
        }
        
        //Autocompletable
        function GetSearch(request) {     // le mando el likepersonal 
            return $http.get($rootScope.servidor + '/personal', {params: request});
        }
        
        //Visualizar un registro
        function GetShow(id, request){ 
            return $http.get($rootScope.servidor + '/personal/' + id, {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Visualizar profile
        function GetProfile(id){ 
            return $http.get($rootScope.servidor + '/personal/profile/' + id).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //ConsultarSiExisteNroDocumento
        function GetNumero(request){
            return $http.get($rootScope.api + '/personal/documento/nro', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Actulizar personal Con una nueva personal
        function Updatepersonal(personal){
            return $http.post($rootScope.servidor + '/personal/subpersonal/'+personal.idpersonal, personal).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Actulizar Contrasena personal 
        function UpdatePassword(personal){
            return $http.post($rootScope.servidor + '/personal/password/'+entidad.identidad, entidad).then(handleSuccess, handleError('Error getting all producto'));
        }
        
        //Nuevo 
        function GetNew(request){
            return $http.get($rootScope.api + '/personal/new', {params: request}).then(handleSuccess, handleError('Error getting all producto'));
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
