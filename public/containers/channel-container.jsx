
import React from 'react';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import BreadCrumb from '../components/bread-crumb.jsx';
import LeftSide from '../components/left-side.jsx';
import { channelStore, userStore } from '../store/index.jsx';
import ContentContainer from './content-container.jsx';

const { Header, Content, Sider, Footer } = Layout;

class ChannelComp extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
                    >
                    <LeftSide master="false"></LeftSide>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Row type="flex" justify="end" align="center">
                            <Col span={4} style={{display:"inline-block"}}>
                                <img src="../images/user-avatar.png" style={{width:20,verticalAlign:"middle",marginRight:"10px"}}></img><span>{userStore.getState()}</span>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <BreadCrumb />
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <ContentContainer></ContentContainer>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default ChannelComp;

