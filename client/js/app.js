/* global angular */
'use strict';


var app = angular.module('vic-app', ['ngSanitize']);

// Dynamically bootstrap Angular app when document is loaded
angular.element(document).ready(function() {
    angular.bootstrap(document, ["vic-app"]);
});