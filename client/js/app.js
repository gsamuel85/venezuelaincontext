/* global angular, io */
'use strict';

var app = angular.module('vic-app', ['textAngular']);

/**
 * Filter to display time of comments
 * Convert seconds to m:ss
 */
app.filter('secondsToTime', [function () {
    return function (seconds) {
        var d = new Date(0, 0, 0, 0, 0, 0);
        d.setSeconds(seconds);
        return d;
    };
}]);

/**
 * Service to encapsulate Socket.io
 */
app.factory('$socketio', function() {
    return io;
});

// Dynamically bootstrap Angular app when document is loaded
angular.element(document).ready(function () {
    angular.bootstrap(document, ["vic-app"]);
});