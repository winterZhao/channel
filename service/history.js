'use strict';

const historyModel = require('../model/history');
const sequelize = require('sequelize');

const historyService = {

    *findOne( options ) {
        options = options || {};
        return historyModel.findOne({
            where: options
        });
    },
    *findAndCountAll( options ) {
        options = options || {};
        return historyModel.findAndCountAll(options);
    },
    *findAll( options ) {
        options = options || {};
        return historyModel.findAll(options);
    },
    *create( data ) {
        historyModel.create( data );
    },
    *update( data, options ) {
        options = options || {};
        return historyModel.update( data, {
            where: options
        });
    },
    *sum( field, options ) {
        options = options || {};
        return historyModel.sum( field, options);
    }
};

module.exports = historyService;