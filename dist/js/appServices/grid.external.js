(function () {
    'use strict';
    angular
            .module('adminLTE')
            .factory('GridExternal', GridExternal);

    function GridExternal() {
        
        var service = {};
        service.getGrid = getGrid;
        service.setInfoPagina = setInfoPagina;

        return service;

        function setInfoPagina(vm, pagination, gridOptions, length) {
            vm.gridOptions.desde = ((pagination.getPage() - 1) * gridOptions.paginationPageSize) + 1;
            vm.gridOptions.hasta = ((pagination.getPage() - 1) * gridOptions.paginationPageSize) + length;
            vm.gridOptions.firstdisabled = (pagination.getPage() === 1) ? true : false;
            vm.gridOptions.lastdisabled = (pagination.getPage() === pagination.getTotalPages()) ? true : false;            
        }

        function getGrid(vm, columnsDefs, $scope, funct) {

            var paginationOptions = {
                currentPage: 1,
                pageSize: 25,
                sort: null
            };

            vm.order = {};
            vm.gridOptions = {
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                multiSelect: false,
                //noUnselect: true,
                enableRowSelection: false,
                enableSelectAll: true,
                enableFullRowSelection: true, 
                enableColumnMenus: false,
                paginationPageSizes: [25, 50, 75],
                paginationPageSize: 25,
                paginationCurrentPage: paginationOptions.currentPage,
                useExternalPagination: true,
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
                    vm.gridApi.pagination.on.paginationChanged($scope, function (currentPage, pageSize) {
                        paginationOptions.currentPage = currentPage;
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
            vm.gridOptions.appScopeProvider = vm; 
            vm.getPage = function () {
                vm.filter['pageSize'] = vm.gridOptions.paginationPageSize;
                vm.filter['page'] = paginationOptions.currentPage;
                vm.filter['orderName'] = vm.order.name;
                vm.filter['orderSort'] = vm.order.sort;
                funct();
            };
            vm.getPage();
        }
        ;

    }

})();
