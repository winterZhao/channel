'use strict';


const userModel = require('../model/user');
const thunkify = require('thunkify');
const fs = require('fs');


const notifyRouter = {
    // 获取通知信息;
    *getNotify() {
        var result,
            json = {},
            read = thunkify(fs.readFile);

        try {
            result = yield read('config/notify.txt', 'utf8');
            json.success = true;
            json.username = this.session.username;
            json.data = result;
        }   catch(e) {
            json.success = false;
        }
        this.body = JSON.stringify(json);
    },
    // 发送通知信息;
    *postNotify() {
        var result,
            json = {},
            data = this.request.body.data,
            writeFile = thunkify(fs.writeFile);

        try {
            result = yield writeFile('config/notify.txt', data);
            json.success = true;
        } catch(e) {
            json.success = false;
        }
        this.body = JSON.stringify(json);
    }

};


module.exports = notifyRouter;