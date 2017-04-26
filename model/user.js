

const Sequelize = require('sequelize');
const sequelize = require('./connect');
const userConfig = require('../config/common').account;
const encryption = require('../middleware/encryption.js');

var userModel = sequelize.define('user', {
    gmt_create: Sequelize.DATEONLY,
    gmt_modified: Sequelize.DATEONLY,
    username: {
        type: Sequelize.STRING,
        comment: '渠道名',
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        comment: '渠道密码',
        allowNull: false
    },
    rank: {
        type: Sequelize.ENUM('1', '2'),
        comment: '1代表管理员,2代表服务商',
        allowNull: false
    },
    increase_decrement: {
        type: Sequelize.FLOAT(10, 4),
        comment: '新增',
        allowNull: false
    },
    expense_decrement: {
        type: Sequelize.FLOAT(10, 4),
        comment: '付费',
        allowNull: false
    },
    search_name: {
        type: Sequelize.STRING,
        comment: '搜索名'
    },
    crawl_url: {
        type: Sequelize.ENUM('1', '2'),
        comment: '爬虫来源,1代表geek-maker,2代表batpk',
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: false,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true
});

userModel.sync();

userModel.findOrCreate({
    where: {
        username: 'root'
    },
    defaults: {
        username: 'root',
        password: encryption.encrypt('123456'),
        gmt_create: new Date(),
        gmt_modified: new Date(),
        rank: userConfig.rank,
        increase_decrement: 1,
        expense_decrement: 1,
        search_name: userConfig.username,
        crawl_url: 1
    }
});


module.exports = userModel;