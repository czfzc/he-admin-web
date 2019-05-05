import React from 'react';
import {message, Table, Popconfirm} from 'antd';
import axios from "../../../common/axios";

export default class Order extends React.Component {

    state = {
        loading: false
    }

    constructor(props) {
        super(props)

        this.state.session_key = props.session_key;
        this.state.pagination = props.pagination;

        this.handleChange=this.handleChange.bind(this)
        this.refund=this.refund.bind(this)
        this.disable=this.disable.bind(this)
        this.enable=this.enable.bind(this)

        this.setState({loading: true})

        this.getTotal();
        this.getData();

        this.setState({loading: false})

    }

    getTotal() {
        axios('http://127.0.0.1:8081/admin/get_total_order', {
            session_key: this.state.session_key,
        }).then((res) => {
            if (res.data.status === true) {
                this.setState({
                    pagination: {
                        total: res.data.total,
                        current:this.state.pagination.current,
                        pageSize:this.state.pagination.pageSize
                    }
                })
            }
        })
    }

    getData() {
        axios('http://127.0.0.1:8081/admin/get_order', {
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

    refund(orderId){
        axios('http://127.0.0.1:8081/admin/refund_order', {
            session_key: this.state.session_key,
            order_id:orderId
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    disable(orderId){
        axios('http://127.0.0.1:8081/admin/set_order_to_disabled', {
            session_key: this.state.session_key,
            order_id:orderId
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
            console.log(this.state.pagination)
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    enable(orderId){
        axios('http://127.0.0.1:8081/admin/set_order_to_abled', {
            session_key: this.state.session_key,
            order_id:orderId
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    render() {

        const columns = [{
            title: '订单号',
            dataIndex: 'orderId',
            key: '1'
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2'
        }, {
            title: '总价',
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
            title: '操作',
            dataIndex: '',
            key: '7',
            render: (text, record) => {
                return (
                    <div>
                        <Popconfirm title="确定退款？"
                                    onConfirm={this.refund.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>退款</a>/
                        </Popconfirm>
                        {record.abled?
                            <Popconfirm title="确定冻结?"
                                        onConfirm={this.disable.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>冻结</a></Popconfirm>:
                            <Popconfirm title="确定解冻?"
                                        onConfirm={this.enable.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>解冻</a></Popconfirm>
                        }

                    </div>
                )
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
