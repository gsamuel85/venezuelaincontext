'use strict';
/* global app */

app.controller('UserCtrl', ['$scope', function($scope) {
    $scope.password = "";   // Initialise password field
    
    // Get Gravate image for comment author's e-mail
    $scope.getGravatarImage = function(email) {
        var imgTag = "<img src='" + 
                window.gravatar.url(email, { s: 55, d: 'mm'}, true) + 
                "' />";
        return imgTag;
    };
}]);

app.directive('password', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.password = function(modelValue, viewValue) {
        if (viewValue.length === 0 || viewValue.length >= 8) {    // TODO: Replace with REGEXP
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});