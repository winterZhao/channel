'use strict';

const currentModel = require('../model/current');

const currentService = {
    *findOne( options ) {
        options = options || {};
        return currentModel.findOne({
            where: options
        });
    },
    *findAndCountAll( options ) {
        options = options || {};
        return currentModel.findAndCountAll({
            where: options
        });
    },
    *update( data, options ) {
        options = options || {};
        return currentModel.update( data, {
            where: options
        });
    },
    *upsert( data, options ) {
        options = options || {};
        return currentModel.upsert( data, {
            where: options
        });
    },
    *sum( field, options ) {
        options = options || {};
        return currentModel.sum( field, {
            where: options
        } );
    }
};

module.exports = currentService;