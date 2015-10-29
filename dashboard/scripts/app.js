(function () {
  'use strict';

  // create the angular app
  angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives',
      'myApp.simpleGrid',
      'gridster'
    ]);

  // setup dependency injection
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', []);
    angular.module('myApp.simpleGrid', ['gridster']);


}());

