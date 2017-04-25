'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import LoginComp from '../components/login-container.jsx';

var rootEle = document.querySelector('#root');

ReactDOM.render(
    <LoginComp/>,
    rootEle
)
