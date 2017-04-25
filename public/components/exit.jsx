'use strict';

import React from 'react';
import { channelStore } from '../store/index.jsx';

class ContentContainer extends React.Component {
    constructor(props) {
        super(props);
        // 对应的模块是否显示;
        this.state = {
            notify: false,
            currentData: false,
            historyData: false,
            user: false
        }
    }
    componentWillReceiveProps() {
        location.href ='/login';
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}

export default ContentContainer