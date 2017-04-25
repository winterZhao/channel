'use strict';

module.exports = {
    // 初始化管理员账号
    account: {
        username: 'root',
        password: '123456',
        rank: 1,
    },
    // 加密解密的秘钥;
    secret: 'diwen',
    crawl: [
        {
            loginUrl: 'http://union.geek-maker.com/union/login.do',
            currentUrl: 'http://union.geek-maker.com/union/channel/nowdatapage.do',
            historyUrl: 'http://union.geek-maker.com/union/channel/historydatapage.do'
        },
        {
            loginUrl: 'http://www.saidewx.com:10087/admin.php?s=/login/dologin.html',
            currentUrl: 'http://www.saidewx.com:10087/admin.php?s=/wap_data/wap_data_code.html',
            historyUrl: 'http://www.saidewx.com:10087/admin.php'
        }

    ]
}