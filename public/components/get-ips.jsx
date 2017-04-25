
import React from 'react';
import axios from 'axios';
import { Table, Button } from 'antd';

const columns = [{
    title: '时间',
    dataIndex: 'gmt_create',
    width: '33%'
}, {
    title: '用户',
    dataIndex: 'username',
    width: '33%'
}, {
    title: 'ip',
    dataIndex: 'ip',
    width: '34%'
}];

class getIps extends React.Component {
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
            page: pagination.current
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

                var dataArr = json.data.dataList;

                dataArr.forEach(function(item, index) {
                    item['rowKey'] = index;
                })

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
                rowKey = 'username'
                dataSource={this.state.data}
                bordered
                pagination = {this.state.pagination}
                onChange = {this.handleTableChange}
                />
        );
    }
}

export default getIps;