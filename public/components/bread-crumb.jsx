
import React from 'react';
import { Breadcrumb } from 'antd';
import { channelStore, masterStore } from '../store/index.jsx';

class BreadCrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuText: "主页",
            subMenuText: "消息通知"
        }
    }
    componentWillReceiveProps() {

        var channelValue = channelStore.getState();
        var masterValue = masterStore.getState();

        if ( /\d/g.test(channelValue) ) {
            switch(channelValue) {
                case 'c1':
                    this.setState({'menuText': '主页', 'subMenuText': '消息通知'});
                    break;
                case 'c2':
                    this.setState({'menuText': '渠道数据', 'subMenuText': '实时数据'});
                    break;
                case 'c3':
                    this.setState({'menuText': '渠道数据', 'subMenuText': '历史数据'});
                    break;
            }
        } else if ( /\d/g.test(masterValue) ) {
            switch(masterValue) {
                case 'm1':
                    this.setState({'menuText': '主页', 'subMenuText': '消息通知'});
                    break;
                case 'm2':
                    this.setState({'menuText': '渠道数据', 'subMenuText': '实时数据'});
                    break;
                case 'm3':
                    this.setState({'menuText': '渠道数据', 'subMenuText': '历史数据'});
                    break;
                case 'm5':
                    this.setState({'menuText': '主页', 'subMenuText': '写通知'});
                    break;
                case 'm6':
                    this.setState({'menuText': '渠道数据', 'subMenuText': 'ip列表'});
                    break;
                case 'm7':
                    this.setState({'menuText': '系统', 'subMenuText': '增加用户'});
                    break;
                case 'm8':
                    this.setState({'menuText': '系统', 'subMenuText': '用户列表'});
                    break;
            }
        }


    }
    render() {
        var menuText = this.state.menuText,
            subMenuText = this.state.subMenuText;
        return (
            <Breadcrumb style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>{menuText}</Breadcrumb.Item>
                <Breadcrumb.Item>{subMenuText}</Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}

export default BreadCrumb;