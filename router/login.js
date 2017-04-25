'use strict';

const decryption = require('../middleware/encryption');
const userService = require('../service/user');

const loginRouter = {
    // 登录界面;
    *getLogin() {
        yield this.render('login.html');
    },
    // 校验登录信息;
    *postLogin() {
        var result,username,password,
            obj = {};

        try {

            if ( this.request.body ) {
                username = this.request.body.username,
                password = this.request.body.password;

                result = yield userService.findOne({
                    username: username
                });

                if ( result ) {
                    result.password = decryption.decrypt( result.password );
                    if ( result.password === password ) {
                        this.session.username = username;
                        if (result.rank === '1') {
                            this.session.status = 'master';
                            this.redirect('/master');
                            this.status = 302;
                        } else  {
                            this.session.status = 'channel';
                            this.redirect('/channel');
                            this.status = 302;
                        }
                    } else {
                        this.redirect('/login?flag=true');
                        this.status = 302;
                    }
                } else {
                    this.redirect('/login?flag=true');
                    this.status = 302;
                }
            } else {
                this.redirect('/login?flag=true');
                this.status = 302;
            }
        } catch( e ) {
            this.redirect('/login?flag=true');
            this.status = 302;
        }

    },
    // 用户登出;
    *signOut() {
        var json = {};

        this.session = null;
        json.success = true;
        this.body = JSON.stringify(json);
    }
};


module.exports = loginRouter;