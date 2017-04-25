'use strict';

import React from 'react';
import GetNotify from '../components/get-notify.jsx';
import WriteNotify from '../components/write-notify.jsx';
import AddUser from '../components/add-user.jsx';
import UserList from '../components/user-list.jsx';
import GetIps from '../components/get-ips.jsx';
import ShowTable from '../components/show-table.jsx';
import EditTable from '../components/edit-table.jsx';
import Search from '../components/search.jsx';
import { channelStore , masterStore } from '../store/index.jsx';

class ContentContainer extends React.Component {
    constructor(props) {
        super(props);
        // 对应的模块是否显示;
        this.state = {
            notify: true,
            writeNotify: false,
            currentData: false,
            historyData: false,
            getIps: false,
            userList: false,
            addUser: false
        }
    }
    componentWillReceiveProps() {
        var channelValue = channelStore.getState(),
            masterValue = masterStore.getState();

        if ( /\d/g.test( channelValue )) {

            switch(channelValue) {
                case 'c1':
                    this.setState({
                        notify: true,
                        currentData: false,
                        historyData: false
                    });
                    break;
                case 'c2':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: true,
                        historyData: false
                    });
                    break;
                case 'c3':
                    this.setState({
                        notify: false,
                        currentData: false,
                        historyData: true
                    });
                    break;
                case 'c4':
                    this.setState({
                        notify: false,
                        currentData: false,
                        historyData: false
                    });
                    break;
            }
        } else if ( /\d/g.test( masterValue )) {

            switch(masterValue) {
                case 'm1':
                    this.setState({
                        notify: true,
                        writeNotify: false,
                        currentData: false,
                        historyData: false,
                        getIps: false,
                        userList: false,
                        addUser: false
                    });
                    break;
                case 'm2':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: true,
                        historyData: false,
                        getIps: false,
                        userList: false,
                        addUser: false
                    });
                    break;
                case 'm3':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: false,
                        historyData: true,
                        getIps: false,
                        userList: false,
                        addUser: false
                    });
                    break;
                case 'm5':
                    this.setState({
                        notify: false,
                        writeNotify: true,
                        currentData: false,
                        historyData: false,
                        getIps: false,
                        userList: false,
                        addUser: false
                    });
                    break;
                case 'm6':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: false,
                        historyData: false,
                        getIps: true,
                        userList: false,
                        addUser: false
                    });
                    break;
                case 'm7':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: false,
                        historyData: false,
                        getIps: false,
                        userList: false,
                        addUser: true
                    });
                    break;
                case 'm8':
                    this.setState({
                        notify: false,
                        writeNotify: false,
                        currentData: false,
                        historyData: false,
                        getIps: false,
                        userList: true,
                        addUser: false
                    });
                    break;
            }
        }
        return true;
    }
    render() {
        var master, getNotify, currentData, historyData, writeNotify, getIps, userList, addUser;

        master = this.props.master == 'true' ? true : false;

        if ( master ) {
            if ( this.state.notify ) {
                getNotify = <GetNotify></GetNotify>;
            } else if ( this.state.currentData) {
                currentData = <EditTable  url="/master/data/current"></EditTable>
            } else if ( this.state.historyData ) {
                historyData = <EditTable history="true" url="/master/data/history" postUrl="/master/data/history" edit="true"></EditTable>
            } else if ( this.state.writeNotify ) {
                writeNotify = <WriteNotify url="/notify"></WriteNotify>
            } else if ( this.state.getIps ) {
                getIps = <GetIps url ="/master/channel/ip"></GetIps>
            } else if ( this.state.userList ) {

                userList = <UserList></UserList>
            } else if ( this.state.addUser ) {
                addUser = <AddUser url="/master/newchannel"></AddUser>
            }
        } else {
            if ( this.state.notify ) {
                getNotify = <GetNotify></GetNotify>;
            } else if ( this.state.currentData ) {
                currentData = <ShowTable url="/channel/data/current"></ShowTable>
            } else if ( this.state.historyData ) {
                historyData = <ShowTable hasSearch='true' url="/channel/data/history"></ShowTable>
            }
        }

        return (
            <div>
                {getNotify}
                {writeNotify}
                {currentData}
                {historyData}
                {getIps}
                {userList}
                {addUser}
            </div>

        )
    }
}

export default ContentContainer