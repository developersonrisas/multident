"use strict";
(function () {
    angular.module('adminLTEApp.moneda', [])
            .controller('listMonedaCtrl', listMonedaCtrl)
            .controller('newMonedaCtrl', newMonedaCtrl)
            .controller('editMonedaCtrl', editMonedaCtrl)
            .controller('modalMonedaInstanceCtrl', modalMonedaInstanceCtrl);


    listMonedaCtrl.$inject = ['$scope', '$state', 'monedaService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listMonedaCtrl($scope, $state, monedaService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
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

        function loadMonedas() {
            var columnsDefs = [
                {name: 'Id', field: 'idmoneda', width: '60'},
                {name: 'Nombre', field: 'nombre_moneda', maxwidth: '300'},
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                monedaService.GetIndex(vm.filter).then(function (monedas) {
                
                    vm.gridOptions.totalItems = monedas.total;
                    vm.gridOptions.data = monedas.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, monedas.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalMonedaInstanceCtrl',
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
                    loadMonedas();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        loadMonedas();


    }

    newMonedaCtrl.$inject = ['$scope', '$state', 'monedaService', 'Notification'];
    function newMonedaCtrl($scope, $state, monedaService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        vm.save = function () {
            vm.OBJmoneda = {
                moneda: vm.moneda,

            };

            monedaService.Create(vm.OBJmoneda).then(function (monedas) {
                if (monedas.type === 'success') {
                    Notification.primary({message: monedas.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: monedas.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editMonedaCtrl.$inject = ['$scope', '$state', 'monedaService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editMonedaCtrl($scope, $state, monedaService, $stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_moneda'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.cargo = {};
        vm.edicion = true;


        monedaService.GetShow($stateParams.monedaId).then(function (monedas) {
            vm.moneda = monedas.data;

            before = angular.copy(vm.moneda);
        });


        vm.save = function () {
            vm.OBJmoneda = {
                moneda: vm.moneda,
            };

            after = angular.copy(vm.moneda);
            monedaService.Update(vm.OBJmoneda).then(function (monedas) {

                if (monedas.type === 'success') {
                    Notification.primary({message: monedas.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: monedas.data, title: '<i class="fa fa-ban"></i>'});
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

    modalMonedaInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'monedaService', 'Notification'];
    function modalMonedaInstanceCtrl($scope, $uibModalInstance, modalParam, monedaService, Notification) {

        $scope.moneda = {};
        $scope.moneda = {
            idmoneda: modalParam.data.idmoneda,
            nombre_moneda: modalParam.data.nombre_moneda
        };

        $scope.save = function () {
            monedaService.Delete($scope.moneda.idmoneda).then(function (monedas) {
                var reload = false;
                if (monedas.type === 'success') {
                    reload = true;
                    Notification.primary({message: monedas.data, title: '<i class="fa fa-check"></i>'});
                } else {
                    Notification.error({message: monedas.data, title: '<i class="fa fa-ban"></i>'});
                }
                $uibModalInstance.close(reload);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();