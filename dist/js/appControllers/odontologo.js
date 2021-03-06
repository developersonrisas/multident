"use strict";
(function () {
    angular.module('adminLTEApp.odontologo', [])
            .controller('listOdontologoCtrl', listOdontologoCtrl)
            .controller('newOdontologoCtrl', newOdontologoCtrl)
            .controller('editOdontologoCtrl', editOdontologoCtrl)
            .controller('modalOdontologoCtrl', modalOdontologoInstanceCtrl)
            .controller('modalOdontologoEyeInstanceCtrl', modalOdontologoEyeInstanceCtrl);

    listOdontologoCtrl.$inject = ['$scope', '$state', 'odontologoService', 'GridExternal', 'uiGridConstants' ,'$uibModal', '$timeout', '$log' ];
    function listOdontologoCtrl($scope, $state, odontologoService, GridExternal, uiGridConstants, $uibModal, $timeout, $log ) {
        var vm = this;

        vm.filter = {};
        //vm.stateparent = $state.$current.parent.self.name;
        //vm.filter.tipoentidad = $state.$current.parent.self.name;
        $scope.$on('handleBroadcast', function () {
            vm.getPage();
        });

        $scope.btnToggleFiltering = function(){
            vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
            vm.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        };


        function loadodontologos() {
            var columnsDefs = [
                {name: 'Id', field: 'idOdontologol', width: '42'},
                {name: 'Apellidos', field: 'nombres', width: '200'},
                {name: 'Nombres', field: 'nombres', width: '200'},
                {name: 'Dirección', field: 'nombres', width: '200'},
                {name: 'Sede', field: 'nombres', width: '100'},
                {name: 'Teléfono', field: 'telefono', width: '80'},
                {name: 'Celular', field: 'telefono', width: '80'},
                {name: 'Correo electrónico', field: 'email', width: '180'}
            ];

            GridExternal.getGrid(vm, columnsDefs, $scope, function () {
                odontologoService.GetIndex(vm.filter).then(function (odontologos) {

                    vm.gridOptions.totalItems = odontologos.total;
                    vm.gridOptions.data = odontologos.data;
                    $timeout(function () {
                        if (vm.gridApi.selection.selectRow) {
                            vm.gridApi.selection.selectRow(vm.gridOptions.data[0]);
                        }
                    });
                    GridExternal.setInfoPagina(vm, vm.gridApi.pagination, vm.gridOptions, odontologos.data.length);
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
                    loadodontologos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        loadodontologos();


    }

    newOdontologolCtrl.$inject = ['$scope', '$state', 'odontologoService', 'ubigeoService','GridInternoTurno', 'Notification'];
    function newOdontologolCtrl($scope, $state, odontologoService, ubigeoService, GridInternoTurno, Notification) {
        var vm = this;

        vm.stateparent = $state.$current.parent.self.name;
        vm.entidadespecialidad = [];
        vm.entidadsede = [];
        vm.entidadturno = [];
        vm.entidad = {};
        vm.edicion = false;

        vm.descripcion = '';
        switch (vm.stateparent) {
            case 'Odontologol':
                vm.descripcion = 'Registrarlo como Odontologol';
                vm.entidad.iddocumento = 1;
                vm.requiredNombre = true;
                break;
            case 'cliente':
                vm.descripcion = 'Registrarlo como Odontologo';
                vm.entidad.iddocumento = 1;
                vm.requiredNombre = true;
                break;
            case 'medico':
                vm.descripcion = 'Registrarlo como médico';
                vm.entidad.iddocumento = 1;
                vm.requiredNombre = true;
                break;
            case 'proveedor':
                vm.descripcion = 'Registrarlo como proveedor';
                vm.entidad.iddocumento = 2;
                vm.requiredNombre = false;
                break;
            default:
        }

        vm.iddocumentoChange = function () {
            if (vm.entidad.iddocumento === 1 || vm.entidad.iddocumento === 3) {
                vm.requiredNombre = true;
                vm.entidad.razonsocial = '';
            }
            if (vm.entidad.iddocumento === 2) {
                vm.requiredNombre = false;
                vm.entidad.apellidopat = '';
                vm.entidad.apellidomat = '';
                vm.entidad.nombre = '';
            }
        };

        vm.validacionDocumento = {};
        vm.getDocumento = function () {
            if ($scope.miForm.numerodoc.$valid) {
                entidadService.GetNumero({numerodoc: vm.entidad.numerodoc, tipoentidad: vm.stateparent}).then(function (entidades) {
                    vm.validacionDocumento = entidades.data;
                });
            }
        };

        vm.getDocumentoChange = function () {
            if ($scope.miForm.numerodoc.$error) {
                vm.validacionDocumento = {};
            }
        };

        vm.registrarSubEntidad = function () {
            entidadService.UpdateEntidad({identidad: vm.validacionDocumento.idEntidad, tipoentidad: vm.stateparent}).then(function (entidades) {

                if (entidades.type === 'success') {
                    Notification.primary({message: entidades.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list'); //estado hermano
                } else {
                    Notification.error({message: entidades.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });
        };

        vm.changeUbigeo = function (ubigeo, to) {
            if (ubigeo.pais === '' || ubigeo.dpto === '' || ubigeo.prov === '') {
                vm.others[to] = [];
                return false;
            }
            if (to === 'departamentos') {
                vm.entidad.dpto = ''; //Por default '- Provincia -'
                vm.others.provincias = []; //Limpiar distritos
            }
            if (to === 'provincias') {
                vm.entidad.prov = ''; //Por default '- Provincia -'
                vm.others.distritos = []; //Limpiar distritos
            }
            if (to === 'distritos') {
                vm.entidad.dist = ''; //Por default '- Distrito -' 
            }
            ubigeoService.GetIndex(ubigeo).then(function (result) {
                vm.others[to] = result.data;
            });
        };

        GridInternoTurno.getGrid(vm, $scope);

        entidadService.GetNew({tipoentidad: vm.stateparent}).then(function (entidades) {
            vm.others = entidades.others;
            //Inicializar con España
            vm.entidad.pais = 'ES';
            vm.changeUbigeo({pais: vm.entidad.pais || ''}, 'departamentos');
        });

        vm.agregarHorarioItem = function () { 
            if( !angular.isObject(vm.entidadturno.iddia) ){ 
              Notification.error({message: 'Falta Información del Dia' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false; 
            }
            if( !angular.isUndefined(vm.entidadturno.idhoraini1) && angular.isUndefined(vm.entidadturno.idhorafin1)){
              Notification.error({message: 'Falta Información de la hora de final de la mañana' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini1) && !angular.isUndefined(vm.entidadturno.idhorafin1)){
              Notification.error({message: 'Falta Información de la hora de inicio de la mañana' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( (vm.entidadturno.idhoraini1.idhora > vm.entidadturno.idhorafin1.idhora) || ( vm.entidadturno.idhoraini2.idhora > vm.entidadturno.idhorafin2.idhora)) {
              Notification.error({message: 'La hora de inicio no puede ser mayor a la hora final' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( !angular.isUndefined(vm.entidadturno.idhoraini2) && angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de final de la tarde' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini2) && !angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de inicio de la tarde' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini1) && angular.isUndefined(vm.entidadturno.idhorafin1) && angular.isUndefined(vm.entidadturno.idhoraini2) && angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de los turnos' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            $('#temporalHorario').focus();
            angular.forEach(vm.entidadturno.iddia,function (value,key) {
              vm.arrTemporal = { 
                'iddia' : value.iddia,
                'nombre_dia' : value.nombre_dia,
                'idhoraini1' : vm.entidadturno.idhoraini1 == undefined ? null : vm.entidadturno.idhoraini1.idhora,
                'idhorafin1' : vm.entidadturno.idhorafin1 == undefined ? null : vm.entidadturno.idhorafin1.idhora,
                'nombre_horaini1' : $("#horainicio1 :selected").text(),
                'nombre_horafin1' :  $("#horafinal1 :selected").text(),
                'idhoraini2' :  vm.entidadturno.idhoraini2 == undefined ? null : vm.entidadturno.idhoraini2.idhora,
                'idhorafin2' : vm.entidadturno.idhorafin2 == undefined ? null : vm.entidadturno.idhorafin2.idhora,
                'nombre_horaini2' : $("#horainicio2 :selected").text(),
                'nombre_horafin2' :  $("#horafinal2 :selected").text()
              }; 
              angular.forEach(vm.miTurno.data, function(valueDet, keyDet) { 
                if( value.iddia == valueDet.iddia ){ 
                  if (keyDet > -1) {
                    vm.miTurno.data.splice(keyDet, 1);
                  }
                }
              });
              vm.miTurno.data.push(vm.arrTemporal);
            });
            //console.log(vm.miTurno.data);
            vm.entidadturno = {};
        }

        vm.save = function () {

            var entidadturno =[];
            var fec = new Date();

            vm.miTurno.data.forEach(function (row) {
                if (typeof row.iddia !== 'undefined') {
                    entidadturno.push({identidad: vm.entidad.identidad,iddia: row.iddia,idhoraini1: row.idhoraini1,idhorafin1: row.idhorafin1,idhoraini2: row.idhoraini2, idhorafin2: row.idhorafin2,fecha_creacion: fec,fecha_modificacion: fec, activo:1});
                }
            });

            vm.OBJentidad = {
                entidad: vm.entidad,
                medico: vm.medico,
                entidadespecialidad: vm.entidadespecialidad,
                entidadsede: vm.entidadsede,
                entidadturno: entidadturno,
                tipoentidad: vm.stateparent// Tablas: cliente, proveedor, medico, Odontologol 
            };

            entidadService.Create(vm.OBJentidad).then(function (entidades) {
                if (entidades.type === 'success') {
                    Notification.primary({message: entidades.data, title: '<i class="fa fa-check"></i>'});
                    $scope.$emit('handleBroadcast');
                    $state.go('^.list');
                } else {
                    Notification.error({message: entidades.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });
        };
    }

    editOdontologolCtrl.$inject = ['$scope', '$state', 'odontologoService', 'ubigeoService', 'contactoService', 'GridInternoTurno', '$stateParams', 'GridExternal', 'Notification', '$uibModal', '$log'];
    function editOdontologolCtrl($scope, $state, odontologoService, ubigeoService, contactoService, GridInternoTurno ,$stateParams, GridExternal, Notification, $uibModal, $log) {
        var vm = this;

        var before = {};
        var after = {};
        var fields = ['numerodoc', 'apellidopat', 'apellidomat', 'nombre', 'telefono', 'celular', 'email', 'idcargoorg', 'fechanacimiento', 'razonsocial', 'direccion'];

        vm.stateparent = $state.$current.parent.self.name;
        vm.entidadespecialidad = [];
        vm.entidadsede = [];
        vm.entidadturno = [];
        vm.entidad = {};
        vm.edicion = true;

        vm.iddocumentoChange = function () {
            if (vm.entidad.iddocumento === 1 || vm.entidad.iddocumento === 3) {
                vm.requiredNombre = true;
            }
            if (vm.entidad.iddocumento === 2) {
                vm.requiredNombre = false;
            }
        };

        vm.changeUbigeo = function (ubigeo, to) {
            if (ubigeo.pais === '' || ubigeo.dpto === '' || ubigeo.prov === '') {
                vm.others[to] = [];
                return false;
            }
            if (to === 'departamentos') {
                vm.entidad.dpto = ''; //Por default '- Provincia -'
                vm.others.provincias = []; //Limpiar distritos
            }
            if (to === 'provincias') {
                vm.entidad.prov = ''; //Por default '- Provincia -'
                vm.others.distritos = []; //Limpiar distritos
            }
            if (to === 'distritos') {
                vm.entidad.dist = ''; //Por default '- Distrito -' 
            }
            ubigeoService.GetIndex(ubigeo).then(function (result) {
                vm.others[to] = result.data;
            });
        };

        GridInternoTurno.getGrid(vm, $scope);

        entidadService.GetShow($stateParams.entidadId, {tipoentidad: vm.stateparent}).then(function (entidades) {

            var entidadespecialidad = [];
            angular.forEach(entidades.others.entidadespecialidad, function (value, key) {
                this.push({idespecialidad: value.idespecialidad, nombre: value.nombre});
            }, entidadespecialidad);

            var entidadsede = [];
            angular.forEach(entidades.others.entidadsede, function (value, key) {
                this.push({idsede: value.idsede, nombre: value.nombre});
            }, entidadsede);

            vm.entidad = entidades.data;
            vm.others = entidades.others;
            vm.cliente = entidades.others.clientes;
            vm.Odontologol = entidades.others.Odontologoles;
            vm.proveedor = entidades.others.proveedores;
            vm.medico = entidades.others.medicos;
            /*vm.entidadturno = entidadturno;*/
            vm.entidadespecialidad = entidadespecialidad;
            vm.entidadsede = entidadsede;
            before = angular.copy(vm.entidad);
            vm.iddocumentoChange();

            GridInternoTurno.setData(vm, entidades.others.entidadturno);
            //Inicializar con España            
            if (typeof vm.entidad.pais === 'undefined') {
                vm.entidad.pais = 'ES';
                vm.changeUbigeo({pais: vm.entidad.pais || ''}, 'departamentos');
            }
        });

        vm.agregarHorarioItem = function () { 
            if( !angular.isObject(vm.entidadturno.iddia) ){ 
              Notification.error({message: 'Falta Información del Dia' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false; 
            }
            if( !angular.isUndefined(vm.entidadturno.idhoraini1) && angular.isUndefined(vm.entidadturno.idhorafin1)){
              Notification.error({message: 'Falta Información de la hora de final de la mañana' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini1) && !angular.isUndefined(vm.entidadturno.idhorafin1)){
              Notification.error({message: 'Falta Información de la hora de inicio de la mañana' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( (vm.entidadturno.idhoraini1.idhora > vm.entidadturno.idhorafin1.idhora) || ( vm.entidadturno.idhoraini2.idhora > vm.entidadturno.idhorafin2.idhora)) {
              Notification.error({message: 'La hora de inicio no puede ser mayor a la hora final' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( !angular.isUndefined(vm.entidadturno.idhoraini2) && angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de final de la tarde' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini2) && !angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de inicio de la tarde' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            if( angular.isUndefined(vm.entidadturno.idhoraini1) && angular.isUndefined(vm.entidadturno.idhorafin1) && angular.isUndefined(vm.entidadturno.idhoraini2) && angular.isUndefined(vm.entidadturno.idhorafin2)){
              Notification.error({message: 'Falta Información de la hora de los turnos' , title: '<i class="fa fa-warning"></i> Error' , delay : 2500}); 
              return false;
            }

            $('#temporalHorario').focus();
            angular.forEach(vm.entidadturno.iddia,function (value,key) {
              vm.arrTemporal = { 
                'iddia' : value.iddia,
                'nombre_dia' : value.nombre_dia,
                'idhoraini1' : vm.entidadturno.idhoraini1 == undefined ? null : vm.entidadturno.idhoraini1.idhora,
                'idhorafin1' : vm.entidadturno.idhorafin1 == undefined ? null : vm.entidadturno.idhorafin1.idhora,
                'nombre_horaini1' : $("#horainicio1 :selected").text(),
                'nombre_horafin1' :  $("#horafinal1 :selected").text(),
                'idhoraini2' :  vm.entidadturno.idhoraini2 == undefined ? null : vm.entidadturno.idhoraini2.idhora,
                'idhorafin2' : vm.entidadturno.idhorafin2 == undefined ? null : vm.entidadturno.idhorafin2.idhora,
                'nombre_horaini2' : $("#horainicio2 :selected").text(),
                'nombre_horafin2' :  $("#horafinal2 :selected").text()
              }; 
              angular.forEach(vm.miTurno.data, function(valueDet, keyDet) { 
                if( value.iddia == valueDet.iddia ){ 
                  if (keyDet > -1) {
                    vm.miTurno.data.splice(keyDet, 1);
                  }
                }
              });
              vm.miTurno.data.push(vm.arrTemporal);
            });
            //console.log(vm.miTurno.data);
            vm.entidadturno = {};
        }

        vm.save = function () {

            var entidadturno =[];
            var fec = new Date();

            vm.miTurno.data.forEach(function (row) {
                if (typeof row.iddia !== 'undefined') {
                    entidadturno.push({identidad: vm.entidad.identidad,iddia: row.iddia,idhoraini1: row.idhoraini1,idhorafin1: row.idhorafin1,idhoraini2: row.idhoraini2, idhorafin2: row.idhorafin2,fecha_creacion: fec,fecha_modificacion: fec, activo:1});
                }
            });

            vm.OBJentidad = {
                entidad: vm.entidad,
                cliente: vm.cliente,
                Odontologol: vm.Odontologol,
                proveedor: vm.proveedor,
                medico: vm.medico,
                entidadespecialidad: vm.entidadespecialidad,
                entidadsede: vm.entidadsede,
                entidadturno: entidadturno,
                tipoentidad: vm.stateparent// Tablas: cliente, proveedor, medico, Odontologol 
            };

            after = angular.copy(vm.entidad);
            entidadService.Update(vm.OBJentidad).then(function (entidades) {

                if (entidades.type === 'success') {
                    Notification.primary({message: entidades.data, title: '<i class="fa fa-check"></i>'});
                    vm.brodcast();
                    $state.go('^.list');
                } else {
                    Notification.error({message: entidades.data, title: '<i class="fa fa-ban"></i>'});
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

        function loadContactos() {
            contactoService.GetIndex({identidad: $stateParams.entidadId}).then(function (contactos) {
                vm.others.contactos = contactos.data;
            });
        }

        vm.openModal = function (accion, data) {

            data.identidad = $stateParams.entidadId;

            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContacto.html',
                controller: 'modalContactoInstanceCtrl',
                windowClass: 'modal-primary',
                size: 'sm',
                resolve: {
                    modalParam: function () {
                        return {
                            accion: accion,
                            data: angular.copy(data)
                        };
                    }
                }
            });

            modalInstance.result.then(function (reload) {
                if (reload)
                    loadContactos();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }

    modalOdontologolInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'entidadService', 'Notification'];
    function modalOdontologolInstanceCtrl($scope, $uibModalInstance, modalParam, entidadService, Notification) {

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


    modalOdontologolEyeInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'odontologoService', '$state'];
    function modalOdontologolEyeInstanceCtrl($scope, $uibModalInstance, modalParam, odontologoService, $state) {

        var vm = this;
        vm.stateparent = $state.$current.parent.self.name;

        vm.titulo = '';
        switch (vm.stateparent) {
            case 'Odontologol':
                vm.titulo = 'Odontologol';
                break;
            case 'cliente':
                vm.titulo = 'Odontologo';
                break;
            case 'medico':
                vm.titulo = 'Médico';
                break;
            case 'proveedor':
                vm.titulo = 'Proveedor';
                break;
            default:
        }

        odontologoService.GetProfile(modalParam.data).then(function (entidades) {
            vm.entidad = entidades.data;
            vm.others = entidades.others;
            vm.cliente = entidades.others.clientes;
            vm.Odontologol = entidades.others.Odontologoles;
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