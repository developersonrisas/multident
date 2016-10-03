"use strict";
(function () {
    angular.module('adminLTEApp.rol', [])
            .controller('listRolCtrl', listRolCtrl)
            .controller('newRolCtrl', newRolCtrl)
            .controller('editRolCtrl', editRolCtrl)
            .controller('modalRolCtrl', modalRolInstanceCtrl)
            .controller('modalRolEyeInstanceCtrl', modalRolEyeInstanceCtrl);


    listRolCtrl.$inject = ['$scope', '$state', 'rolService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log' ];
    function listRolCtrl($scope, $state, rolService, GridExternal, uiGridConstants, $uibModal, $timeout, $log ) {
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


        function loadRoles() {
            var columnsDefs = [
                {name: 'Id', field: 'idrol', width: '42'},
                {name: 'Icono', field: 'icono', width: '100',cellTemplate:'<div class="text-center"><i style="font-size:18px;margin-top: 7px;" class="{{ COL_FIELD }} " ></i></div>'},
                {name: 'Rol', field: 'nombre_rol', width: '200'},
                {name: 'SubRol', field: 'subrol', width: '200'},
                {name: 'Url', field: 'url_rol', width: '200'},
                {name: 'Modulo', field: 'modulo', maxwidth: '200'}
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                rolService.GetIndex(vm.filter).then(function (roles) {

                    vm.gridOptions.totalItems = roles.total;
                    vm.gridOptions.data = roles.data;

                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, roles.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var templateUrl = 'myModalContent.html';
            var controller = 'modalEntidadInstanceCtrl';
            var size = 'sm';

            if (accion === 'eye') {
                controller = 'modalEntidadEyeInstanceCtrl as vm';
                templateUrl = 'myModalEyeContent.html';
                size = 'lg';
            }

            var modalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                windowClass: 'modal-primary',
                size: size,
                resolve: {
                    modalParam: function () {
                        return {
                            accion: accion,
                            data: data,
                            stateparent: vm.stateparent
                        };
                    }
                }
            });

            modalInstance.result.then(function (reload) {
                if (reload)
                    loadEntidades();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        loadRoles();

    }

    newRolCtrl.$inject = ['$scope', '$state', 'rolService', 'Notification'];
    function newRolCtrl($scope, $state, rolService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        rolService.GetNew().then(function (roles) {
            vm.others = roles.others;
        });


        vm.save = function () {
            vm.OBJrol = {
                rol: vm.rol,

            };

            rolService.Create(vm.OBJrol).then(function (roles) {
                if (roles.type === 'success') {
                    Notification.primary({message: roles.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: roles.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editRolCtrl.$inject = ['$scope', '$state', 'rolService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editRolCtrl($scope, $state, rolService ,$stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_rol', 'url_rol', 'icono'];

        vm.stateparent = $state.$current.parent.self.name;
       // vm.rol = {};
        vm.edicion = true;

        rolService.GetShow($stateParams.rolId).then(function (roles) {
            vm.rol = roles.data;
            vm.others = roles.others;

            before = angular.copy(vm.rol);

        });

        vm.save = function () {
            vm.OBJrol = {
                rol: vm.rol,
            };

            after = angular.copy(vm.rol);
            rolService.Update(vm.OBJrol).then(function (roles) {

                if (roles.type === 'success') {
                    Notification.primary({message: roles.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: roles.data, title: '<i class="fa fa-ban"></i>'});
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

    modalRolInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'entidadService', 'Notification'];
    function modalRolInstanceCtrl($scope, $uibModalInstance, modalParam, entidadService, Notification) {

        $scope.entidad = {};
        $scope.entidad = {
            identidad: modalParam.data.identidad,
            entidad: modalParam.data.entidad
        };

        $scope.save = function () {
            entidadService.Delete($scope.entidad.identidad, {tipoentidad: modalParam.stateparent}).then(function (entidad) {
                var reload = false;
                if (entidad.type === 'success') {
                    reload = true;
                    Notification.primary({message: entidad.data, title: '<i class="fa fa-check"></i>'});
                } else {
                    Notification.error({message: entidad.data, title: '<i class="fa fa-ban"></i>'});
                }
                $uibModalInstance.close(reload);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


    modalRolEyeInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'rolService', '$state'];
    function modalRolEyeInstanceCtrl($scope, $uibModalInstance, modalParam, rolService, $state) {

        var vm = this;
        vm.stateparent = $state.$current.parent.self.name;

        vm.titulo = '';
        switch (vm.stateparent) {
            case 'Rol':
                vm.titulo = 'Rol';
                break;
            case 'cliente':
                vm.titulo = 'Paciente';
                break;
            case 'medico':
                vm.titulo = 'Médico';
                break;
            case 'proveedor':
                vm.titulo = 'Proveedor';
                break;
            default:
        }

        rolService.GetProfile(modalParam.data).then(function (entidades) {
            vm.entidad = entidades.data;
            vm.others = entidades.others;
            vm.cliente = entidades.others.clientes;
            vm.Rol = entidades.others.Roles;
            //vm.proveedor = entidades.others.proveedores;
            vm.medico = entidades.others.medicos;
            vm.entidadespecialidad = entidades.others.entidadespecialidad;
            vm.entidadsede = entidades.others.entidadsede;
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();