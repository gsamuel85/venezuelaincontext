'use strict';
/* global app */

app.controller('UserCtrl', ['$scope', function($scope) {
    $scope.password = "";   // Initialise password field
}]);

app.directive('password', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.password = function(modelValue, viewValue) {
        if (viewValue.length >= 8) {    // TODO: Replace with REGEXP
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});