/* global angular, io */
'use strict';

var vicApp = angular.module('vic-app', ['textAngular']);

/**
 * Filter to display time of comments
 * Convert seconds to m:ss
 */
vicApp.filter('secondsToTime', [function () {
    return function (seconds) {
        var d = new Date(0, 0, 0, 0, 0, 0);
        d.setSeconds(seconds);
        return d;
    };
}]);

/**
 * Service to encapsulate Socket.io
 */
vicApp.factory('$socketio', function() {
    return io;
});

module.exports = vicApp;