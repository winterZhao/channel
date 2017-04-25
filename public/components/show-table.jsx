
import React from 'react';
import axios from 'axios';
import { Table, Button } from 'antd';

const columns = [{
    title: '新增',
    dataIndex: 'increase',
    width: '33%'
}, {
    title: '付费',
    dataIndex: 'expense',
    width: '33%'
}, {
    title: 'ARPU',
    dataIndex: 'arpu',
    width: '34%'
}];

class ShowTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {}
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
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order
        })
    }
    getData( params = {} ) {
        var dataArr = [],
            url = this.props.url;

        axios
            .get(url, {
                results: 10,
                ...params
            })
            .then((json)=>{
                const pagination = { ...this.state.pagination };

                pagination.total = json.data.length;

                for ( var i = 0, r = json.data.dataList.length; i < r; i++ ) {
                    var cur = json.data.dataList[i];
                    var obj = {};
                    obj.increase = cur.modify_increase;
                    obj.expense = cur.modify_expense;
                    obj.arpu = cur.modify_ARPU;
                    obj.key = i;
                    dataArr.push(obj);
                }
                this.setState({
                    data: dataArr,
                    pagination,
                });
            })
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.data}
                bordered
                pagination = {this.state.pagination}
                onChange = {this.handleTableChange}
            />
        );
    }
}

export default ShowTable;