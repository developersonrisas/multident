"use strict";
(function () {
    angular.module('adminLTEApp.cargo', [])
            .controller('listCargoCtrl', listCargoCtrl)
            .controller('newCargoCtrl', newCargoCtrl)
            .controller('editCargoCtrl', editCargoCtrl)
            .controller('modalCargoInstanceCtrl', modalCargoInstanceCtrl);


    listCargoCtrl.$inject = ['$scope', '$state', 'cargoService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listCargoCtrl($scope, $state, cargoService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
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

        function loadCargos() {
            var columnsDefs = [
                {name: 'Id', field: 'idcargo', width: '60'},
                {name: 'Nombre', field: 'nombre_cargo', maxwidth: '300'},
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                cargoService.GetIndex(vm.filter).then(function (cargos) {
                
                    vm.gridOptions.totalItems = cargos.total;
                    vm.gridOptions.data = cargos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, cargos.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalCargoInstanceCtrl',
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
                    loadCargos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        loadCargos();


    }

    newCargoCtrl.$inject = ['$scope', '$state', 'cargoService', 'Notification'];
    function newCargoCtrl($scope, $state, cargoService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        vm.save = function () {
            vm.OBJcargo = {
                cargo: vm.cargo,

            };

            cargoService.Create(vm.OBJcargo).then(function (cargos) {
                if (cargos.type === 'success') {
                    Notification.primary({message: cargos.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: cargos.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editCargoCtrl.$inject = ['$scope', '$state', 'cargoService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editCargoCtrl($scope, $state, cargoService, $stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_cargo'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.cargo = {};
        vm.edicion = true;


        cargoService.GetShow($stateParams.cargoId).then(function (cargos) {
            vm.cargo = cargos.data;

            before = angular.copy(vm.cargo);
        });


        vm.save = function () {
            vm.OBJcargo = {
                cargo: vm.cargo,
            };

            after = angular.copy(vm.cargo);
            cargoService.Update(vm.OBJcargo).then(function (cargos) {

                if (cargos.type === 'success') {
                    Notification.primary({message: cargos.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: cargos.data, title: '<i class="fa fa-ban"></i>'});
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

    modalCargoInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'cargoService', 'Notification'];
    function modalCargoInstanceCtrl($scope, $uibModalInstance, modalParam, cargoService, Notification) {

        $scope.cargo = {};
        $scope.cargo = {
            idcargo: modalParam.data.idcargo,
            nombre_cargo: modalParam.data.nombre_cargo
        };

        $scope.save = function () {
            cargoService.Delete($scope.cargo.idcargo).then(function (cargos) {
                var reload = false;
                if (cargos.type === 'success') {
                    reload = true;
                    Notification.primary({message: cargos.data, title: '<i class="fa fa-check"></i>'});
                } else {
                    Notification.error({message: cargos.data, title: '<i class="fa fa-ban"></i>'});
                }
                $uibModalInstance.close(reload);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();