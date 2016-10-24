"use strict";
(function () {
    angular.module('adminLTEApp.empresaadmin', [])
            .controller('listEmpresaAdminCtrl', listEmpresaAdminCtrl)
            .controller('newEmpresaAdminCtrl', newEmpresaAdminCtrl)
            .controller('editEmpresaAdminCtrl', editEmpresaAdminCtrl)
            .controller('modalEmpresaAdminInstanceCtrl', modalEmpresaAdminInstanceCtrl);


    listEmpresaAdminCtrl.$inject = ['$scope', '$state', 'empresaadminService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listEmpresaAdminCtrl($scope, $state, empresaadminService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
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

        function loadEmpresas() {
            var columnsDefs = [
                {name: 'Id', field: 'idempresa_admin', width: '60'},
                {name: 'RUC', field: 'ruc', width: '160'},
                {name: 'Nombre', field: 'nombre_empresa', maxwidth: '300'},
                {name: 'Dirección', field: 'direccion', maxwidth: '300'},
                {name: 'Telefono', field: 'telefono', maxwidth: '300'},
                {name: 'Celular', field: 'celular', maxwidth: '300'},
                {name: 'Representante Legal', field: 'representante_legal', maxwidth: '300'},
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                empresaadminService.GetIndex(vm.filter).then(function (empresas) {
                
                    vm.gridOptions.totalItems = empresas.total;
                    vm.gridOptions.data = empresas.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, empresas.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalEmpresaAdminInstanceCtrl',
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
                    loadEmpresas();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        loadEmpresas();


    }

    newEmpresaAdminCtrl.$inject = ['$scope', '$state', 'empresaadminService', 'Notification'];
    function newEmpresaAdminCtrl($scope, $state, empresaadminService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        vm.save = function () {
            vm.OBJmodulo = {
                modulo: vm.modulo,

            };

            empresaadminService.Create(vm.OBJmodulo).then(function (modulos) {
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

    editEmpresaAdminCtrl.$inject = ['$scope', '$state', 'empresaadminService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editEmpresaAdminCtrl($scope, $state, empresaadminService, $stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_modulo'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.producto = {};
        vm.edicion = true;


        empresaadminService.GetShow($stateParams.moduloId).then(function (modulos) {
            vm.modulo = modulos.data;

            before = angular.copy(vm.modulo);
        });


        vm.save = function () {
            vm.OBJmodulo = {
                modulo: vm.modulo,
            };

            after = angular.copy(vm.modulo);
            empresaadminService.Update(vm.OBJmodulo).then(function (modulos) {

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

    modalEmpresaAdminInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'empresaadminService', 'Notification'];
    function modalEmpresaAdminInstanceCtrl($scope, $uibModalInstance, modalParam, empresaadminService, Notification) {

        $scope.modulo = {};
        $scope.modulo = {
            idmodulo: modalParam.data.idmodulo,
            nombre_modulo: modalParam.data.nombre_modulo
        };

        $scope.save = function () {
            empresaadminService.Delete($scope.modulo.idmodulo).then(function (modulos) {
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