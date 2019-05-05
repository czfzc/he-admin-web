import React from 'react';
import {message, Table} from 'antd';
import axios from "../../../common/axios";

export default class ExpressPreorder extends React.Component {

    state = {
        loading: false
    }

    constructor(props) {
        super(props)

        this.state.session_key = props.session_key;
        this.state.pagination = props.pagination;

        this.handleChange=this.handleChange.bind(this)

        this.setState({loading: true})

        this.getTotal();
        this.getData();

        this.setState({loading: false})
    }

    getTotal() {
        axios('http://127.0.0.1:8081/admin/get_total_express_preorder', {
            session_key: this.state.session_key,
        }).then((res) => {
            if (res.data.status === true) {
                this.setState({
                    pagination: {
                        total: res.data.total
                    }
                })
            }
        })
    }

    getData() {
        axios('http://127.0.0.1:8081/admin/get_express_preorder', {
            session_key: this.state.session_key,
            page: this.state.pagination.current - 1,
            size: this.state.pagination.pageSize
        }).then((res) => {
            if (res.data.status !== false) {
                this.setState({
                    listData: res.data
                })
            } else {
                message.error('加载失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })

    }

    handleChange=(pagination, filters, sorter) => {
        this.state.pagination=pagination;
        this.setState({loading: true})
        this.getData();
        this.setState({loading: false})
    }

    render() {
        const columns = [{
            title: '预付单号',
            dataIndex: 'id',
            key: '1'
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2'
        }, {
            title: '预付单总价',
            dataIndex: 'totalFee',
            key: '3'
        }, {
            title: '下单时间',
            dataIndex: 'time',
            key: '4'
        }, {
            title: '付款情况',
            dataIndex: 'payed',
            key: '5',
            render: (text, record) => {
                if (record.payed === 0)
                    return '未付款'
                if (record.payed === 1)
                    return '已付款'
                if (record.payed === 2)
                    return '已退款'
                if (record.payed === 3)
                    return '已申请退款'
            }
        }, {
            title: '状态',
            dataIndex: 'abled',
            key: '6',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        },{
            title: '业务种类',
            dataIndex: 'abled',
            key: '7',
            render: (text, record) => {
                return '快递代取'
            }
        }]
        return (
            <Table columns={columns}
                   dataSource={this.state.listData}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleChange}/>
        )
    }

}
