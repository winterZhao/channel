'use strict';
//var $ = require('../lib/jquery.js');
var $ = require("jquery");
require('../lib/bootstrap/js/bootstrap.min.js');
require('../lib/bootstrap-datetimepicker.js');
require('../lib/jquery.nicescroll.js');
require('../lib/scripts.js');

var breadCrumbTpl = require('../tpl/bread-crumb.hbs');
var modifyPasswordTpl = require('../tpl/modify-password.hbs');
var currentList = require('../tpl/channel-current-list.hbs');
var channelHistoryList = require('../tpl/channel-history-list.hbs');
var pagination = require('../tpl/pagination.hbs');

var obj = {
    attr: {
        options: {},
    },
    render: function() {
        this.bindClickEvent();
        this.getNotify();

    },
    bindClickEvent: function() {
        var _self = this;
        $('body').on('click', '#notify', _self.getNotify);
        $('body').on('click', '#modify-password', _self.getModifyPassword.bind(this));
        $('body').on('click', '#submit-password', _self.modifyPassword.bind(this));
        $('body').on('click', '#current-data', _self.getCurrentData.bind(this));
        $('body').on('click', '#history-data', _self.historyDataShow.bind(this, {}));
        $('body').on('click', '#search-history', _self.searchHistory.bind(this));
        $('body').on('click', '[data-role= page]', _self.changePage.bind(this));
        $('body').on('click', '[data-role = previous]', _self.changeToPrevious.bind(this));
        $('body').on('click', '[data-role = next]', _self.changeToNext.bind(this));
        $('body').on('click', '#sign-out', _self.signOut.bind(this));
        //$('body').on('click', '#selstarttime', _self.getStartTime.bind(this));
    },
    getStartTime: function() {

    },
    // 点击翻页
    changePage: function(e) {
        var page = $(e.target).attr('data-page')  || '0';
        this.attr.options.limit = this.attr.options.limit || '10';
        this.attr.options.offset = Number(this.attr.options.limit) * (Number(page) - 1);
        this.historyDataShow(this.attr.options);
    },
    changeToPrevious: function() {

        var currentPage;

        $('[data-role = page]').each( function() {
            if ($(this).hasClass('active')) {
                currentPage = $(this).find('a').attr('data-page');
            }
        });

        currentPage -- ;
        currentPage = currentPage < 1 ? 1 : currentPage;
        this.attr.options.limit = this.attr.options.limit || '10';
        this.attr.options.offset = Number(this.attr.options.limit) * (Number(currentPage) - 1);
        this.historyDataShow(this.attr.options);

    },
    changeToNext: function() {
        var currentPage,len;

        $('[data-role = page]').each( function() {
            if ($(this).hasClass('active')) {
                currentPage = $(this).find('a').attr('data-page');
            }
        });

        currentPage ++ ;
        len = $('[data-role = page]').length;
        currentPage = currentPage > len ? len : currentPage;
        this.attr.options.limit = this.attr.options.limit || '10';
        this.attr.options.offset = Number(this.attr.options.limit) * (Number(currentPage) - 1);
        this.historyDataShow(this.attr.options);
    },
    getCurrentData: function() {
        $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '实时数据'}));
        $.ajax({
            url: '/channel/data/current',
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    $('#content').html(currentList({data: json}));
                } else {
                    alert('获取当前数据失败,请重试!');
                }
            }
        })
    },
    // 获取搜索历史数据的query;
    searchHistory: function() {
        var options = this.attr.options =  {};
        options.starttime = $('#selstarttime').val();
        options.endtime = $('#selendtime').val();
        options.limit = $('#sellength').val();
        options.offset = 0;
        options.search_name = $('#content').attr('data-username');
        this.historyDataShow(options);
    },
    historyDataShow: function( options, e ) {
        var str, count,arr = [],
            _self = this;

        options = options || {};
        $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '历史数据'}));

        $.ajax({
            url: '/channel/data/history',
            type: 'GET',
            data: options,
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    str = channelHistoryList({data: json});
                    options.limit = options.limit || '10';
                    count = Number(json.length) / Number(options.limit);
                    for ( var i = 1, r = count + 1; i < r; i++ ) {
                        arr.push(i);
                    }

                    str += pagination({count: arr})
                    $('#content').html(str);
                    var currentPage = Number( _self.attr.options.offset ) / Number(_self.attr.options.limit) || 0;

                    $('[data-role = page]').eq(currentPage).addClass('active').siblings().removeClass('active');

                    $('#selstarttime').datetimepicker({
                        format: 'yyyy-mm-dd',
                        minView: 2,
                        autoclose: true
                    });
                    $('#selendtime').datetimepicker({
                        format: 'yyyy-mm-dd',
                        minView: 2,
                        autoclose: true
                    });
                } else {
                    alert('获取历史数据失败,请稍后重试!');
                }
            }
        })
    },

    getModifyPassword: function() {
        $('#header').html(breadCrumbTpl({title: '系统', subTitle: '重置密码'}));
        $('#content').html(modifyPasswordTpl({}));
    },
    modifyPassword: function() {
        var obj = {};
        obj.username = $('#content').attr('data-username');
        obj.prevPassword = $('#previous-password').val();
        obj.password = $('#new-password').val();
        $.ajax({
            url: '/channel/password/modify',
            type: 'POST',
            data: obj,
            success: function(json) {
                json = JSON.parse(json);

                if ( json.success ) {
                    alert('密码更新成功!');
                    location.href = '/login';
                } else {
                    alert('服务器错误,请重试!');
                }
            },
            error: function() {
                alert('服务器错误,新重试!');
            }
        })
    },
    getNotify: function() {
        var url = '/notify';
        $('#header').html(breadCrumbTpl({title: '首页', subTitle: '消息通知'}));

        $.ajax({
            url: url,
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    $('#content').html( json.data );
                } else {
                    alert('服务器错误,获取消息失败,请重试!');
                }
            },
            error: function() {
                alert('通知获取失败,请刷新页面!');
            }
        })
    },
    // 用户登出;
    signOut: function() {

        $.ajax({
            url: '/signout',
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    location.href = '/login';
                }
            }
        })
    }
}

obj.render();