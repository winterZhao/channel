
import React from 'react';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { channelStore, masterStore } from '../store/index.jsx';

const { SubMenu } = Menu;

class LeftSide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '1',
            openKeys: []
        }
        this.bindClick = this.bindClick.bind(this);
    }

    bindClick(e) {
        var name = e.target.innerText.trim();
        var isMaster = this.props.master === 'true' ? true : false;

        if ( name === '消息通知' ) {
            if ( isMaster ) {
                channelStore.dispatch({type:'channel',num:''});
                masterStore.dispatch({type: 'master', num: 1});
            } else {
                channelStore.dispatch({type: 'channel', num: 1});
                masterStore.dispatch({type:'master',num:''});
            }
        } else if ( name === '写通知' ) {
            channelStore.dispatch({type:'channel',num:''});
            masterStore.dispatch({type: 'master', num: 5});
        } else if ( name === '实时数据') {
            if ( isMaster ) {
                channelStore.dispatch({type:'channel',num:''});
                masterStore.dispatch({type: 'master', num: 2});
            } else {
                channelStore.dispatch({type: 'channel', num: 2});
                masterStore.dispatch({type:'master',num:''});
            }
        } else if ( name === '历史数据' ) {
            if ( isMaster ) {
                channelStore.dispatch({type:'channel',num:''});
                masterStore.dispatch({type: 'master', num: 3});
            } else {
                channelStore.dispatch({type: 'channel', num: 3});
                masterStore.dispatch({type:'master',num:''});
            }
        } else if ( name === 'ip列表' ) {
            channelStore.dispatch({type:'channel',num:''});
            masterStore.dispatch({type: 'master', num: 6});
        } else if ( name === '用户列表' ) {
            channelStore.dispatch({type:'channel',num:''});
            masterStore.dispatch({type: 'master', num: 8});
        } else if ( name === '增加用户' ) {
            channelStore.dispatch({type:'channel',num:''});
            masterStore.dispatch({type: 'master', num: 7});
        }

    }
    getAncestorKeys = (key) => {
        const map = {
            sub3: ['sub2'],
        };
        return map[key] || [];
    }
    handleClick = (e) => {
        this.setState({ current: e.key });
    }
    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    render() {
        var master, writeNotifyMenu,getIpsMenu,systemMenu;

        master = this.props.master == 'true' ? true : false;

        if ( master ) {
            writeNotifyMenu = <Menu.Item key="112"><span onClick={this.bindClick}>写通知</span></Menu.Item>
            getIpsMenu =  <Menu.Item key="123"><span  onClick={this.bindClick}>ip列表</span></Menu.Item>
            systemMenu = <SubMenu key="13" title={<span className="nav-text"><Icon type="api" />系统</span>}>
                <Menu.Item key="131"><span onClick={this.bindClick}>用户列表</span></Menu.Item>
                <Menu.Item key="132"><span onClick={this.bindClick}>增加用户</span></Menu.Item>
            </SubMenu>
        }

        return (
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['3']}
                openKeys = {this.state.openKeys}
                selectedKeys = {[this.state.current]}
                onOpenChange = {this.onOpenChange}
                onClick = {this.handleClick}
                >
                <div className="logo" style={{paddingTop:"20px"}}>
                    <img src="../images/admin.png" alt="" style={{display: "block",margin: "0 auto",maxWidth:"70px"}}></img>
                </div>
                <SubMenu key="11" title={<span className="nav-text"><Icon type="home" />主页</span>}>
                    <Menu.Item key="111"><span onClick={this.bindClick}>消息通知</span></Menu.Item>
                    {writeNotifyMenu}
                </SubMenu>
                <SubMenu key="12" title={<span className="nav-text"><Icon type="area-chart" />渠道数据</span>}>
                    <Menu.Item key="121"><span onClick={this.bindClick}>实时数据</span></Menu.Item>
                    <Menu.Item key="122"><span onClick={this.bindClick}>历史数据</span></Menu.Item>
                    {getIpsMenu}
                </SubMenu>
                {systemMenu}
                <SubMenu key="14" title={<span className="nav-text"><Icon type="user" />退出</span>}>
                    <Menu.Item key="141"><a href='/login'>退出</a></Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}

export default LeftSide;