'use strict';

/*
 * 获取当天的0:0:0和前一天的0:0:0;
 */

const obj = {

    crawlTime() {
        var currentTimeStamp, oldTimeStamp, dateObj = {};

        currentTimeStamp = new Date().getTime();
        oldTimeStamp = currentTimeStamp - 86400000;

        dateObj.starttime = obj.timeFormat(oldTimeStamp, '-');
        dateObj.endtime = obj.timeFormat(currentTimeStamp, '-');

        return dateObj;
    },
    /*
     * @params 入参,传入new Date()的参数;
     * @params 入参,传入format格式
     * @return 出参 对应的时间格式;
     * 时间格式: 2017-03-30 00:00
     */
    timeFormat( timeStamp, format ) {
        var date, currentTimeStamp, year, month, day, str,
            obj = {};

        format = format || '-';

        date = new Date(timeStamp);
        currentTimeStamp = new Date().getTime();

        year = date.getFullYear();
        month = date.getMonth() + 1;
        month = month >= 10 ? month : '0' + month;
        day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        str = '' + year + format + month + format + day;
        return str;
    }
};

module.exports = obj;