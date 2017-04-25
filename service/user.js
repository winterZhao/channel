'use strict';

const userModel = require('../model/user');

const userService = {
    *findOne( options ) {
        options = options || {};
        return userModel.findOne({
            where: options
        });
    },
    *findAndCountAll( options ) {
        options = options || {};
        return userModel.findAndCountAll(options);
    },
    *findAll( options ) {
        options = options || {};
        return userModel.findAll({
            where: options
        });
    },
    *upsert( data, options) {
        options = options || {};
        return userModel.upsert(data, options);
    },
    *update( data, options) {
        return userModel.update(data, {
            fields: ['gmt_modified', 'password'],
            where: options
        });
    }
};


module.exports = userService;