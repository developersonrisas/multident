(function () {
    'use strict';

    angular
            .module('adminLTE')
            .factory('ubigeoService', ubigeoService);

    ubigeoService.$inject = ['$http', '$rootScope'];
    function ubigeoService($http, $rootScope) {
        var service = {};

        service.GetIndex = GetIndex; 
        return service;

        function GetIndex(request) {
            return $http.get($rootScope.api + '/ubigeo', {params: request}).then(handleSuccess, handleError('Error al consultar ubigeo'));
        }

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
