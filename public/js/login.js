'use strict';

app.controller('LoginCtrl', ['$scope', '$auth', '$templateCache', '$state', '$stateParams',
  function($scope, $auth, $templateCache, $state, $stateParams) {

    $scope.user = {};

    $scope.login = function() {
      $auth.login($scope.user, { url: '/api/users/authenticate' })
        .then(function(response) {
          console.log('signed as ', $scope.user.email);
          $state.go('thumb');
        })
        .catch(function(err) {
          console.log('auth error: ', err)
        });
    }

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          console.log('signed with ' + provider, response);
          $state.go('thumb');
        })
        .catch(function(err) {
          console.log('auth error: ', err)
        });
    };
  }
]);

