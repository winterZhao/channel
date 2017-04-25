'use strict';

var paginationTpl = require('../tpl/pagination.hbs');

var pagination = {
    attr: {
        count: 0
    },
    /*
     * 渲染模板字符串;
     * params: NUM, 数据总长度;
     * return: str, 字符串模板;
     */
    renderTpl: function(count) {
        var arr = [];
        for ( var i = 0, r = count; i < r; i++ ) {
            arr.push(i + 1);
        }
        return paginationTpl({count: arr});
    },
    /*
     * 绑定事件
     * params: 点击按钮执行的回调;
     */
    bindEvent: function(ele,callback) {
        var _self = this;
        $(ele).on('click', '[data-role= page]', _self.changePage.bind(this,callback));
        $(ele).on('click', '[data-role = previous]', _self.changeToPrevious.bind(this));
        $(ele).on('click', '[data-role = next]', _self.changeToNext.bind(this));
    },
    // 点击翻页
    changePage: function(callback,e) {
        var page = $(e.target).attr('data-page')  || '0';
        $('[data-role = page]').eq(page).addClass('active').siblings().removeClass('active');
        callback(page);
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
        $('[data-role = page]').eq(currentPage).addClass('active').siblings().removeClass('active');
        callback(currentPage);
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
        $('[data-role = page]').eq(currentPage).addClass('active').siblings().removeClass('active');
        callback(currentPage);
    },
}


module.exports = pagination;