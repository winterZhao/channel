
import { createStore } from 'redux';

const userReducer = ( state, action ) => {

    var type = action.type;
    switch (type) {
        case 'user':
            return action.msg;
        default:
            return '';
    }

}

const userStore = createStore(userReducer, '');


export default userStore;