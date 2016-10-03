"use strict";
(function () {
    angular.module('adminLTEApp.modulo', [])
            .controller('listModuloCtrl', listModuloCtrl)
            .controller('newModuloCtrl', newModuloCtrl)
            .controller('editModuloCtrl', editModuloCtrl)
            .controller('modalModuloInstanceCtrl', modalModuloInstanceCtrl);


    listModuloCtrl.$inject = ['$scope', '$state', 'moduloService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listModuloCtrl($scope, $state, moduloService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
        var vm = this;
        vm.filter = {};
        vm.stateparent = $state.$current.parent.self.name;
        $scope.$on('handleBroadcast', function () {
            vm.getPage();
        });

        $scope.btnToggleFiltering = function(){
            vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
            vm.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        };

        function loadModulos() {
            var columnsDefs = [
                {name: 'Id', field: 'idmodulo', width: '60'},
                {name: 'Nombre', field: 'nombre_modulo', maxwidth: '300'},
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                moduloService.GetIndex(vm.filter).then(function (modulos) {
                
                    vm.gridOptions.totalItems = modulos.total;
                    vm.gridOptions.data = modulos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, modulos.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalModuloInstanceCtrl',
                windowClass: 'modal-primary',
                size: 'sm',
                resolve: {
                    modalParam: function () {
                        return {
                            accion: accion,
                            data: data
                        };
                    }
                }
            });

            modalInstance.result.then(function (reload) {
                if (reload)
                    loadModulos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        loadModulos();


    }

    newModuloCtrl.$inject = ['$scope', '$state', 'moduloService', 'Notification'];
    function newModuloCtrl($scope, $state, moduloService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        vm.save = function () {
            vm.OBJmodulo = {
                modulo: vm.modulo,

            };

            moduloService.Create(vm.OBJmodulo).then(function (modulos) {
                if (modulos.type === 'success') {
                    Notification.primary({message: modulos.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: modulos.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editModuloCtrl.$inject = ['$scope', '$state', 'moduloService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editModuloCtrl($scope, $state, moduloService, $stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_modulo'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.producto = {};
        vm.edicion = true;


        moduloService.GetShow($stateParams.moduloId).then(function (modulos) {
            vm.modulo = modulos.data;

            before = angular.copy(vm.modulo);
        });


        vm.save = function () {
            vm.OBJmodulo = {
                modulo: vm.modulo,
            };

            after = angular.copy(vm.modulo);
            moduloService.Update(vm.OBJmodulo).then(function (modulos) {

                if (modulos.type === 'success') {
                    Notification.primary({message: modulos.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: modulos.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };

        vm.brodcast = function () {
            for (var i = 0, len = fields.length; i < len; i++) {
                if (before[fields[i]] !== after[fields[i]]) {
                    $scope.$emit('handleBroadcast');
                    break;
                }
            }
        };


    }

    modalModuloInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'moduloService', 'Notification'];
    function modalModuloInstanceCtrl($scope, $uibModalInstance, modalParam, moduloService, Notification) {

        $scope.modulo = {};
        $scope.modulo = {
            idmodulo: modalParam.data.idmodulo,
            nombre_modulo: modalParam.data.nombre_modulo
        };

        $scope.save = function () {
            moduloService.Delete($scope.modulo.idmodulo).then(function (modulos) {
                var reload = false;
                if (modulos.type === 'success') {
                    reload = true;
                    Notification.primary({message: modulos.data, title: '<i class="fa fa-check"></i>'});
                } else {
                    Notification.error({message: modulos.data, title: '<i class="fa fa-ban"></i>'});
                }
                $uibModalInstance.close(reload);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();