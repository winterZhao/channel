'use strict';
/*
 * 爬取当天的记录并实时展示
 */

const request = require('request');
const cheerio = require('cheerio');
const thunkify = require('thunkify');

const userService = require('../service/user');
const currentService = require('../service/current');
const currentModel = require('../model/current');
const encryption = require('../middleware/encryption');
const optionArr = require('../config/common').crawl;

const thunkRequest = thunkify(request);
const thunkRequestPost = thunkify(request.post);

var arr = [];

const getAllChannel = function*() {

    var userList = yield userService.findAll({});

    for ( let i = 0, r = userList.length; i < r; i ++ ) {

        let cur = userList[i];
        if ( Number(cur.rank) === 2 ) {

            cur.crawl_url = Number( cur.crawl_url );
            cur.password = encryption.decrypt( cur.password );

            if ( cur.crawl_url === 1 ) {
                yield crawlCurrent1( cur );
            } else {
                yield crawlCurrent2( cur );
            }
        }
    }

    yield saveToCurrent();

};

const crawlCurrent1 = function*( cur ) {
    var loginResult, result, option;

    option = optionArr[0];

    try {
        loginResult  = yield thunkRequestPost({
            url: option.loginUrl,
            form: {
                account: cur.username,
                pwd: cur.password
            }
        });

        result = yield thunkRequestPost({
            url: option.currentUrl,
            headers: {
                'cookie': loginResult[0].headers['set-cookie']
            }
        });

        var $ = cheerio.load(result[0].body);
        $('#my_tbody tr').each(function() {
            var obj = {};
            obj.increase = $(this).find('td').eq(0).html();
            obj.expense = $(this).find('td').eq(1).html();
            obj.ARPU = $(this).find('td').eq(2).html();
            obj.username = cur.username;
            obj.search_name = cur.username;
            obj.gmt_create = new Date();
            obj.gmt_modified = new Date();
            obj.modify_increase = Number(obj.increase) * ( 1 - cur.increase_decrement );
            obj.modify_expense = Number(obj.expense) * ( 1 - cur.expense_decrement );
            obj.modify_ARPU = obj.modify_expense / obj.modify_increase;
            arr.push(obj);
        });
    } catch(e) {

    }

};

const crawlCurrent2 = function*( cur ) {
    var loginResult, result, option;

    option = optionArr[1];

    try {
        loginResult  = yield thunkRequestPost({
            url: option.loginUrl,
            form: {
                username: cur.username,
                password: cur.password
            }
        });

        result = yield thunkRequestPost({
            url: option.currentUrl,
            headers: {
                'cookie': loginResult[0].headers['set-cookie']
            }
        });

        var $ = cheerio.load(result[0].body);

        $('.bdrcontent tr').each(function() {
            var obj = {};
            var num = $(this).find('td').eq(3).html();
            var name = $(this).find('td').eq(2).html();
            if ( Number(num) && name ) {
                obj.increase = $(this).find('td').eq(3).html();
                obj.expense = $(this).find('td').eq(4).html().split(';')[1];
                obj.ARPU = $(this).find('td').eq(5).html();
                obj.username = $(this).find('td').eq(1).html();;
                obj.search_name = cur.username;
                obj.gmt_create = new Date();
                obj.gmt_modified = new Date();
                obj.modify_increase = Number(obj.increase) * ( 1 - cur.increase_decrement );
                obj.modify_expense = Number(obj.expense) * ( 1 - cur.expense_decrement );
                obj.modify_ARPU = obj.modify_expense / obj.modify_increase;
                arr.push(obj);
            }
        });
    } catch (e) {

    }
};

const saveToCurrent = function*() {

    for ( var i = 0, r = arr.length; i < r; i++ ) {
        var cur = arr[i];
        yield currentService.upsert(cur, {
            username: cur.username
        });
    }
    arr = [];

};



module.exports = function*() {

    yield getAllChannel();

};