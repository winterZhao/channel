'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MasterComp from './master-container.jsx';
import { masterStore, userStore } from '../store/index.jsx';

var rootEle = document.querySelector('#root');
var render = function() {
    ReactDOM.render(
        <MasterComp/>,
        rootEle
    )
};

render();
masterStore.subscribe(render);
userStore.subscribe(render);

