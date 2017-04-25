
import { createStore } from 'redux';


/*
 * 用户
 *channelStore —— state
 * 1: 消息通知;
 * 2: 实时数据
 * 3: 历史数据
 * 4: 用户退出
 */

const reducerChannel = ( state, action ) => {

    var type = action.type;
    switch (type) {
        case 'channel':
            return 'c' + action.num;
        default:
            return 'c';
    }

}

const channelStore = createStore(reducerChannel, 'c');


export default channelStore;