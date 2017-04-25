import React from 'react';
import { Layout, Row, Col, } from 'antd';
import WrappedNormalLoginForm from './login.jsx';
import 'antd/lib/layout/style/css';
import 'antd/lib/Grid/style/css';

const { Header, Footer, Content }  = Layout;

class LoginComp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div>
                <Row style={{maxWidth: "330px", margin: "50px auto",paddingTop:"30px",backgroundColor: "#fff"}} type="flex" justify="center" align="center">
                    <Col >
                        <img src="../images/admin.png" alt=""></img>
                        <WrappedNormalLoginForm url="/login"/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default LoginComp;

