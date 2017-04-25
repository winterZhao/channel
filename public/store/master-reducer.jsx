
import { createStore } from 'redux';


/*
 * 用户
 *channelStore —— state
 * 1: 消息通知;
 * 2: 实时数据
 * 3: 历史数据
 * 4: 用户退出;
 * 5: 写通知;
 * 6: 获取ip;
 * 7: 增加用户
 * 8: 用户列表;
 */

const masterReducer = ( state, action ) => {

    var type = action.type;
    switch (type) {
        case 'master':
            return 'm' + action.num;
        default:
            return 'm';
    }

}

const masterStore = createStore(masterReducer, 'm');


export default masterStore;