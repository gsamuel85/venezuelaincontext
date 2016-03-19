/* global angular */
'use strict';

var app = angular.module('vic-app', ['textAngular']);

app.filter('secondsToTime', [function() {
    return function(seconds) {
        var d = new Date(0,0,0,0,0,0);
        d.setSeconds(seconds);
        return d;
    };
}]);

// Dynamically bootstrap Angular app when document is loaded
angular.element(document).ready(function() {
    angular.bootstrap(document, ["vic-app"]);
});