'use strict';

var $ = require('jquery');
var breadCrumbTpl = require('../tpl/bread-crumb.hbs');
var sendNotifyTpl = require('../tpl/send-notify.hbs');


var notify = {
    render: function() {
        this.bindEvent();
        this.getNotify();
    },
    bindEvent: function() {
        var _self = this;
        $('body').on('click', '#notify', _self.writeNotify.bind(this));
        $('body').on('click', '#send-msg', _self.sendNotify.bind(this));
    },
    // 通知页面展示;
    getNotify: function() {
        var url = '/notify';
        $('#header').html(breadCrumbTpl({title: '首页', subTitle: '消息通知'}));

        $.ajax({
            url: url,
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if (json.success) {
                    $('#content').html(json.data);
                } else {
                    alert('服务器错误,获取消息失败,请重试!');
                }
            },
            error: function() {
                alert('通知获取失败,请刷新页面!');
            }
        });

    },
    // 管理员写通知页面展示;
    writeNotify: function() {
        $('#header').html(breadCrumbTpl({title: '首页', subTitle: '消息通知'}));
        $('#content').html(sendNotifyTpl());
    },
    // 管理员写好发送通知
    sendNotify: function() {
        var obj = {},
            url = '/notify';

        obj.data = $('#notify-msg').val();

        $.ajax({
            url: url,
            type: 'POST',
            data: obj,
            success: function(json) {
                json = JSON.parse(json);
                if (json.success) {
                    alert('发送成功');
                }
            },
            error: function(err) {
                alert('发送失败,请重新发送');
            }
        });
    }
};


module.exports = notify;