'use strict';
/* global angular */

/**
 * Sub-app for handling user signup
 * @type {angular.Module}
 */

var userApp = angular.module('userApp', []);

userApp.controller('UserCtrl', ['$scope', function($scope) {
  $scope.password = "";
}]);

userApp.directive('password', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.password = function(modelValue, viewValue) {
        if (viewValue.length < 8 && viewValue.length !== 0) {    // TODO: Replace with REGEXP
          // it is invalid
          return false;
        }

        // it is valid / still empty
        return true;
      };
    }
  };
});

// Dynamically bootstrap Angular app when document is loaded
angular.element(document).ready(function() {
  angular.bootstrap(document, ["userApp"]);
});