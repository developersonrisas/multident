'use strict';
(function () {
    angular.module('adminLTEController', [])
            .controller('adminLTECtrl', adminLTECtrl)
            .controller('modalPaswordInstanceCtrl', modalPaswordInstanceCtrl)
            .controller('LineCtrl', LineCtrl)
            .controller('BarCtrl',BarCtrl)
            .controller('DoughnutCtrl',DoughnutCtrl)
            .controller('PieCtrl',PieCtrl)
            .controller('PolarAreaCtrl',PolarAreaCtrl)
            .controller('BaseCtrl',BaseCtrl)
            .controller('RadarCtrl',RadarCtrl)
            .controller('StackedBarCtrl',StackedBarCtrl)
            .controller('DataTablesCtrl',DataTablesCtrl)
            .controller('FlotInteractive',FlotInteractive)
            .controller('FlotLineChart',FlotLineChart)
            .controller('FlotAreaChart',FlotAreaChart)
            .controller('FlotBarChart',FlotBarChart)
            .controller('FlotDonutChart',FlotDonutChart)
            .controller('ChatController',ChatController);

    adminLTECtrl.$inject = ['$http', '$scope', '$uibModal', 'personalService', 'AuthenticationService', '$location', '$log', '$state', '$rootScope', '$cookies'];
    function adminLTECtrl($http, $scope, $uibModal, personalService, AuthenticationService, $location, $log, $state, $rootScope, $cookies) {
        $scope.logout = logout;
        $scope.loadModulosAuth = loadModulosAuth;

        $scope.searchAPI = function (inputString) {
            return personalService.GetSearch({likeentidad: inputString});
        };

        $scope.selectedObject = function (selected) {
            if (selected) {
                $state.go("dashboard", {'perfilId': selected.originalObject.identidad});
            }
        };

        function logout() {
            AuthenticationService.ClearCredentials();
            $location.path('/sign-in');
        }

        $scope.abrirModal = function (data) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalPasswordContent.html',
                controller: 'modalPaswordInstanceCtrl',
                windowClass: 'modal-primary',
                size: 'sm',
                resolve: {
                    modalParam: function () {
                        return {
                            data: data
                        };
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.supportIE = function () {
            // IE mode
            var isIE8 = false;
            var isIE9 = false;
            var isIE10 = false;

            // initializes main settings for IE
            isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
            isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
            isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

            if (isIE10) {
                $('html').addClass('ie10'); // detect IE10 version
            }

            if (isIE10 || isIE9 || isIE8) {
                $('html').addClass('ie'); // detect IE8, IE9, IE10 version
            }

            // Fix input placeholder issue for IE8 and IE9
            if (isIE8 || isIE9) { // ie8 & ie9
                // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
                $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
                    var input = $(this);

                    if (input.val() == '' && input.attr("placeholder") != '') {
                        input.addClass("placeholder").val(input.attr('placeholder'));
                    }

                    input.focus(function () {
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                        }
                    });

                    input.blur(function () {
                        if (input.val() == '' || input.val() == input.attr('placeholder')) {
                            input.val(input.attr('placeholder'));
                        }
                    });
                });
            }
        };
        $scope.tooltip = function () {
            if ($('[data-toggle=tooltip]').length) {
                $('[data-toggle=tooltip]').tooltip({
                    animation: 'fade'
                });
            }
        };
        $scope.popover = function () {
            if ($('[data-toggle=popover]').length) {
                $('[data-toggle=popover]').popover();
            }
        };
        // Log view event module loaded
        $scope.$on('ocLazyLoad.moduleLoaded', function (e, params) {
            console.log('event module loaded', params);
        });
        // Log view event component loaded
        $scope.$on('ocLazyLoad.componentLoaded', function (e, params) {
            console.log('event component loaded', params);
        });
        // Log view event file loaded
        $scope.$on('ocLazyLoad.fileLoaded', function (e, file) {
            console.log('event file loaded', file);
        });

        $scope.supportIE(); // Call cookie sidebar minimize 
        $scope.tooltip(); // Call tooltip
        $scope.popover(); // Call popover     

        function loadModulosAuth() {
            if (AuthenticationService.authenticate()) {
                
                $http.defaults.headers.common['AuthorizationToken'] = $cookies.get('token');
                entidadService.GetModulos().then(function (response) {
                    var modulos = response.data.userModules;
                    $rootScope.empresa = response.data.empresa;
                    $rootScope.modules = (typeof modulos[$rootScope.urlente] === 'undefined') ? [] : modulos[$rootScope.urlente].modules;
                    $rootScope.entidad = response.data.userProfiles.empresas[$rootScope.urlente];
                });
            }
        }
        
        //loadModulosAuth();
        
    };


    modalPaswordInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalParam', 'entidadService', 'Notification'];
    function modalPaswordInstanceCtrl($scope, $uibModalInstance, modalParam, entidadService, Notification) {

        $scope.entidad = {};
        $scope.entidad.identidad = modalParam.data;
        $scope.entidad.contrasenanueva = '';
        $scope.entidad.contrasenaconfirm = '';
        $scope.confirm = false;

        $scope.save = function () {
            if ($scope.entidad.contrasenanueva !== $scope.entidad.contrasenaconfirm) {
                $scope.miForm.$submitted = false;
                $scope.confirm = true;
                return false;
            }

            entidadService.UpdatePassword($scope.entidad).then(function (entidad) {
                if (entidad.type === 'success') {
                    Notification.primary({message: entidad.data, title: '<i class="fa fa-check"></i>'});
                    $uibModalInstance.close();
                } else {
                    Notification.error({message: entidad.data, title: '<i class="fa fa-ban"></i>'});
                    $scope.miForm.$submitted = false;
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


  LineCtrl.$inject = ['$scope', '$timeout'];
  function LineCtrl($scope, $timeout) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.onHover = function (points) {
      if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      }
    };

    $timeout(function () {
      $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      $scope.data = [
        [28, 48, 40, 19, 86, 27, 90],
        [65, 59, 80, 81, 56, 55, 40]
      ];
      $scope.series = ['Series C', 'Series D'];
    }, 3000);
  }


  BarCtrl.$inject = ['$scope', '$timeout'];
  function BarCtrl($scope, $timeout) {
    $scope.options = { scaleShowVerticalLines: false };
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $timeout(function () {
      $scope.options = { scaleShowVerticalLines: true };
    }, 3000);
  }

  DoughnutCtrl.$inject = ['$scope', '$timeout'];
  function DoughnutCtrl($scope, $timeout) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    $scope.data = [0, 0, 0];

    $timeout(function () {
      $scope.data = [350, 450, 100];
    }, 500);
  }

  
  PieCtrl.$inject = ['$scope'];
  function PieCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    $scope.data = [300, 500, 100];
  }

  PolarAreaCtrl.$inject = ['$scope'];
  function PolarAreaCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    $scope.data = [300, 500, 100, 40, 120];
  }

  BaseCtrl.$inject = ['$scope'];
  function BaseCtrl($scope) {
    $scope.labels = ['Download Sales', 'Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    $scope.data = [300, 500, 100, 40, 120];
    $scope.type = 'PolarArea';

    $scope.toggle = function () {
      $scope.type = $scope.type === 'PolarArea' ?  'Pie' : 'PolarArea';
    };
  }

  RadarCtrl.$inject = ['$scope'];  
  function RadarCtrl($scope) {
    $scope.labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

    $scope.data = [
      [65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100]
    ];

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  }


  StackedBarCtrl.$inject = ['$scope'];
  function StackedBarCtrl($scope) {
    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.type = 'StackedBar';

    $scope.data = [
      [65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100]
    ];
  }


  DataTablesCtrl.$inject = ['$scope'];
  function DataTablesCtrl($scope) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.colours = [
      { // grey
        fillColor: 'rgba(148,159,177,0.2)',
        strokeColor: 'rgba(148,159,177,1)',
        pointColor: 'rgba(148,159,177,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        fillColor: 'rgba(77,83,96,0.2)',
        strokeColor: 'rgba(77,83,96,1)',
        pointColor: 'rgba(77,83,96,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ];
    $scope.randomize = function () {
      $scope.data = $scope.data.map(function (data) {
        return data.map(function (y) {
          y = y + Math.random() * 10 - 5;
          return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
        });
      });
    };
  }

/*
Flot Charts
*/
FlotInteractive.$inject = ['$scope', '$log','$element'];
function FlotInteractive($scope,$log,$element) {
    $scope.$log = $log;
    $scope.data = [];
    $scope.myChartOptions = {
          grid: {
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
          },
          series: {
            shadowSize: 0, // Drawing is faster without shadows
            color: "#3c8dbc"
          },
          lines: {
            fill: true, //Converts the line chart to area chart
            color: "#3c8dbc"
          },
          yaxis: {
            min: 0,
            max: 100,
            show: true
          },
          xaxis: {
            show: true
          }
        };
    $scope.totalPoints = 100;
    $scope.updateInterval = 500;
    $scope.realtime = 1;
    $scope.getRandomData = function() {

          if ($scope.data.length > 0)
            $scope.data = $scope.data.slice(1);

          // Do a random walk
          while ($scope.data.length < $scope.totalPoints) {

            var prev = $scope.data.length > 0 ? $scope.data[$scope.data.length - 1] : 50,
                    y = prev + Math.random() * 10 - 5;

            if (y < 0) {
              y = 0;
            } else if (y > 100) {
              y = 100;
            }

            $scope.data.push(y);
          }

          // Zip the generated y values with the x values
          var res = [];
          for (var i = 0; i < $scope.data.length; ++i) {
            res.push([i, $scope.data[i]]);
          }

          return res;
        };
    $scope.update = function() {
          $scope.data =[$scope.getRandomData()];
          // Since the axes don't change, we don't need to call plot.setupGrid()
         
          
          if ($scope.realtime == 1)
            setTimeout($scope.update, $scope.updateInterval);
        };
    
}

FlotLineChart.$inject = ['$scope'];
function FlotLineChart($scope) {
        var sin = [], cos = [];
        for (var i = 0; i < 14; i += 0.5) {
          sin.push([i, Math.sin(i)]);
          cos.push([i, Math.cos(i)]);
        }
        var line_data1 = {
          data: sin,
          color: "#3c8dbc"
        };
        var line_data2 = {
          data: cos,
          color: "#00c0ef"
        };
        
    $scope.myData = [line_data1, line_data2];
    $scope.myChartOptions = {
          grid: {
            hoverable: true,
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
          },
          series: {
            shadowSize: 0,
            lines: {
              show: true
            },
            points: {
              show: true
            }
          },
          lines: {
            fill: false,
            color: ["#3c8dbc", "#f56954"]
          },
          yaxis: {
            show: true,
          },
          xaxis: {
            show: true
          }
        };
}

FlotAreaChart.$inject = ['$scope'];
function FlotAreaChart($scope) {
    var areaData = [[2, 88.0], [3, 93.3], [4, 102.0], [5, 108.5], [6, 115.7], [7, 115.6],
    [8, 124.6], [9, 130.3], [10, 134.3], [11, 141.4], [12, 146.5], [13, 151.7], [14, 159.9],
    [15, 165.4], [16, 167.8], [17, 168.7], [18, 169.5], [19, 168.0]];
          
    $scope.myData = [areaData];
    $scope.myChartOptions = {
          grid: {
            borderWidth: 0
          },
          series: {
            shadowSize: 0, // Drawing is faster without shadows
            color: "#00c0ef"
          },
          lines: {
            fill: true //Converts the line chart to area chart
          },
          yaxis: {
            show: false
          },
          xaxis: {
            show: false
          }
        };
}


FlotBarChart.$inject = ['$scope'];
function FlotBarChart($scope) {
    $scope.myData = [{
          data: [["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9]],
          color: "#3c8dbc"
        }];
    $scope.myChartOptions = {
          grid: {
            borderWidth: 1,
            borderColor: "#f3f3f3",
            tickColor: "#f3f3f3"
          },
          series: {
            bars: {
              show: true,
              barWidth: 0.5,
              align: "center"
            }
          },
          xaxis: {
            mode: "categories",
            tickLength: 0
          }
        };
}

FlotDonutChart.$inject = ['$scope'];
function FlotDonutChart ($scope) {
    $scope.myData = [
          {label: "Series2", data: 30, color: "#3c8dbc"},
          {label: "Series3", data: 20, color: "#0073b7"},
          {label: "Series4", data: 50, color: "#00c0ef"}
        ];
    $scope.myChartOptions = {
          series: {
            pie: {
              show: true,
              radius: 1,
              innerRadius: 0.5,
              label: {
                show: true,
                radius: 2 / 3,
                formatter: labelFormatter,
                threshold: 0.1
              }

            }
          },
          legend: {
            show: false
          }
        };
    function labelFormatter(label, series) {
        return "<div style='font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;'>"
                + label
                + "<br/>"
                + Math.round(series.percent) + "%</div>";
      }
}
 
ChatController.$inject = ['$scope','$http','$filter'];
function ChatController($scope,$http,$filter) {
    $http.get('/partials/widgets/dialog1.json')
    .success(function(data){
        $scope.messages = data;
    });
}


})();
