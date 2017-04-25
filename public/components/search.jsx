
import React from 'react';
import { Form, Row, Col, DatePicker, Input, Button, Icon } from 'antd';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            starttime: null,
            endtime: null,
        }
    }
    handleSearch = (callback,e) => {
        e.preventDefault();
        var obj = {};

        if ( this.state.starttime ) {
            obj.starttime = this.state.starttime;
            obj.endtime = this.state.endtime;
        }

        this.props.form.validateFields((err, values) => {
            obj.search_name = values.search_name;
        });
        callback(obj)
    }
    onDateSelect(data, dataString) {
        this.setState({
            starttime: dataString[0],
            endtime: dataString[1]
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { starttime, endtime } = this.state;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        var isData = this.props.isData == 'true' ?  true : false;

        const children = [];
        if ( isData ) {
            children.push(
                <Col span={14} key="0">
                    <FormItem
                        {...formItemLayout}
                            label="时间范围"
                        >
                        <RangePicker onChange={this.onDateSelect} />

                    </FormItem>
                </Col>
            );
        }
        children.push(
            <Col span={7} key={2}>
                <FormItem {...formItemLayout} label={`搜索名`}>
                    {getFieldDecorator('search_name')(
                        <Input placeholder="请输入搜索名"/>
                    )}

                </FormItem>
            </Col>
        )
        children.push(
            <Col span={3} key={3}>
                <Button type="primary" htmlType="button" onClick={this.handleSearch.bind(this, this.props.searchData)}>搜索</Button>
            </Col>
        )

        return (
            <Form
                className="ant-advanced-search-form"
                >
                <Row gutter={40}>
                    {children.slice(0)}
                </Row>
            </Form>
        );
    }
}

const Search = Form.create()(SearchForm);

export default Search;