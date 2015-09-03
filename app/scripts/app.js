'use strict';

/**
 * @ngdoc overview
 * @name stockDogApp
 * @description
 * # stockDogApp
 *
 * Main module of the application.
 */
angular
  .module('stockDogApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
     .when('/dashboard', {
       templateUrl: 'views/dashboard.html',
       controller: 'DashboardCtrl'
     })
     .when('/watchlist/:listId', {
       templateUrl: 'views/watchlist.html',
       controller: 'WatchlistCtrl'
     })
     .otherwise({
        redirectTo: '/dashboard'
      });
  })
  .config(['$provide', function($provide) {
    $provide.decorator('$locale',['$delegate', function($delegate) {
      if($delegate.id == 'en-us') {
        $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
        $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
      }
      return $delegate;
    }]);
  }]);
