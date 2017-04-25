'use strict';

const userService = require('../service/user');
const historyService = require('../service/history');
const currentService = require('../service/current');
const ipService = require('../service/ip');

const timeFormat = require('../middleware/format-date').timeFormat;
const encryption = require('../middleware/encryption');

const masterRouter = {
    // 渲染管理者页面;
    *getContent() {

        this.session.status = this.session.status || 'channel';
        if (this.session.status === 'master') {
            yield this.render('master.html');
        } else {
            this.redirect('/login');
        }
    },
    // 增加新渠道(用户)或修改渠道(用户)的资料;
    *postNewUser() {
        var data = this.request.body,
            result, changeResult,
            json = {success: true};

        if (data.isNew === 'true') {
            result = yield userService.findOne({
                username: data.username
            });
            if (result) {
                json.success = false;
                json.code = 2000;
            } else {
                data.gmt_create = new Date();
                data.gmt_modified = new Date();
            }
        } else {
            data.gmt_modified = new Date();
        }

        data.password = encryption.encrypt( data.password );

        if ( json.success ) {

            try {
                yield userService.upsert( data, {
                    where: {
                        id: data.id
                    }
                } );
                json.success = true;
            } catch ( e ) {
                json.success = false;
            }

        }
        this.body = JSON.stringify(json);
    },
    // 获取渠道列表:
    *getChannelList() {
        var result, json = {}, options = {};
        options.order = 'gmt_modified DESC';

        try {
            result = yield userService.findAndCountAll(options);
            json.success = true;
            json.count = result.count;
            json.dataList = result.rows;
            json.dataList.forEach(function(item) {
                item.password = encryption.decrypt(item.password);
            });
        } catch ( e ) {
            throw e;
            json.success = false;
        }
        this.body = JSON.stringify(json);
    },
    // 查看用户ip;
    *getChannelIp() {

        var requestData, result, json = {}, options = {};
        requestData = this.request.query;
        options.order = 'gmt_modified DESC';

        try {
            result = yield ipService.findAndCountAll(options);
            json.dataList = [];
            result.rows.forEach( function ( item ) {
                var obj = {};
                obj.gmt_create = timeFormat(item.gmt_create);
                obj.ip = item.ip;
                obj.username = item.username;
                json.dataList.push(obj);
            });

            json.success = true;

        } catch (e) {
            json.success = false;
            throw e;
        }

        this.body = JSON.stringify(json);
    },
    // 搜索某个渠道的用户信息
    *seachChannel() {
        var searchName, result, json = {}, arr = [];

        searchName = this.request.query.search_name;
        result = yield userService.findAll({
            search_name: searchName
        });

        if (result) {
            result.forEach(function(item) {
                item.password = encryption.decrypt(item.password );
            });

            json.success = true;
            json.dataList = result;
        } else {
            json.success = false;
        }
        this.body = JSON.stringify(json);
    },
    // 得到全部的当前数据信息;
    *getCurrentData() {
        var result, json = {};
        var search_name = this.request.query.search_name;
        var obj = {};
        if ( search_name ) {
            obj.search_name = search_name;
        }
        try {
            result = yield currentService.findAndCountAll(obj);
            json.increaseSum = yield currentService.sum('increase') || 0;
            json.expenseSum = yield currentService.sum('expense') || 0;
            json.ARPUSum = (json.expenseSum / json.increaseSum).toFixed(2) || 0;
            json.success = true;
            json.length = result.count;
            json.dataList = result.rows;
        } catch(e) {
            throw e;
        }

        this.body = JSON.stringify(json);
    },
    // 得到历史数据
    *getHistoryData() {
        var requestData, result, json = {}, options = {}, opt = {};

        requestData = this.request.query;
        options.order = 'gmt_modified DESC';
        options.where = {};
        opt.where = {};
        if ( requestData.search_name ) {
            options.where.search_name = requestData.search_name;
            opt.where.search_name = requestData.search_name;
        }

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
            json.dataList = result.rows;
            json.dataList.forEach( function( item ) {
                item.crawl_time = timeFormat(item.crawl_time);
            });

            json.length = result.count;
            json.success = true;

        } catch (e) {
            throw e;
            json.success = false;
        }

        this.body = JSON.stringify(json);
    },
    // 修改历史数据
    *postHistoryData() {
        var data, options = {}, json = {};

        data = this.request.body;
        options.modify_increase = data.modify_increase;
        options.modify_expense = data.modify_expense;
        options.modify_ARPU = (data.modify_expense / data.modify_increase).toFixed(2);
        options.gmt_modified = new Date();

        try {
            var result = yield historyService.update( options, {
                id: data.id
            });
            json.success = true;
        } catch(e) {
            json.success = false;
            throw e;
        }
        this.body = JSON.stringify(json);
    }
};

module.exports = masterRouter;