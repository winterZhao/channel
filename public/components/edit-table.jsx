
import React from 'react';
import axios from 'axios';
import Search from './search.jsx';
import qs from 'qs';
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

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'username', text),
            }, {
                title: '搜索名',
                dataIndex: 'search_name',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'search_name', text),
            },{
                title: '数量',
                dataIndex: 'increase',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'increase', text),
            }, {
                title: '金额',
                dataIndex: 'expense',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'expense', text),
            }, {
                title: 'ARPU',
                dataIndex: 'ARPU',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'ARPU', text),
            },{
                title: '数量减量',
                dataIndex: 'modify_increase',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'modify_increase', text),
            },{
                title: '金额减量',
                dataIndex: 'modify_expense',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'modify_expense', text),
            },{
                title: 'ARPU减量',
                dataIndex: 'modify_ARPU',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'modify_ARPU', text),
            }];
        this.state = {
            data: [],
            pagination: {},
            expenseSum: null,
            increaseSum: null,
            ARPUSum: null
        };
    }
    componentWillMount() {
        var edit = this.props.edit == 'true' ? true : false;
        if ( edit ) {
            this.columns.unshift({
                title: '时间',
                dataIndex: 'crawl_time',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'crawl_time', text),
            })


            this.columns.push({
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
            })
        }
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
    getData( params = {}) {
        var dataArr = [],
            url = this.props.url;

        axios
            .get( url, {
                params: {
                    results: 10,
                    ...params
                }
            })
            .then((json)=>{

                const pagination = { ...this.state.pagination };

                dataArr = json.data.dataList;
                pagination.total = json.data.length;

                dataArr.forEach((item, index) => {
                    item.gmt_modified = item.gmt_modified.replace('T00:00:00.000Z', '');

                    for ( var k in item ) {
                        var t = item[k];
                        item[k] = {};
                        item[k].editable = false;
                        item[k].value = t;
                    }
                    item.key = item.id.value;
                })

            this.setState({
                data: dataArr,
                pagination,
                expenseSum: json.data.expenseSum,
                increaseSum: json.data.increaseSum,
                ARPUSum: json.data.ARPUSum
            });
        })
    }
    componentDidMount() {
        this.getData();
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return(
            <EditableCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
            />);
    }
    handleChange = (key, index, value) => {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit = (index) => {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone = (index, type) => {
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
            this.postModifyData(index);
        });
    }

    postModifyData = (index) =>{
        var cur = this.state.data[index],
            obj = {},
            url = this.props.postUrl;

        Object.keys(cur).forEach((item) => {
            obj[item] = cur[item].value;
        })
        axios.post(url, qs.stringify(obj))
            .then((json) => {
                json = json.data;
                if ( json.success ) {
                    alert('修改数据成功');
                } else {
                    alert('修改数据失败,请重试');
                }
                location.reload();
            }).
            catch((err) => {
                alert('渠道修改失败!')
            })
    }
    search = (dataObj) => {

        this.getData(dataObj)
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
                <h3>总金额:{this.state.expenseSum}, 总数量: {this.state.increaseSum}, ARPU: {this.state.ARPUSum}</h3>
                <br/>
                <Search isData = {this.props.history}  searchData={this.search}></Search>
                <br/>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination = {this.state.pagination}
                    onChange = {this.handleTableChange}
                    />
            </div>
        )

    }
}


export default EditableTable;