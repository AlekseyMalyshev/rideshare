'use strict';

var app = angular.module('Riders', ['satellizer', 'ui.router']);
var myFirebaseRef = new Firebase('https://ch-chat.firebaseio.com/');

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {

  //$urlRouterProvider.otherwise('login');

  $stateProvider
    .state('thumb', {
      url: '/thumb',
      templateUrl: 'partials/thumb',
      controller: 'ThumbCtrl'
    })
    .state('riders', {
      url: '/riders',
      templateUrl: 'partials/riders',
      controller: 'RidersCtrl'
    })
    .state('rider', {
      url: '/rider:size',
      templateUrl: 'partials/rider',
      controller: 'RiderCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login',
      controller: 'LoginCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'partials/profile',
      controller: 'ProfCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register',
      controller: 'RegCtrl'
    });

  $authProvider.facebook({
    clientId: '924337914326712'
  });

  $authProvider.linkedin({
    clientId: '77reigersixrfn'
  });

  $authProvider.twitter({
    clientId: 'T4Q5ltrRgY0svVhr56RCAbc1c'
  });
}).
run(['$auth', '$state', function($auth, $state) {
  if ($auth.isAuthenticated()) {
    $state.go('thumb');
  }
  else {
    $state.go('login');
  }
}])
