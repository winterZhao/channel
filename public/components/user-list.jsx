
import React from 'react';
import axios from 'axios';
import { Table, Input, Popconfirm } from 'antd';
import Search from './search.jsx';


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
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
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

        this.columns = [{
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
        },{
            title: '爬虫类型',
            dataIndex: 'crawl_url',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'crawl_url', text),
        },{
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
            data: [],
            pagination: {}
        };
    }
    handleTableChange = ( pagination, sorter ) => {
        const pager = { ...this.state.pagination };

        pager.current = pagination.current;

            this.setState({
                pagination: pager
            })

            this.getData({
                results: pagination.pageSize,
                page: pagination.current
            })
    }
    getData = ( params = {}, url = '/master/channel/list') =>{
        var dataArr = [];

        axios
            .get( url, {
                results: 10,
                ...params
            })
            .then((json)=>{

                const pagination = { ...this.state.pagination };

                dataArr = json.data.dataList;
                pagination.total = json.data.length;

                if ( dataArr && dataArr.length ) {
                    dataArr.forEach((item, index) => {

                        for ( var k in item ) {
                            var t = item[k];
                            item[k] = {};
                            item[k].editable = false;
                            item[k].value = t;
                        }
                        item.key = index;
                    })
                    this.setState({
                        data: dataArr,
                        pagination,
                    });
                }

            })
    }

    search = (dataObj = {}) => {
        this.getData(dataObj, '/master/search/channel');
    }

    componentDidMount() {
        this.getData();
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];

        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <EditableCell
                editable={editable}
                value={text}
                onChange={value => this.handleChange(key, index, value)}
                status={status}
            />
        );
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
        console.log(data[index]);
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

        });
        this.postModifyUser(data[index]);
    }
    postModifyUser = (data = {}) => {
        Object.keys(data).forEach((item) => {
            var val = data[item].value;
            if ( val ) {
                data[item] = val;
            }
        })
        data.isNew = false;
        axios
            .post('/master/newchannel', data)
            .then((json) => {
                json = json.data;
                if ( json.success ) {
                    alert('用户修改成功');
                    location.reload();
                } else {
                    alert('用户修改失败')
                }
            })
            .catch(()=>{
                alert('用户修改失败')
            })
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
        return  (
            <div>
                <Search searchData={this.search}></Search>
                <br/>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination = {this.state.pagination}
                    onChange = {this.handleTableChange}
                    />;
            </div>
            )


    }
}

export default UserList;
