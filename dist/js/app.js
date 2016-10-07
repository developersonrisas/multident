/*! AdminLTE app.js
 * ================*/
'use strict';

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
  throw new Error("AdminLTE requires jQuery");
}

angular.module('adminLTE', [
    'ui.router',
    'oc.lazyLoad',
    'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.autoResize','ui.grid.cellNav', 
    'adminLTEConfig',
    'adminLTEDirective',
    'adminLTEController',
    'ui.bootstrap',
    'ngMessages',
]);




 


  
