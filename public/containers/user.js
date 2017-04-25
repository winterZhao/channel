'use strict';

var $ = require('jquery');

var addUserTpl = require('../tpl/add-user.hbs');
var searchTpl = require('../tpl/search.hbs');
var breadCrumbTpl = require('../tpl/bread-crumb.hbs');
var userTpl = require('../tpl/user.hbs');
var pagination = require('./pagination');

var User = {
    render: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var _self = this;
        $('body').on('click', '#channel-list', _self.getChannelList.bind(this));
        $('body').on('click', '#add-channel', _self.addChannelShow.bind(this));
        $('body').on('click', '#add-new-channel', _self.addChannelToServer.bind(this));
        $('body').on('click', '#search-user', _self.getSearchChannel.bind(this));
        $('body').on('click', '[data-role=edit-user]', _self.modifyChannel.bind(this));
    },
    // 获取渠道列表;
    getChannelList: function() {
        var str='', count,arr = [],
            _self = this,
            options = {};

        options.limit = 10;
        options.offset = 0;
        $.ajax({
            url: '/master/channel/list',
            type: 'GET',
            data: options,
            success: function(json) {
                json = JSON.parse(json);
                if ( json.success ) {
                    $('#header').html(breadCrumbTpl({title: '渠道数据', subTitle: '用户列表信息'}));
                    count = Math.round(json.count / options.limit);
                    str = userTpl({dataList: json.dataList});
                    $('#content').html(str);
                    str += pagination.renderTpl(count);

                    _self.getPaginationList();
                } else {
                    alert('获取用户信息失败,请稍后重试!');
                }
            }
        })
    },
    getPaginationList: function() {
        pagination.bindEvent( function(page) {
            var str = '',options = {};
            options.limit = 10;
            options.offset = options.limit * (Number(page) - 1);
            $.ajax({
                url: '/master/channel/list',
                type: 'GET',
                data: options,
                success: function(json) {
                    json = JSON.parse(json);
                    if ( json.success ) {
                        str += userTpl({dataList: json.dataList});
                        $('#table_wrapper').html(str);
                    } else {
                        alert('获取用户信息失败,请稍后重试!');
                    }
                }
            })
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
    // 根据用户名查看用户信息;
    getSearchChannel: function() {
        var _self = this,
            tpl = '',
            url = '/master/search/channel',
            obj = {};
        obj.name = $('#selname').val().trim();

        $.ajax({
            url: url,
            type: 'GET',
            data: obj,
            success: function(json) {
                json = JSON.parse(json);
                if (json.success) {
                    tpl = userTpl({dataList: json.dataList});
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
    // 修改用户信息;
    modifyChannel: function(e) {
        var data = {},
            targetEle = $(e.target),
            targetLiEle = targetEle.parents('tr'),
            flag = targetEle.attr( 'data-edit' );

        if ( flag === 'true' ) {
            targetEle.parents('tr.gradeA').attr( 'contenteditable', true).css({
                'backgroundColor': '#ccc'
            });
            targetEle.val('保存').attr( 'data-edit', 'false');

        } else {
            data.id = targetLiEle.find('td').eq(0).text()
            data.username = targetLiEle.find('td').eq(1).text();
            data.password = targetLiEle.find('td').eq(2).text();
            data.rank = targetLiEle.find('td').eq(3).text();
            data.modify_increase = targetLiEle.find('td').eq(4).text();;
            data.modify_expense = targetLiEle.find('td').eq(5).text();;
            data.search_name = targetLiEle.find('td').eq(6).text();
            data.crawl_url = targetLiEle.find('td').eq(7).text();

            $.ajax({
                url: '/master/newchannel',
                type: 'POST',
                data: data,
                success: function(json) {
                    json = JSON.parse(json);
                    targetEle.val('编辑').attr( 'data-edit', 'true');
                    if ( json.success ) {
                        alert('修改数据成功');
                        location.reload();
                    } else {
                        alert('修改数据失败,请重试');
                    }

                }
            })
        }
    }
}

module.exports = User;