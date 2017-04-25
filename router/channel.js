'use strict';

const userService = require('../service/user');
const historyService = require('../service/history');
const currentService = require('../service/current');

const timeFormat = require('../middleware/format-date');
const encryption = require('../middleware/encryption');

const channelRouter = {
    // 渠道商获取内容;
    *getContent() {
        this.session.status = this.session.status || 'channel';
        if (this.session.status === 'channel') {
            yield this.render('channel.html');
        } else {
            this.redirect('/login');
        }
    },
    // 渠道商获取当前数据
    *getCurrentData() {
        var result, searchName, options = {}, json = {};

        options.search_name = this.session.username;
        try {

            result = yield currentService.findAndCountAll(options);
            json.increaseSum = yield currentService.sum('modify_increase', options);
            json.expenseSum = yield currentService.sum('modify_expense', options);
            json.ARPUSum = (json.expenseSum / json.increaseSum).toFixed(2);
            json.success = true;
            json.dataList = result.rows;
            json.length = result.count;
        }   catch(e) {
            json.success = false;
        }
        this.body = JSON.stringify(json);
    },
    // 渠道商获取历史数据
    *getHistoryData() {
        var requestData, result, json = {}, options = {}, opt = {};

        requestData = this.request.query;
        options.order = 'gmt_modified DESC';

        options.where = {};
        opt.where = {};

        options.where.search_name = this.session.username;
        opt.where.search_name = this.session.username;

        if ( requestData.starttime && requestData.endtime ) {
            options.where.crawl_time = {
                $lt: new Date(requestData.endtime + ' 00:00:00'),
                $gt: new Date(requestData.starttime + ' 00:00:00')
            };
            opt.where.crawl_time = {
                $lt: new Date(requestData.endtime + ' 00:00:00'),
                $gt: new Date(requestData.starttime + ' 00:00:00')
            };
        }

        try {
            result = yield historyService.findAndCountAll(options);
            if ( opt.where.search_name || opt.where.crawl_time ) {
                json.increaseSum = yield historyService.sum('modify_increase', opt);
                json.expenseSum = yield historyService.sum('modify_expense', opt);
            } else {
                json.increaseSum = yield historyService.sum('modify_increase');
                json.expenseSum = yield historyService.sum('modify_expense');
            }

            json.ARPUSum = (json.expenseSum / json.increaseSum).toFixed(2);
            json.success = true;
            json.dataList = result.rows;
            json.length = result.count;

            json.dataList.forEach( function( item ) {
                item.crawl_time = timeFormat.timeFormat(item.crawl_time);
            });

        } catch (e) {
            throw e;
            json.success = false;
        }

        this.body = JSON.stringify(json);
    },
    // 渠道商修改密码
    * modifyPassword() {
        var data, result, updateResult, options = {}, json = {};

        data = this.request.body;
        try {
            result = yield userService.findOne({
                username: data.username
            });
            result.password =  encryption.decrypt( result.password );
            if ( result.password === data.prevPassword ) {
                data.gmt_modified = new Date();
                data.password =  encryption.encrypt( data.password );

                updateResult = yield userService.update( data, {
                    username: data.username
                });

                if ( updateResult ) {
                    json.success = true;
                } else {
                    json.success = false;
                }
            } else {
                json.success = false;
            }
        } catch (e) {
            throw e;
            json.success = false;
        }
        this.body = JSON.stringify(json);

    }
};

module.exports = channelRouter;