'use strict';
/* global app */

app.controller("VideoCtrl", ["$scope", function($scope) {
    $scope.aMsg = "This is a message from AngularJS";
    
    console.log(window.video_url);
}]);
