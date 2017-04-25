
const router = require('koa-router')();
const loginRouter = require('./login');
const masterRouter = require('./master');
const channelRouter = require('./channel');
const notifyRouter = require('./notify');

module.exports = function (app) {

    router.get('/', function*() {
        this.redirect('/login');
    });

    // 获取登录页面
    router.get('/login', loginRouter.getLogin);
    // 用户登录
    router.post('/login', loginRouter.postLogin);
    // 用户退出
    router.get('/signout', loginRouter.signOut);

    // 所有人获取通知;
    router.get('/notify', notifyRouter.getNotify);
    // 管理员发送通知
    router.post('/notify', notifyRouter.postNotify);

    // 管理员界面
    router.get('/master', masterRouter.getContent);
    // 管理员查询访问者ip;
    router.get('/master/channel/ip', masterRouter.getChannelIp);
    // 管理员查询实时数据
    router.get('/master/data/current', masterRouter.getCurrentData);
    // 管理员查询历史数据
    router.get('/master/data/history', masterRouter.getHistoryData);
    // 管理员修改历史数据
    router.post('/master/data/history', masterRouter.postHistoryData);
    // 管理员添加渠道
    router.post('/master/newchannel', masterRouter.postNewUser);
    // 管理员搜索渠道的个人信息;
    router.get('/master/search/channel', masterRouter.seachChannel);
    router.get('/master/channel/list', masterRouter.getChannelList);

    // 渠道商获取内容
    router.get('/channel', channelRouter.getContent);
    // 渠道商获取实时数据
    router.get('/channel/data/current', channelRouter.getCurrentData);
    // 渠道商获取历史数据
    router.get('/channel/data/history', channelRouter.getHistoryData);
    // 渠道商修改密码
    router.post('/channel/password/modify', channelRouter.modifyPassword);

    app.use(router.routes())
        .use(router.allowedMethods());
};