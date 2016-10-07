'use strict';
angular.module('adminLTEConfig', ['ui-notification'])
        .factory('settings', ['$rootScope', function ($rootScope) {
		    // Cuando subas a un servidor publico, poner ejemplo: http://www.lagranescuela.com 		
            var baseURL = '/multident', 
                settings = {
                    baseURL: baseURL,
                    pluginPath: baseURL + '/bower_components',
                    pluginCommercialPath: baseURL + '/assets/commercial/plugins',
                    globalImagePath: baseURL + '/assets/img',
                    adminImagePath: baseURL + '/assets/admin/img',
                    cssPath: baseURL + '/assets/admin/css',
                    dataPath: baseURL + '/data'
                };
            $rootScope.settings = settings;
            return settings;
        }])

        .config(function (NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 10000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'center',
                positionY: 'top'
            });
        })

        .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
                $ocLazyLoadProvider.config({
                    events: false,
                    debug: false,
                    cache: false,
                    cssFilesInsertBefore: 'ng_load_plugins_before',
                    modules: [
                        {
                            name: 'blankonApp.core.demo',
                            files: ['js/modules/core/demo.js']
                        }
                    ]
                });
            }])
        

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            $urlRouterProvider.otherwise('/dashboard1');

            $stateProvider
                .state('dashboard1',{
                    url: '/dashboard1',
                    templateUrl:'views/dashboard1.html'
                })
                .state('dashboard2',{
                    url: '/dashboard2',
                    templateUrl:'views/dashboard2.html'
                })

                .state('signin', {
                    url: '/sign-in',
                    templateUrl: 'views/sign/sign-in.html',
                    data: {
                        pageTitle: 'SIGN IN',
                        isPublic: true
                    },
                    controller: 'SigninCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                var cssPath = settings.cssPath,
                                        pluginPath = settings.pluginPath;

                                return $ocLazyLoad.load(
                                        [
                                            {
                                                insertBefore: '#load_css_before',
                                                files: [
                                                    cssPath + '/pages/sign.css'
                                                ]
                                            },
                                            {
                                                name: 'blankonApp.account.signin',
                                                files: [
                                                    'js/modules/sign/signin.js',
                                                    'app-services/enterprise.service.js'
                                                ]
                                            }
                                        ]
                                        );
                            }]
                        ,
                        enterpriseService: "enterpriseService"
                        ,
                        loadEnterprise: function (enterpriseService, $rootScope) {
                            var promise;
                            promise = enterpriseService.home();
                            return promise;
                        }
                    }
                })
                .state('about', {
                    url: '/about',
                    template: '<div>Bienvenido al sistema.</div>'
                })

                .state('personal', {
                    url: '/personal',
                    templateUrl: 'views/modulos/personal.html',
                    data: {
                        pageTitle: 'Personal',
                        pageHeader: {
                            title: 'Personal Administrativo',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Personal'}, {title: 'Administrativos'}
                        ]
                    },
                    controller: 'listPersonalCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.personal',
                                                files: [
                                                    'dist/js/appServices/personal.services.js',
                                                    'dist/js/appControllers/personal.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                // PARA PACIENTES
                .state('paciente', {
                    url: '/paciente',
                    templateUrl: 'views/modulos/paciente.html',
                    data: {
                        pageTitle: 'Paciente',
                        pageHeader: {
                            title: 'Gestión de Pacientes',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Pacientes'}
                        ]
                    },
                    controller: 'listPacientelCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.paciente',
                                                files: [
                                                    'dist/js/appServices/paciente.services.js',
                                                    'dist/js/appControllers/paciente.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('paciente/familiar', {
                    url: '/paciente/familiar',
                    templateUrl: 'views/modulos/paciente-familiar.html',
                    data: {
                        pageTitle: 'Paciente',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Mi empresa',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Configuración'}, {title: 'Empresa'}
                        ]
                    },
                    controller: 'listFamiliarlCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.familiar',
                                                files: [
                                                    'dist/js/appControllers/familiar.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('paciente/cita', {
                    url: '/paciente/cita',
                    templateUrl: 'views/modulos/paciente-cita.html',
                    data: {
                        pageTitle: 'Paciente',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Mi empresa',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Configuración'}, {title: 'Empresa'}
                        ]
                    },
                    controller: 'listFamiliarlCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.familiar',
                                                files: [
                                                    'dist/js/appControllers/familiar.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('familiar.new', {
                    url: '/paciente/familiar/nuevo',
                    templateUrl: 'views/modulos/paciente-cita.html',
                    data: {
                        pageTitle: 'Paciente',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Mi empresa',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Configuración'}, {title: 'Empresa'}
                        ]
                    },
                    controller: 'listFamiliarlCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.familiar',
                                                files: [
                                                    'dist/js/appControllers/familiar.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                // FIN PACIENTES

                .state('odontologo', {
                    url: '/odontologo',
                    templateUrl: 'views/modulos/odontologo.html',
                    data: {
                        pageTitle: 'Odontologo',
                        pageHeader: {
                            title: 'Gestión de Odontologos',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Odontologos'}
                        ]
                    },
                    controller: 'listOdontologoCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.odontologo',
                                                files: [
                                                    'dist/js/appServices/odontologo.services.js',
                                                    'dist/js/appControllers/odontologo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('odontologo/familiar', {
                    url: '/odontologo/familiar',
                    templateUrl: 'views/modulos/odontologo-familiar.html',
                    data: {
                        pageTitle: 'Odontologo',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Mi empresa',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Configuración'}, {title: 'Empresa'}
                        ]
                    },
                    controller: 'listOdontologoCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.odontologo',
                                                files: [
                                                    'dist/js/appControllers/odontologo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('odontologo/cita', {
                    url: '/odontologo/cita',
                    templateUrl: 'views/modulos/odontologo-cita.html',
                    data: {
                        pageTitle: 'Odontologo',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Mi empresa',
                            subtitle: 'y sedes'
                        },
                        breadcrumbs: [
                            {title: 'Configuración'}, {title: 'Empresa'}
                        ]
                    },
                    controller: 'listOdontologoCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.odontologo',
                                                files: [
                                                    'dist/js/appControllers/odontologo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                // PARA GRUPOS
                .state('grupo', {
                    abstract: true,
                    url: '/grupo',
                    templateUrl: 'views/modulos/grupo.html',
                    data: {
                        pageTitle: 'Grupo',
                        pageHeader: {
                            icono: 'fa fa-users',
                            title: 'Gestión de Grupos',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Grupos'}
                        ]
                    },
                    controller: 'listGrupoCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.grupo',
                                                files: [
                                                    'dist/js/appServices/grupo.services.js',
                                                    'dist/js/appControllers/grupo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('grupo.list', {url: ''})
                .state('grupo.edit', {
                        url: '/editar/:grupoId',
                        templateUrl: 'views/modulos/grupo-form.html',
                        controller: 'editGrupoCtrl as vm'
                })

                .state('grupo.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/grupo-form.html',
                        controller: 'newGrupoCtrl as vm'
                })
                // FIN DE GRUPOS

                // PARA USUARIOS
                .state('usuario', {
                    url: '/usuario',
                    templateUrl: 'views/modulos/usuario.html',
                    data: {
                        pageTitle: 'usuario',
                        pageHeader: {
                            icon: 'fa fa-institution',
                            title: 'Gestión de Usuarios',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Usuario'}
                        ]
                    },
                    controller: 'listUsuarioCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.usuario',
                                                files: [
                                                    'dist/js/appServices/usuario.services.js',
                                                    'dist/js/appControllers/usuario.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })
                // FIN DE USUARIOS

                // PARA ROLES
                .state('rol', {
                    abstract: true,
                    url: '/rol',
                    templateUrl: 'views/modulos/rol.html',
                    data: {
                        pageTitle: 'Rol',
                        pageHeader: {
                            icono: 'fa fa-cog',
                            title: 'Gestión de Roles',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Roles'}
                        ]
                    },
                    controller: 'listRolCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.rol',
                                                files: [
                                                    'dist/js/appServices/rol.services.js',
                                                    'dist/js/appControllers/rol.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('rol.list', {url: ''})
                .state('rol.edit', {
                        url: '/editar/:rolId',
                        templateUrl: 'views/modulos/rol-form.html',
                        controller: 'editRolCtrl as vm'
                })
                .state('rol.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/rol-form.html',
                        controller: 'newRolCtrl as vm'
                })
                // FIN DE ROLES


                // PARA MODULOS
                .state('modulo', {
                    abstract: true,
                    url: '/modulo',
                    templateUrl: 'views/modulos/modulo.html',
                    data: {
                        pageTitle: 'Modulos',
                        pageHeader: {
                            icono: 'fa fa-cubes',
                            title: 'Gestión de Modulos',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Modulos'}
                        ]
                    },
                    controller: 'listModuloCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.modulo',
                                                files: [
                                                    'dist/js/appServices/modulo.services.js',
                                                    'dist/js/appControllers/modulo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })
                .state('modulo.list', {url: ''})
                .state('modulo.edit', {
                        url: '/editar/:moduloId',
                        templateUrl: 'views/modulos/modulo-form.html',
                        controller: 'editModuloCtrl as vm'
                })
                .state('modulo.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/modulo-form.html',
                        controller: 'newModuloCtrl as vm'
                })
                // FIN DE MODULOS

                // PARA CARGOS
                .state('cargo', {
                    abstract: true,
                    url: '/cargo',
                    templateUrl: 'views/modulos/cargo.html',
                    data: {
                        pageTitle: 'Cargos',
                        pageHeader: {
                            icono: 'fa fa-graduation-cap',
                            title: 'Gestión de Cargos',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Cargos'}
                        ]
                    },
                    controller: 'listCargoCtrl as vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.cargo',
                                                files: [
                                                    'dist/js/appServices/cargo.services.js',
                                                    'dist/js/appControllers/cargo.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })
                .state('cargo.list', {url: ''})
                .state('cargo.edit', {
                        url: '/editar/:cargoId',
                        templateUrl: 'views/modulos/cargo-form.html',
                        controller: 'editCargoCtrl as vm'
                })
                .state('cargo.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/cargo-form.html',
                        controller: 'newCargoCtrl as vm'
                })
                // FIN DE CARGOS

                // PARA MONEDAS
                .state('moneda', {
                    abstract: true,
                    url: '/moneda',
                    templateUrl: 'views/modulos/moneda.html',
                    data: {
                        pageTitle: 'Monedas',
                        pageHeader: {
                            icono: 'fa fa-money',
                            title: 'Gestión de Monedas',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Monedas'}
                        ]
                    },
                    controller: 'listMonedaCtrl as vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.moneda',
                                                files: [
                                                    'dist/js/appServices/moneda.services.js',
                                                    'dist/js/appControllers/moneda.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })
                .state('moneda.list', {url: ''})
                .state('moneda.edit', {
                        url: '/editar/:monedaId',
                        templateUrl: 'views/modulos/moneda-form.html',
                        controller: 'editMonedaCtrl as vm'
                })
                .state('moneda.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/moneda-form.html',
                        controller: 'newMonedaCtrl as vm'
                })
                // FIN DE MONEDAS

                // PARA TIPO DE CAMBIO
                .state('tipocambio', {
                    abstract: true,
                    url: '/tipocambio',
                    templateUrl: 'views/modulos/tipo-cambio.html',
                    data: {
                        pageTitle: 'Tipo de Cambio',
                        pageHeader: {
                            icono: 'fa fa-money',
                            title: 'Lista de Tipos de Cambios',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Seguridad'}, {title: 'Tipo de Cambio'}
                        ]
                    },
                    controller: 'listTipocambioCtrl as vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.tipocambio',
                                                files: [
                                                    'dist/js/appServices/tipo_cambio.services.js',
                                                    'dist/js/appControllers/tipocambio.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })
                .state('tipocambio.list', {url: ''})
                .state('tipocambio.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/tipo-cambio-form.html',
                        controller: 'newTipocambioCtrl as vm'
                })
                // FIN DE TIPO DE CAMBIO


                // PARA SEDES
                .state('sede', {
                    abstract: true,
                    url: '/sede',
                    templateUrl: 'views/modulos/sede.html',
                    data: {
                        pageTitle: 'Sede',
                        pageHeader: {
                            icono: 'fa fa-building',
                            title: 'Gestión de Sedes',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Administracion'}, {title: 'Sedes'}
                        ]
                    },
                    controller: 'listSedeCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.sede',
                                                files: [
                                                    'dist/js/appServices/sede.services.js',
                                                    'dist/js/appControllers/sede.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('sede.list', {url: ''})
                .state('sede.edit', {
                        url: '/editar/:sedeId',
                        templateUrl: 'views/modulos/sede-form.html',
                        controller: 'editSedeCtrl as vm'
                })

                .state('sede.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/sede-form.html',
                        controller: 'newSedeCtrl as vm'
                })
                // FIN DE SEDES

                // PARA EMPRESAS ADMINISTRADORAS
                .state('empresaadmin', {
                    abstract: true,
                    url: '/empresaadmin',
                    templateUrl: 'views/modulos/empresaadmin.html',
                    data: {
                        pageTitle: 'Empresas Administradoras',
                        pageHeader: {
                            icono: 'fa fa-briefcase',
                            title: 'Gestión de Empresas Administradoras',
                            subtitle: ''
                        },
                        breadcrumbs: [
                            {title: 'Administracion'}, {title: 'Empresas Administradoras'}
                        ]
                    },
                    controller: 'listEmpresaAdminCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', 'settings', function ($ocLazyLoad, settings) {
                                return $ocLazyLoad.load(
                                        [
                                            {
                                                name: 'adminLTEApp.empresaadmin',
                                                files: [
                                                    'dist/js/appServices/empresa_admin.services.js',
                                                    'dist/js/appControllers/empresaadmin.js'
                                                    
                                                ]
                                            }
                                        ]
                                        );
                            }]
                    }
                })

                .state('empresaadmin.list', {url: ''})
                .state('empresaadmin.edit', {
                        url: '/editar/:empresaId',
                        templateUrl: 'views/modulos/empresaadmin-form.html',
                        controller: 'editEmpresaAdminCtrl as vm'
                })

                .state('empresaadmin.new', {
                        url: '/nuevo',
                        templateUrl: 'views/modulos/empresaadmin-form.html',
                        controller: 'newEmpresaAdminCtrl as vm'
                })
                // FIN DE SEDES



        })

    .run(["$rootScope", "settings", "$state", "$location", "$stateParams",  function ($rootScope, settings, $state, $location, $stateParams) {

       var urlpage = $location.path().split('/')[1];

       $rootScope.$state = $state;
       $rootScope.$stateParams = $stateParams;
       $rootScope.settings = settings;

       $rootScope.urlente = 'multident';
      
       //$rootScope.urlente = $location.host().split('.')[0];
       $rootScope.servidor = '/multident/apilumen/public/' + $rootScope.urlente;
       $rootScope.api = '/multident/apilumen/public';

      //$rootScope.servidor = 'http://lumenionic.pe/' + $rootScope.urlente;
      //$rootScope.api = 'http://lumenionic.pe';

      
      //$rootScope.viewLogin = true;
    }]);

