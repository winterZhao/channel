'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connect');

var ipModel = sequelize.define('ip', {
    gmt_create: Sequelize.DATEONLY,
    gmt_modified: Sequelize.DATEONLY,
    username: {
        type: Sequelize.STRING,
        comment: '渠道名',
        allowNull: false,
        unique: true
    },
    ip: {
        type: Sequelize.STRING,
        comment: 'ip',
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: false,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true
});


ipModel.sync();

module.exports = ipModel;