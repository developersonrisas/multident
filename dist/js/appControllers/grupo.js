"use strict";
(function () {
    angular.module('adminLTEApp.grupo', [])
            .controller('listGrupoCtrl', listGrupoCtrl)
            .controller('newGrupoCtrl', newGrupoCtrl)
            .controller('editGrupoCtrl', editGrupoCtrl)
            .controller('modalGrupoInstanceCtrl', modalGrupoInstanceCtrl)
            .controller('modalGrupoModuloInstanceCtrl', modalGrupoModuloInstanceCtrl)
            .factory('GridNoAgregados', GridNoAgregados)
            .factory('GridAgregados', GridAgregados);


    function GridNoAgregados() {

        var service = {};
        service.getGrid = getGrid;
        service.setData = setData;

        function setData(vm, data) {
            vm.miBoleta.data = data;
            if (data.length <= 10) {
                vm.addRow(10 - data.length);
            }
        }

        function getGrid(vm, columnsDefs, $scope, funct) {

            var paginationOptions = {
                currentPage: 1,
                pageSize: 25,
                sort: null
            };

            vm.order = {};
            vm.gridRoles = {
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                multiSelect: false,
                //noUnselect: true,
                enableRowSelection: false,
                enableSelectAll: true,
                enableFullRowSelection: true, 
                enableColumnMenus: false,
                useExternalSorting: true,
                columnDefs: columnsDefs,
                enableColumnResizing: true,
                //enablePaginationControls: false,
                onRegisterApi: function (gridApi) {
                    vm.gridApi = gridApi;
                    vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length === 0) {
                            vm.order = {};
                        } else {
                            vm.order.name = sortColumns[0].field;
                            vm.order.sort = sortColumns[0].sort.direction;
                        }
                        vm.getPage();
                    });

                    vm.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        vm.filaSelecciona = vm.gridApi.selection.getSelectedRows();
                    });
                    vm.gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                        vm.filaSelecciona = vm.gridApi.selection.getSelectedRows();
                    });
                }
            };
            
            vm.filaSelecciona = [];
            vm.gridRoles.appScopeProvider = vm; 
            vm.getPage = function () {
                vm.filter['pageSize'] = vm.gridRoles.paginationPageSize;
                vm.filter['page'] = paginationOptions.currentPage;
                vm.filter['orderName'] = vm.order.name;
                vm.filter['orderSort'] = vm.order.sort;
                funct();
            };
            vm.getPage();
        }

        return service;
    };

    // ---------------------
    function GridAgregados() {

        var service = {};
        service.getGrid = getGrid;
        service.setData = setData;

        function setData(vm, data) {
            vm.miBoleta.data = data;
            if (data.length <= 10) {
                vm.addRow(10 - data.length);
            }
        }

        function getGrid(vm, columnsDefs, $scope, funct) {

            var paginationOptions = {
                currentPage: 1,
                pageSize: 25,
                sort: null
            };

            vm.order = {};
            vm.gridRolesAdd = {
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                multiSelect: false,
                //noUnselect: true,
                enableRowSelection: false,
                enableSelectAll: true,
                enableFullRowSelection: true, 
                enableColumnMenus: false,
                useExternalSorting: true,
                columnDefs: columnsDefs,
                enableColumnResizing: true,
                //enablePaginationControls: false,
                onRegisterApi: function (gridApi) {
                    vm.gridApi = gridApi;
                    vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length === 0) {
                            vm.order = {};
                        } else {
                            vm.order.name = sortColumns[0].field;
                            vm.order.sort = sortColumns[0].sort.direction;
                        }
                        vm.getPage();
                    });

                    vm.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        vm.filaSelecciona = vm.gridApi.selection.getSelectedRows();
                    });
                    vm.gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                        vm.filaSelecciona = vm.gridApi.selection.getSelectedRows();
                    });
                }
            };
            
            vm.filaSelecciona = [];
            vm.gridRolesAdd.appScopeProvider = vm; 
            vm.getPage = function () {
                vm.filter['pageSize'] = vm.gridRolesAdd.paginationPageSize;
                vm.filter['page'] = paginationOptions.currentPage;
                vm.filter['orderName'] = vm.order.name;
                vm.filter['orderSort'] = vm.order.sort;
                funct();
            };
            vm.getPage();
        }

        return service;
    };





    listGrupoCtrl.$inject = ['$scope', '$state', 'grupoService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log'];
    function listGrupoCtrl($scope, $state, grupoService, GridExternal, uiGridConstants, $uibModal, $timeout, $log) {
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

        function loadGrupos() {
            var columnsDefs = [
                {name: 'Id', field: 'idgrupo', width: '60'},
                {name: 'Nombre', field: 'nombre_grupo', width: '300'},
                {name: 'Descripcion', field: 'descripcion', maxwidth: '200'},
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                grupoService.GetIndex(vm.filter).then(function (grupos) {
                    console.log(grupos);
                    vm.gridOptions.totalItems = grupos.total;
                    vm.gridOptions.data = grupos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, grupos.data.length);
                });
            });
        }

        vm.openModal = function (accion, data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalGrupoInstanceCtrl',
                windowClass: 'modal-primary',
                scope : $scope,
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
                    loadGrupos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.btnAgregarRol = function (data) {

            var modalInstance = $uibModal.open({
                templateUrl: 'views/modulos/modal-roles-grupo.html',
                controller: 'modalGrupoModuloInstanceCtrl as vm',
                windowClass: 'modal-default',
                size: 'xl',
                resolve: {
                    modalParam: function () {
                        return {
                            data: data
                        };
                    }
                }
            });

            modalInstance.result.then(function (reload) {
                if (reload)
                    loadGrupos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        loadGrupos();

    }

    newGrupoCtrl.$inject = ['$scope', '$state', 'grupoService', 'Notification'];
    function newGrupoCtrl($scope, $state, grupoService, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.edicion = false;

        vm.descripcion = '';

        vm.save = function () {
            vm.OBJgrupo = {
                grupo: vm.grupo,

            };

            grupoService.Create(vm.OBJgrupo).then(function (grupos) {
                if (grupos.type === 'success') {
                    Notification.primary({message: grupos.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: grupos.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };
    }

    editGrupoCtrl.$inject = ['$scope', '$state', 'grupoService', '$stateParams', 'Notification', '$uibModal', '$log'];
    function editGrupoCtrl($scope, $state, grupoService ,$stateParams, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['nombre_grupo', 'descripcion'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.grupo = {};
        vm.edicion = true;

        grupoService.GetShow($stateParams.grupoId).then(function (grupos) {
            vm.grupo = grupos.data;
            before = angular.copy(vm.grupo);
        });

        vm.save = function () {
            vm.OBJgrupo = {
                grupo: vm.grupo,
            };

            after = angular.copy(vm.grupo);
            grupoService.Update(vm.OBJgrupo).then(function (grupos) {

                if (grupos.type === 'success') {
                    Notification.primary({message: grupos.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: grupos.data, title: '<i class="fa fa-ban"></i>'});
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

    modalGrupoInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'grupoService', 'Notification'];
    function modalGrupoInstanceCtrl($scope, $uibModalInstance, modalParam, grupoService, Notification) {

        $scope.grupo = {};
        $scope.grupo = {
            idgrupo: modalParam.data.idgrupo,
            nombre_grupo: modalParam.data.nombre_grupo
        };

        $scope.save = function () {
            grupoService.Delete($scope.grupo.idgrupo).then(function (modulos) {
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

    modalGrupoModuloInstanceCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'modalParam', 'grupoService', 'rolService', 'grupoRolService', 'GridNoAgregados', 'GridAgregados', 'Notification', '$timeout', '$log'];
    function modalGrupoModuloInstanceCtrl($scope, $state, $uibModalInstance, modalParam, grupoService, rolService, grupoRolService, GridNoAgregados, GridAgregados, Notification, $timeout, $log) {
        var vm = this;
        var rolesAdd ={};
        vm.rol = {};

        $scope.grupo = {};
        $scope.grupo = {
            idgrupo: modalParam.data.idgrupo,
            nombre_grupo: modalParam.data.nombre_grupo
        };     


        vm.filter = {};
        vm.stateparent = $state.$current.parent.self.name;

        rolService.GetNew().then(function (roles) {
            angular.copy(roles, rolesAdd);
            vm.listaModulos = roles.others.modulos;
            vm.rol.idmodulo = vm.listaModulos[0].idmodulo;

            vm.listaModulosAdd = rolesAdd.others.modulos;
            vm.listaModulosAdd.splice(0,0,{ idmodulo : '0', nombre_modulo:'-- Todos --'});
            vm.rol.idmoduloAdd = vm.listaModulosAdd[0].idmodulo;

        });

        // PARA LA PRIMERA GRILLA
        vm.loadRolesNoAgregados = function(idmodulo) {
            $scope.datosGrid = {
                idgrupo: modalParam.data.idgrupo,
                idmodulo : idmodulo
            };
            //var accion = '<button type="button" class="btn btn-primary btn-xs" ng-click="grid.appScope.btnAgregarRolesAGrupo();"> Asignar</button>';
            var columnsDefs = [
                {name: 'Item', field: 'idrol', width: '60'},
                {name: 'Icono', field: 'icono', width: '60', cellTemplate:'<div class="text-center"><i style="font-size:18px;margin-top: 7px;" class="{{ COL_FIELD }} " ></i></div>'},
                {name: 'Nombre', field: 'nombre_rol', width: '150'},
                {name: 'Accion', field: 'idrol', maxwidth: '100', cellClass: 'text-center', cellTemplate: '<a class="btn btn-primary btn-xs" ng-click="grid.appScope.btnAgregarRolesAGrupo(COL_FIELD);">Seleccionar</a>'}
            ];

            GridNoAgregados.getGrid(vm, columnsDefs, $scope, function () {
                grupoService.RolesNoAgregados($scope.datosGrid).then(function (grupos) {
                    vm.gridRoles.totalItems = grupos.total;
                    vm.gridRoles.data = grupos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridRoles.data[0]);
                        }
                    });
                });
            });
        }

        vm.loadRolesNoAgregados(1);
        // -------------------------------

        // SEGUNDA GRILLA
        vm.loadRolesAgregados = function(idmodulo) {
            $scope.datosGrid = {
                idgrupo: modalParam.data.idgrupo,
                idmodulo : idmodulo
            };
            var columnsDefs = [
                {name: 'Item', field: 'idrol', width: '60'},
                {name: 'Icono', field: 'icono', width: '60', cellTemplate:'<div class="text-center"><i style="font-size:18px;margin-top: 7px;" class="{{ COL_FIELD }} " ></i></div>'},
                {name: 'Nombre', field: 'nombre_rol', width: '150'},
                {name: 'Accion', field: 'idgruporol', maxwidth: '100', cellClass: 'text-center', cellTemplate: '<a class="btn btn-danger btn-xs" ng-click="grid.appScope.btnEliminarRolGrupo(COL_FIELD);"><i class="fa fa-trash"></i></a>' },
            ];

            GridAgregados.getGrid(vm, columnsDefs, $scope, function () {
                grupoService.RolesAgregados($scope.datosGrid).then(function (grupos) {
                    //console.log(grupos.data);
                    vm.gridRolesAdd.totalItems = grupos.total;
                    vm.gridRolesAdd.data = grupos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridRoles.data[0]);
                        }
                    });
                });
            });
        }

        vm.loadRolesAgregados(0);

        // -------------------------------
        // para agregar un rol al grupo
        vm.btnAgregarRolesAGrupo = function(rolID){            
            vm.OBJrolgrupo = {
                idgrupo: modalParam.data.idgrupo,
                idrol : rolID
            };

            grupoRolService.Create(vm.OBJrolgrupo).then(function (gruposroles) {
                if (gruposroles.type === 'success') {
                    vm.loadRolesNoAgregados(vm.rol.idmodulo);
                    vm.loadRolesAgregados(vm.rol.idmoduloAdd);

                } else {
                    Notification.error({message: roles.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });
        };
        
        vm.btnEliminarRolGrupo = function(gruporolID){

            grupoRolService.Delete(gruporolID).then(function (gruposroles) {
                if (gruposroles.type === 'success') {
                    vm.loadRolesNoAgregados(vm.rol.idmodulo);
                    vm.loadRolesAgregados(vm.rol.idmoduloAdd);

                } else {
                    Notification.error({message: roles.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });

        };



        // -------------------------------
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    


    }



})();