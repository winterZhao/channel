'use strict';



const co = require('co');
const crawlCurrent = require('./crawl-current');
const crawlHistory = require('./crawl-history');

setInterval(function() {
    co(crawlCurrent());
}, 3000);


setInterval(function() {
    co(crawlHistory());
}, 3600000);



