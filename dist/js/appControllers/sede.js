"use strict";
(function () {
    angular.module('adminLTEApp.sede', [])
            .controller('listSedeCtrl', listSedeCtrl)
            .controller('newSedeCtrl', newSedeCtrl)
            .controller('editSedeCtrl', editSedeCtrl)
            .controller('modalSedeInstanceCtrl', modalSedeInstanceCtrl);


    listSedeCtrl.$inject = ['$scope', '$state', 'sedeService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listSedeCtrl($scope, $state, sedeService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
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

        function loadSedes() {
            var columnsDefs = [
                {name: 'Id', field: 'idsede', width: '60'},
                {name: 'Nombre', field: 'nombre_sede', maxwidth: '300'},
                {name: 'Direccion', field: 'direccion', maxwidth: '300'},
                {name: 'Telefono', field: 'telefono', maxwidth: '300'},
                {name: 'Celular', field: 'celular', maxwidth: '300'},

            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                sedeService.GetIndex(vm.filter).then(function (sedes) {
                
                    vm.gridOptions.totalItems = sedes.total;
                    vm.gridOptions.data = sedes.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, sedes.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalSedeInstanceCtrl',
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
                    loadSedes();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        loadSedes();

    }

    newSedeCtrl.$inject = ['$scope', '$state', 'sedeService', 'Notification'];
    function newSedeCtrl($scope, $state, sedeService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.save = function () {
            vm.OBJsede = {
                sede: vm.sede,

            };

            sedeService.Create(vm.OBJsede).then(function (sedes) {
                if (sedes.type === 'success') {
                    Notification.primary({message: sedes.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: sedes.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editSedeCtrl.$inject = ['$scope', '$state', 'sedeService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editSedeCtrl($scope, $state, sedeService, $stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_sede','direccion','telefono','celular'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.producto = {};
        vm.edicion = true;


        sedeService.GetShow($stateParams.sedeId).then(function (sedes) {
            vm.sede = sedes.data;

            before = angular.copy(vm.sede);
        });


        vm.save = function () {
            vm.OBJsede = {
                sede: vm.sede,
            };

            after = angular.copy(vm.sede);
            sedeService.Update(vm.OBJsede).then(function (sedes) {

                if (sedes.type === 'success') {
                    Notification.primary({message: sedes.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: sedes.data, title: '<i class="fa fa-ban"></i>'});
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

    modalSedeInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'sedeService', 'Notification'];
    function modalSedeInstanceCtrl($scope, $uibModalInstance, modalParam, sedeService, Notification) {

        $scope.sede = {};
        $scope.sede = {
            idsede: modalParam.data.idsede,
            nombre_sede: modalParam.data.nombre_sede
        };

        $scope.save = function () {
            sedeService.Delete($scope.sede.idsede).then(function (sedes) {
                var reload = false;
                if (sedes.type === 'success') {
                    reload = true;
                    Notification.primary({message: sedes.data, title: '<i class="fa fa-check"></i>'});
                } else {
                    Notification.error({message: sedes.data, title: '<i class="fa fa-ban"></i>'});
                }
                $uibModalInstance.close(reload);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();