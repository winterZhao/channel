'use strict';


var $ = require('jquery');
var breadCrumbTpl = require('../tpl/bread-crumb.hbs');

var ipObject = {
    render: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var _self = this;
        $('body').on('click', '#login-msg', _self.getIps.bind(this, {}));
    },
    getIps: function() {
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
    }
}

module.exports = ipObject;