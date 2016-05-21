'use strict';

var gravatar = require("gravatar");
window.gravatar = gravatar;


import { angular } from 'angular';

// Expose angular variable to client browser
window.angular = angular;