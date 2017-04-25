'use strict';
const ipModel = require('../model/ip');

const ipService = {
    *findAndCountAll( options ) {
        options = options || {};
        return ipModel.findAndCountAll(options);
    }
};


module.exports = ipService;