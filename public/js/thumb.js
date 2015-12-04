'use strict';

app.controller('ThumbCtrl', ['$scope', '$http', '$stateParams',
  function($scope, $http, $stateParams) {

    $scope.rider = {};
    $scope.rider.time = '15';
    $scope.rider.places = '2';
    var geo = navigator.geolocation;

    var map;
    var image = {
        url: 'images/dest.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
      };
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };

    $scope.showMap = function() {
      map = new google.maps.Map(document.getElementById('map'), {
          center: $scope.rider.position,
          disableDefaultUI: true,
          zoom: 6
        });

      var marker = new google.maps.Marker({
        position: $scope.rider.position,
        map: map,
        //icon: image,
        shape: shape,
        title: $scope.rider.dest,
        //zIndex: ??
      });

      var marker = new google.maps.Marker({
        position: $scope.rider.destPos,
        map: map,
        //icon: image,
        shape: shape,
        title: $scope.rider.dest,
        //zIndex: ??
      });
    };

    function showError(err) {
      console.log('error: ', err);
    }

    function sendRequest(position) {
      $scope.rider.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('rider: ', $scope.rider);
      $scope.rider.time = Date.now() + Number($scope.rider.time) * 60000;

      var newRef = myFirebaseRef.push($scope.rider);

      console.log('Record key: ', newRef.key());
      distance($scope.rider.position, $scope.rider.destPos);
      $scope.showMap();
    }

    function dataReady(req) {
      if (req.status == 200) {
        var data = JSON.parse(req.responseText);
        console.log('Google response: ', data);
        $scope.rider.destPos = data.results[0].geometry.location;
        if (geo) {
          geo.getCurrentPosition(sendRequest, showError, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
        }
        else {
          console.log('Geolocation is not supported');
        }
      }
      else {
        console.log(req.readyState, req.status);
      }
    }

    $scope.go = function($event) {
      $event.preventDefault();

      var addr = 'https://maps.google.com/maps/api/geocode/json?address=' + 
        $scope.rider.dest.replace(' ', '+');

      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          dataReady(req);
        }
      };
      req.open("GET", addr);
      req.send();
    }

    function toRad(grad) {
      return Math.PI * grad / 180;
    }

    function distance(p1, p2) {
      var R = 6371000; // metres
      var φ1 = toRad(p1.lat);
      var φ2 = toRad(p2.lat);
      var Δφ = toRad(p2.lat-p1.lat);
      var Δλ = toRad(p2.lng-p1.lng);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;
      console.log('Distance: ', d);
    }

  }]);
