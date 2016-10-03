(function () {
    'use strict';

    angular
            .module('adminLTE')
            .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$location'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, $location) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.authenticate = Authenticate;

        return service;

        function Login(username, password, enterprise, callback) {
            $http.post($rootScope.api + '/authenticate', {username: username, password: password, enterprise: enterprise})
                    .success(function (response) {
                        callback(response);
                    });
        }

        function SetCredentials(response) {
            //23.01.2015  
            var modulos = response.userModules;
            $rootScope.modules = (typeof modulos[$rootScope.urlente] === 'undefined') ? [] : modulos[$rootScope.urlente].modules;
            $rootScope.entidad = response.userProfiles.empresas[$rootScope.urlente];

            $cookies.put('token', response.token);
            $http.defaults.headers.common['AuthorizationToken'] = response.token;
        }

        function ClearCredentials() {
            $cookies.remove('token');
            $rootScope.modules = [];
            $rootScope.entidad = {};

            $http.defaults.headers.common.AuthorizationToken = '';
        }

        function Authenticate() {
            return (typeof $cookies.get('token') === 'string') ? true : false;
        }
    }
})();