'use strict';
/*
 * 爬取前一天的历史记录并保存到数据库
 */

const request = require('request');
const cheerio = require('cheerio');
const thunkify = require('thunkify');

const userService = require('../service/user');
const historyService = require('../service/history');

const optionArr = require('../config/common').crawl;
const formatDate = require('../middleware/format-date').crawlTime;
const encryption = require('../middleware/encryption');

const thunkRequest = thunkify(request);
const thunkRequestPost = thunkify(request.post);

var arr = [];

const getAllChannel = function*() {

    var userList = yield userService.findAll({});

    var searchDate = formatDate();

    for ( let i = 0, r = userList.length; i < r; i ++ ) {
        let cur = userList[i];

        if ( Number(cur.rank) === 2 ) {

            cur.crawl_url = Number( cur.crawl_url );
            cur.password = encryption.decrypt( cur.password );

            if ( cur.crawl_url === 1 ) {
                yield crawlHistory1( cur, searchDate );
            } else {
                yield crawlHistory2( cur, searchDate );
            }
        }
    }
    yield saveToHistory();

};

const crawlHistory1 = function*( cur, searchDate ) {
    var loginResult, result, option;

    option = optionArr[0];

    loginResult  = yield thunkRequestPost({
        url: option.loginUrl,
        form: {
            account: cur.username,
            pwd: cur.password
        }
    });

    result = yield thunkRequestPost({
        url: option.historyUrl,
        headers: {
            'cookie': loginResult[0].headers['set-cookie'],
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
        },
        form: {
            starttime: searchDate.starttime + ' 00:00',
            endtime: searchDate.endtime + ' 00:00'
        }
    });

    var $ = cheerio.load(result[0].body);
    $('#my_tbody tr').each(function() {
        var obj = {};
        obj.increase = $(this).find('td').eq(0).html();
        obj.expense = $(this).find('td').eq(1).html();
        obj.ARPU = $(this).find('td').eq(2).html();
        obj.crawl_time = new Date( searchDate.starttime );
        obj.username = cur.username;
        obj.search_name = cur.username;
        obj.gmt_create = new Date();
        obj.gmt_modified = new Date();
        obj.modify_increase = Number( obj.increase ) * ( 1 - cur.increase_decrement );
        obj.modify_expense = Number( obj.expense ) * ( 1 - cur.expense_decrement );
        obj.modify_ARPU = obj.modify_expense / obj.modify_increase;
        arr.push(obj);
    });
};

const crawlHistory2 = function*( cur, searchDate ) {
    var loginResult, result, option, url;
    option = optionArr[1];

    loginResult  = yield thunkRequestPost({
        url: option.loginUrl,
        form: {
            username: cur.username,
            password: cur.password
        }
    });

    url  = option.historyUrl + '?s=WapData%2Fwap_data_code&date=' + searchDate.starttime + '&date_end=' + searchDate.starttime;

    var opt = {
        url: url,
        headers: {
            'cookie': loginResult[0].headers['set-cookie']
        }
    };

    result = yield thunkRequest(opt);

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
            obj.crawl_time = new Date( searchDate.starttime );
            obj.modify_increase = Number(obj.increase) * ( 1 - cur.increase_decrement );
            obj.modify_expense = Number(obj.expense) * ( 1 - cur.expense_decrement );
            obj.modify_ARPU = obj.modify_expense / obj.modify_increase;
            arr.push(obj);
        }
    });
};



const saveToHistory = function*() {
    for ( var i = 0, r = arr.length; i < r; i++ ) {
        var cur = arr[i];
        yield  historyService.create(cur);
    }
    arr = [];
};



module.exports = function*() {

    yield getAllChannel();

};