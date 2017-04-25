'use strict';

const ipModel = require('../model/ip.js');
const requestIp = require('request-ip');

module.exports = function*( next ) {
    var obj = {};
    if ( this.request.url === '/channel') {
        if ( this.session.username ) {
            obj.gmt_create = new Date();
            obj.gmt_modified = new Date();
            obj.username = this.session.username;
            obj.ip = requestIp.getClientIp(this.request).substring(7);

            try {
                ipModel.create(obj);
            } catch(e) {
                throw e;
            }
        }
    }
    yield next;
};