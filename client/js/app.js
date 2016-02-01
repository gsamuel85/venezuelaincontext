/* global angular */
'use strict';


var app = angular.module('vic-app', []);

app.controller("videoCtrl", ["$scope", function($scope) {
    $scope.aMsg = "This is a message from AngularJS";
}]);



// Dynamically bootstrap Angular app when document is loaded
angular.element(document).ready(function() {
    angular.bootstrap(document, ["vic-app"]);
});