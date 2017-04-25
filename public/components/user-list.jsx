import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Search from './search.jsx';
import { Table, Input, Popconfirm } from 'antd';

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                                />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        );
    }
}

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'username', text),
            }, {
                title: '密码',
                dataIndex: 'password',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'password', text),
            }, {
                title: '搜索名',
                dataIndex: 'search_name',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'search_name', text),
            }, {
                title: '用户类型',
                dataIndex: 'rank',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'rank', text),
            }, {
                title: '数量减量',
                dataIndex: 'increase_decrement',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'increase_decrement', text),
            }, {
                title: '金额减量',
                dataIndex: 'expense_decrement',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'expense_decrement', text),
            }, {
                title: '爬虫类型',
                dataIndex: 'crawl_url',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'crawl_url', text),
            }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {

                const { editable } = this.state.data[index].username;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>
                </span>
                                :
                                <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                </span>
                        }
                    </div>
                );
            },
        }];
        this.state = {
            data: []
        };
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditableCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
            />);
    }
    search = (data)=> {
        var dataArr = [],
            url = '/master/search/channel';

        axios
            .get(url,{
                params: data
            }).then((json)=> {
                json = json.data

                if (json.success) {

                    dataArr = json.dataList;
                    if ( dataArr && dataArr.length ) {
                        dataArr.forEach((item, index) => {
                            for ( var k in item ) {
                                var t = item[k];
                                item[k] = {};
                                item[k].editable = false;
                                item[k].value = t;
                            }
                            item.key = item.id.value;
                        })

                        this.setState({
                            data: dataArr
                        });
                    }
                } else {
                    alert('查无此人,请重新输入用户名');
                }
            }).catch(()=> {
                alert('查找错误,请稍后重试!')
            })

    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
            this.postModifyUser(index);
        });

    }
    postModifyUser = (index) => {
        var cur = this.state.data[index],
            obj = {},
            url = '/master/newchannel';

        Object.keys(cur).forEach((item) => {
            obj[item] = cur[item].value;
        })
        axios.post(url, qs.stringify(obj))
            .then((json) => {
                json = json.data;

                if ( json.success ) {
                    alert('用户修改成功!');
                } else {
                    alert('用户修改失败!');

                }
                location.reload();
            }).
            catch((err) => {
                alert('用户修改失败!')
            })

    }
    getData = ( params = {}, url = '/master/channel/list') =>{
        var dataArr = [];

        axios
            .get( url, {
                params: {
                    results: 10,
                    ...params
                }
            })
            .then((json)=>{

                dataArr = json.data.dataList;

                if ( dataArr && dataArr.length ) {
                    dataArr.forEach((item, index) => {

                        for ( var k in item ) {
                            var t = item[k];
                            item[k] = {};
                            item[k].editable = false;
                            item[k].value = t;
                        }
                        item.key = item.id.value;
                    })
                    this.setState({
                        data: dataArr
                    });
                }

            })
    }
    componentDidMount() {
        this.getData();
    }
    render() {

        const { data } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;
        return (
                <div>
                    <Search searchData={this.search.bind(this)}></Search>
                    <br/>
                    <Table bordered dataSource={dataSource} columns={columns} />
                </div>
            )

    }
}

export default UserList;