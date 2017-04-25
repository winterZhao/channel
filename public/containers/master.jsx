'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MasterComp from '../components/master-container.jsx';
import { masterStore } from '../store/index.jsx';

var rootEle = document.querySelector('#root');
var render = function() {
    ReactDOM.render(
        <MasterComp/>,
        rootEle
    )
};

render();
masterStore.subscribe(render);

