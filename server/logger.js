'use strict';
var bunyan = require("bunyan");
var log = bunyan.createLogger({
    name: 'ViC server',
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
    }
});

module.exports = log;