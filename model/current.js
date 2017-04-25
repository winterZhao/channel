'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connect');

var currentModel = sequelize.define('current', {
    gmt_create: Sequelize.DATEONLY,
    gmt_modified: Sequelize.DATEONLY,
    username: {
        type: Sequelize.STRING,
        comment: '渠道名',
        allowNull: false,
        unique: true
    },
    increase: {
        type: Sequelize.INTEGER,
        comment: '新增',
        allowNull: false
    },
    expense: {
        type: Sequelize.FLOAT(15, 2),
        comment: '付费',
        allowNull: false
    },
    ARPU: {
        type: Sequelize.FLOAT(15, 2),
        comment: 'ARPU',
        allowNull: false
    },
    modify_increase: {
        type: Sequelize.INTEGER,
        comment: '新增修改项',
        allowNull: false
    },
    modify_expense: {
        type: Sequelize.FLOAT(10, 4),
        comment: '付费修改项',
        allowNull: false
    },
    modify_ARPU: {
        type: Sequelize.FLOAT(10, 4),
        comment: '修改后的ARPU',
        allowNull: false
    },
    search_name: {
        type: Sequelize.STRING,
        comment: '搜索名'
    }
}, {
    underscored: true,
    timestamps: false,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true
});


currentModel.sync();

module.exports = currentModel;