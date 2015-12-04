'use strict';

app.controller('RidersCtrl', ['$scope', '$http', '$state',
  function($scope, $http, $state) {

    var selected = {};

    $scope.hasUsers = function() {
      for (user in selected) {
        return false;
      }
      return true;
    }

    $scope.init = function() {
      $http.get('/api/users').then(function(response) {
        $scope.users = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.addRemove = function(check, user) {
      if (check) {
        selected[user._id] = user;
      }
      else {
        delete selected[user._id];
      }
    }

    $scope.message = function() {
      var rider = {};
      rider.participants = [];
      for (user in selected) {
        rider.participants.push(user);
      }

      $http.post('/api/riders', rider).then(function(response) {
        $state.go('rider', {
          riderId: response.data._id
        });
      }, function(err) {
        var text;
        if (err.status === 409) {
          text = 'The e-mail is already used. If you have registered and forgot your password, please proceed to password reset.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
        else {
          console.error(err);
          text = 'We were not able to update your details at this time. Please try again later.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
      });
    };
  }
]);

