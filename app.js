
const koa = require('koa');
const app = koa();
const Route = require('./router');
const path = require('path');
const bodyParser = require('koa-body-parser');
const View = require('koa-views');
const Logger = require('koa-logger');
const Static = require('koa-static');
const StaticCache = require('koa-static-cache');
const session = require('koa-session');
const fork = require('child_process').fork;

const getClientIP = require('./middleware/getClientIP');

app.use(Logger());
app.use(bodyParser());
app.keys = ['abcd'];
var config = {
    key: 'sessionid', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true
};
app.use(session(config, app));

// 访问当前页时爬取实时数据

// 将渠道商ip存入数据库;
app.use(getClientIP);

// 不需要缓存
app.use(Static(path.resolve(__filename, '../public'), {
    maxage: 24 * 60 * 60
}));




// 需要缓存
// app.use(StaticCache(path.resolve(__dirname, 'public'), {
//    maxAge: 24 * 60 * 60
// }));


app.use(View(__dirname + '/views', {
    default: 'dust'
}));


Route(app);

 fork('./middleware/crawl.js');

app.listen(2000, function() {
    console.log('ok');
});