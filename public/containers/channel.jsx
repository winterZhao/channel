'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ChannelComp from '../components/channel-container.jsx';
import { channelStore } from '../store/index.jsx';

var rootEle = document.querySelector('#root');
var render = function() {
    ReactDOM.render(
        <ChannelComp/>,
        rootEle
    )
};

render();
channelStore.subscribe(render);

