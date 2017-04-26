
import React from 'react';
import axios from 'axios';
import { Table, Button } from 'antd';
import Search from './search.jsx';

class ShowTable extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '数量',
            dataIndex: 'increase'
        }, {
            title: '金额',
            dataIndex: 'expense'
        }, {
            title: 'ARPU',
            dataIndex: 'arpu'
        }];

        this.state = {
            data: [],
            pagination: {},
            expenseSum: null,
            increaseSum: null,
            ARPUSum: null
        }
    }
    componentWillMount() {
        if ( this.props.hasSearch ) {
            this.columns.unshift({
                title: '时间',
                dataIndex: 'crawl_time'
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
                params: {
                    results: 10,
                    ...params
                }
            })
            .then((json)=>{
                const pagination = { ...this.state.pagination };

                pagination.total = json.data.length;

                for ( var i = 0, r = json.data.dataList.length; i < r; i++ ) {
                    var cur = json.data.dataList[i];
                    var obj = {};
                    obj.increase = cur.modify_increase;
                    obj.crawl_time = cur.crawl_time;
                    obj.expense = cur.modify_expense;
                    obj.arpu = cur.modify_ARPU;
                    obj.key = i;
                    dataArr.push(obj);
                }
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
    search =(dataObj) => {
        this.getData(dataObj)
    }
    render() {
        var hasSearch = this.props.hasSearch == 'true' ? true : false;
        var search;

        if ( hasSearch ) {
            search = <Search isData="true" isName="false" searchData={this.search}></Search>;
        }
        return (
            <div>
                <h3>总金额:{this.state.expenseSum}, 总数量: {this.state.increaseSum}, ARPU: {this.state.ARPUSum}</h3>
                <br/>
                {search}
                <br/>
                <Table
                    columns={this.columns}
                    dataSource={this.state.data}
                    bordered
                    pagination = {this.state.pagination}
                    onChange = {this.handleTableChange}
                    />
            </div>
        );
    }
}

export default ShowTable;