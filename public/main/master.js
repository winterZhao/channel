'use strict';
var $ = require('jquery');
require('../lib/bootstrap/js/bootstrap.min.js');
require('../lib/jquery.nicescroll.js');
require('../lib/scripts.js');
require('../lib/bootstrap-datetimepicker.js');

var addUserTpl = require('../tpl/add-user.hbs');
var searchTpl = require('../tpl/search.hbs');
var breadCrumbTpl = require('../tpl/bread-crumb.hbs');
var sendNotifyTpl = require('../tpl/send-notify.hbs');
var currentList = require('../tpl/admin-current-list.hbs');
var adminHistoryList = require('../tpl/admin-history-list.hbs');
var pagination = require('../tpl/pagination.hbs');
var ipTpl = require('../tpl/ip.hbs');
var userTpl = require('../tpl/user.hbs');


var obj = {
    attr: {
        options: {},
        index: 1,   // 分页发送ajax方向,1为历史数据;2为渠道登录信息;
    },
    render: function() {
        this.bindClickEvent();
        this.getNotify();

    },
    // 事件绑定;
    bindClickEvent: function() {
        var _self = this;
        $('body').on('click', '#notify', _self.writeNotify.bind(this));
        $('body').on('click', '#send-msg', _self.sendNotify.bind(this));
        $('body').on('click', '#channel-list', _self.getChannelList.bind(this));
        $('body').on('click', '#add-channel', _self.addChannelShow.bind(this));
        $('body').on('click', '#add-new-channel', _self.addChannelToServer.bind(this));
        $('body').on('click', '#modify-channel', _self.modifyChannelShow.bind(this));
        $('body').on('click', '#current-data', _self.currentDataShow.bind(this));
        $('body').on('click', '#history-data', _self.historyDataShow.bind(this, {}));
        $('body').on('click', '#search-history', _self.searchHistory.bind(this));
        $('body').on('click', '[data-role = edit]', _self.editHistory.bind(this));
        $('body').on('click', '[data-role= page]', _self.changePage.bind(this));
        $('body').on('click', '[data-role = previous]', _self.changeToPrevious.bind(this));
        $('body').on('click', '[data-role = next]', _self.changeToNext.bind(this));
        $('body').on('click', '.form_datetime', _self.datePicker.bind(this));
        $('body').on('click', '#login-msg', _self.getIps.bind(this, {}));
        $('body').on('click', '#sign-out', _self.signOut.bind(this));



    },
    getChannelList: function() {
        var str = '';
        $.ajax({
            url: '/master/channel/list',
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '用户列表信息'}));

                    str += userTpl({dataList: json.dataList});
                    $('#content').html(str);

                } else {
                    alert('获取用户信息失败,请稍后重试!');
                }
            }
        })
    },
    getIps: function(options,e) {
        var str, count,arr = [],
            _self = this;
        this.attr.index = 1;
        options = options || {};
        $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '渠道登录信息'}));

        $.ajax({
            url: '/master/channel/ip',
            type: 'GET',
            data: options,
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    str = ipTpl({dataList: json.data});
                    options.limit = options.limit || '10';
                    count = Number(json.length) / Number(options.limit);
                    for ( var i = 1, r = count + 1; i < r; i++ ) {
                        arr.push(i);
                    }

                    str += pagination({count: arr})
                    $('#content').html(str);
                    var currentPage = Number( _self.attr.options.offset ) / Number(_self.attr.options.limit) || 0;

                    $('[data-role = page]').eq(currentPage).addClass('active').siblings().removeClass('active');

                } else {
                    alert( '服务器错误,请稍后重试!' );
                }
            }
        })
    },
    // 点击翻页
    changePage: function(e) {
        var page = $(e.target).attr('data-page')  || '0';
        this.attr.options.limit = this.attr.options.limit || '10';
        this.attr.options.offset = Number(this.attr.options.limit) * (Number(page) - 1);

        if ( this.attr.index === 1 ) {
            this.historyDataShow(this.attr.options);
        } else {
            this.getIps(this.attr.options);
        }

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

        if ( this.attr.index === 1 ) {
            this.historyDataShow(this.attr.options);
        } else {
            this.getIps(this.attr.options);
        }

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

        if ( this.attr.index === 1 ) {
            this.historyDataShow(this.attr.options);
        } else {
            this.getIps(this.attr.options);
        }
    },
    // 编辑修改历史数据;
    editHistory: function(e) {

        var data = {},
            targetEle = $(e.target),
            targetLiEle = targetEle.parents('tr'),
            modifyIncreaseEle = targetLiEle.find('td').eq(4),
            expenseIncreaseEle = targetLiEle.find('td').eq(5),
            flag = targetEle.attr( 'data-edit' );

        if ( flag === 'true' ) {

            var oInput1 = document.createElement('input'),
                oInput2 = document.createElement('input');

            oInput1.value = modifyIncreaseEle.html();
            oInput2.value = expenseIncreaseEle.html();
            modifyIncreaseEle.html(oInput1);
            expenseIncreaseEle.html(oInput2);
            targetEle.val('保存').attr( 'data-edit', 'false');

        } else {

            data.modify_increase = modifyIncreaseEle.find('input').val();
            data.modify_expense = expenseIncreaseEle.find('input').val();
            data.modify_ARPU =  data.modify_expense/data.modify_increase;
            data.id = targetLiEle.attr('data-id');
            $.ajax({
                url: '/master/data/history',
                type: 'POST',
                data: data,
                success: function(json) {
                    json = JSON.parse(json);
                    targetEle.val('编辑').attr( 'data-edit', 'true');
                    if ( json.success ) {
                        alert('修改数据成功');
                    } else {
                        alert('修改数据失败,请重试');
                    }

                }
            })
        }
    },
    // 获取搜索历史数据的query;
    searchHistory: function() {
        var options = this.attr.options =  {};
        options.starttime = $('#selstarttime').val();
        options.endtime = $('#selendtime').val();
        options.limit = $('#sellength').val();
        options.offset = 0;
        options.search_name = $('#selname').val();
        this.historyDataShow(options);
    },
    // 绑定选择日期方法
    datePicker: function() {
        $('.form_datetime').datetimepicker();
    },
    // 历史数据页面展示;
    historyDataShow: function(options,e) {
        var str, count,arr = [],
            _self = this;
        this.attr.index = 1;
        options = options || {};
        $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '历史数据'}));

        $.ajax({
            url: '/master/data/history',
            type: 'GET',
            data: options,
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    str = adminHistoryList({data: json});
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
    // 实时数据页面展示;
    currentDataShow: function() {
        $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '实时数据'}));
        $.ajax({
            url: '/master/data/current',
            type: 'GET',
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    $('#content').html(currentList({data: json}));

                }
            }
        })
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
    },
    // 增加渠道用户页面展示
    addChannelShow: function() {
        $('#header').html(breadCrumbTpl({title: '系统', subTitle: '增加渠道用户'}));
        $('#content').html(addUserTpl({}));
    },
    // 增加渠道用户
    addChannelToServer: function() {
        var data = {},
            url = '/master/newchannel';
        data.username = $('#username').val();
        data.password = $('#password').val();
        data.rank = $('#rank').val();
        data.increase = $('#increase').val() || 0;
        data.expense = $('#expense').val() || 0;
        data.searchname = $('#searchname').val();
        data.crawl_url = $('#crawl-url').val();
        data.isNew = $('#add-new-channel').attr('data-new') ? true: false;   // 新用户注册;



        if (!data.username) {
            $('#username').parents('.form-group').addClass('has-error');
            alert('渠道名不能为空');
            return;
        } else  {
            $('#username').parents('.form-group').removeClass('has-error');
        }
        if (!data.password) {
            $('#password').parents('.form-group').addClass('has-error');
            alert('渠道密码不能为空');
            return;
        } else {
            $('#password').parents('.form-group').removeClass('has-error');
        }
        if (data.rank === '管理员') {
            data.rank = 1;
        } else {
            data.rank = 2;
        }

        if ( data.crawl_url === 'geek-maker' ) {
            data.crawl_url = 1;
        } else {
            data.crawl_url = 2;
        }

        if (isNaN(Number(data.increase))) {
            $('#increase').parents('.form-group').addClass('has-error');
            alert('新增扣量必须为数字');
            return;
        }
        if (isNaN(Number(data.expense))) {
            $('#exprense').parents('.form-group').addClass('has-error');
            alert('新增金额必须为数字');
            return;
        }
        if (!data.searchname) {
            $('#searchname').parents('.form-group').addClass('has-error');
            alert('渠道搜索名不能为空');
            return;
        } else {
            $('#searchname').parents('.form-group').removeClass('has-error');
        }

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(json) {
                json = JSON.parse(json);

                if ( json.success ) {
                    if ( data.isNew ) {
                        alert('渠道创建成功!')
                    } else {
                        alert('渠道修改成功!');
                    }
                } else {
                    if ( data.isNew ) {
                        if ( json.code && json.code == 2000 ) {
                            alert('渠道名已存在,请重新输入')
                        } else {
                            alert('渠道创建失败!')
                        }
                    } else {
                        alert('渠道修改失败!');
                    }

                }
                location.reload();
            },
            error: function(err) {
                alert('网络错误,请重试!');
            }
        });
    },
    // 修改用户信息展示
    modifyChannelShow: function() {
        var _self = this;
        $('#header').html(breadCrumbTpl({title: '系统', subTitle: '修改渠道信息'}));
        $('#content').html(searchTpl({name: '渠道'}));

        $('#search').on('click', _self.getSearchChannel.bind(this));
    },
    // 根据用户名查看用户信息;
    getSearchChannel: function() {
        var _self = this, tpl,
            url = '/master/search/channel',
            obj = {};
        obj.name = $('[data-role=search-text]').val().trim();

        $.ajax({
            url: url,
            type: 'GET',
            data: obj,
            success: function(json) {
                json = JSON.parse(json);
                if (json.success) {
                    tpl = addUserTpl(json.data);
                    $('#content').html(tpl);
                } else {
                    alert('查无此人,请重新输入渠道名');
                }
            },
            error: function(err) {
                alert('网络错误,请重新搜索!');
            }
        });

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
};

obj.render();