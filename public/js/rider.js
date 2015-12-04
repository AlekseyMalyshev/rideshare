'use strict';

app.controller('RiderCtrl', ['$scope', '$http', '$state', '$stateParams',
  function($scope, $http, $state, $stateParams) {

    $scope.init = function() {
      if (!$stateParams.id) {
        console.log('New rider with size: ', $stateParams.size);
        var rider = {};
        rider.
        $http.get('/api/riders').then(function(response) {
          $scope.riders = response.data;
        }, function(err) {
          if (err.status !== 401) {
            console.error(err);
          }
        });
      }
      else {
        console.log('Get rider with id: ', $stateParams.id);
        $http.get('/api/riders').then(function(response) {
          $scope.riders = response.data;
        }, function(err) {
          if (err.status !== 401) {
            console.error(err);
          }
        });
      }

    };

    $scope.goto = function(id) {
      $state.go('rider', {riderId: id});
    };
  }]);
