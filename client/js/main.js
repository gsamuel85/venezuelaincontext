/**
 * Created by Guy on 21/5.
 */
'use strict';

// Expose vars to client window
window.angular = require("angular");
window.gravatar = require("gravatar");
window.vicApp = require("./video/vicApp");

/**
 * Load controllers
 */
require('./video/videoEditCtrl')(window.vicApp);
require('./video/videoCtrl')(window.vicApp);
require('./video/videoNavCtrl')(window.vicApp);
require('./video/videoNavDir')(window.vicApp);
require('./video/commentCtrl')(window.vicApp);

require('./video/commentEditCtrl')(window.vicApp);

require('textangular/dist/textAngular-sanitize.min');
require('textangular');


/**
 * Dynamically bootstrap Angular app when document is loaded
 */
window.angular.element(document).ready(function () {
    window.angular.bootstrap(document, ["vic-app"]);
});