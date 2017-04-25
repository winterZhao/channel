
import React from 'react';
import { Form, Icon, Input, Button} from 'antd';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if ( err ) {
                e.preventDefault();
            }
        });
    }
    componentWillMount() {
        var flag = this.GetQueryString('flag');
        if ( flag ) {
            alert('用户名或密码错误,请重新输入');
        }
    }
    GetQueryString (name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null){
            return  decodeURI(r[2]);
        }
        return null;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} action={this.props.url} method="POST" className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '用户名不能为空' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} name="username" placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不能为空' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} name="password" type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;

