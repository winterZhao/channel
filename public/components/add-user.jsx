
import React from 'react';
import axios from 'axios';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


class AddUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.isNew = 'true';
                axios
                    .post(this.props.url, values)
                    .then((json) => {
                        json = json.data;
                        if ( json.success ) {
                            alert('用户创建成功');
                            location.reload();
                        } else {
                            if ( json.code && json.code == 2000 ) {
                                alert('用户名已存在,请重新输入')
                            } else {
                                alert('用户创建失败')
                            }
                        }
                    })
                    .catch(()=>{
                        alert('用户创建失败');
                    })
            }
        });
    }
    checkNum = (rule, value, callback) => {
        if (value && value >= 1) {
            callback('减量小于1');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector">
                <Option value="86">+86</Option>
            </Select>
        );
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="用户名"
                    hasFeedback
                    >
                    {getFieldDecorator('username', {
                        rules: [{
                            required: true, message: '用户名不能为空',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                    >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '密码不能为空',
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                          搜索名&nbsp;
                          <Tooltip title="不同用户可通过设置同样的搜索名实现绑定">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                    hasFeedback
                    >
                    {getFieldDecorator('search_name', {
                        rules: [{ required: true, message: '请输入搜索名'}],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="用户类型"
                    hasFeedback
                    >
                    {getFieldDecorator('rank', {
                        rules: [
                            { required: true, message: '请选择用户类型' },
                        ],
                    })(
                        <Select placeholder="请选择用户类型">
                            <Option value="2">使用者</Option>
                            <Option value="1">管理员</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                          数量减量&nbsp;
                          <Tooltip title="不大于1的小数">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                    hasFeedback
                    >
                    {getFieldDecorator('increase_decrement', {
                        rules: [{
                            required: true, message: '请输入数量减量',
                        }, {
                            validator: this.checkNum,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                          金额减量&nbsp;
                          <Tooltip title="不大于1的小数">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                    hasFeedback
                    >
                    {getFieldDecorator('expense_decrement', {
                        rules: [{
                            required: true, message: '请输入金额减量',
                        }, {
                            validator: this.checkNum,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="爬虫来源"
                    hasFeedback
                    >
                    {getFieldDecorator('crawl_url', {
                        rules: [
                            { required: true, message: '请选择爬虫来源' },
                        ],
                    })(
                        <Select placeholder="请选择用户类型">
                            <Option value="1">geek-maker</Option>
                            <Option value="2">batpk</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="button" onClick={this.handleSubmit} size="large">增加用户</Button>
                </FormItem>
            </Form>
        );
    }
}

const AddUser = Form.create()(AddUserForm);

export default AddUser;