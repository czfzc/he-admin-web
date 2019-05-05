import React from 'react';
import {message, Table, Popconfirm} from 'antd';
import axios from "../../../common/axios";

export default class Refund extends React.Component {

    state = {
        loading: false
    }

    constructor(props) {
        super(props)

        this.state.session_key = props.session_key;
        this.state.pagination = props.pagination;

        this.handleChange = this.handleChange.bind(this)
        this.acceptRefund = this.acceptRefund.bind(this)
        this.refuseRefund = this.refuseRefund.bind(this)

        this.setState({loading: true})

        this.getTotal();
        this.getData();

        this.setState({loading: false})

    }

    getTotal() {
        axios('http://127.0.0.1:8081/admin/get_total_refund', {
            session_key: this.state.session_key,
        }).then((res) => {
            if (res.data.status === true) {
                this.setState({
                    pagination: {
                        total: res.data.total,
                        current: this.state.pagination.current,
                        pageSize: this.state.pagination.pageSize
                    }
                })
            }
        })
    }

    getData() {
        axios('http://127.0.0.1:8081/admin/get_refund', {
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

    handleChange = (pagination, filters, sorter) => {
        this.state.pagination = pagination;
        this.setState({loading: true})
        this.getData();
        this.setState({loading: false})
    }

    acceptRefund(refundId) {
        axios('http://127.0.0.1:8081/admin/accept_refund', {
            session_key: this.state.session_key,
            refund_id: refundId
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

    refuseRefund(refundId) {
        axios('http://127.0.0.1:8081/admin/refuse_refund', {
            session_key: this.state.session_key,
            refund_id: refundId
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
            title: '退款单号',
            dataIndex: 'refundId',
            key: '1'
        }, {
            title: '对应订单号',
            dataIndex: 'orderId',
            key: '2'
        }, {
            title: '时间',
            dataIndex: 'time',
            key: '3'
        }, {
            title: '理由',
            dataIndex: 'reason',
            key: '4'
        }, {
            title: '用户手机号',
            dataIndex: 'userId',
            key: '5'
        }, {
            title: '状态',
            dataIndex: 'refused',
            key: '6',
            render: (text, record) => {
                if (record.succeed)
                    return '成功'
                else return record.refused ? '被拒绝' : '请求退款'
            }
        }, {
            title: '操作',
            dataIndex: '',
            key: '7',
            render: (text, record) => {
                return (
                    <div>
                        {(!record.refused) && (!record.succeed) ?
                            <div><Popconfirm title="确定通过退款，钱款原路返回?"
                                             onConfirm={this.acceptRefund.bind(this, record.orderId)} okText="Yes"
                                             cancelText="No">
                                <a>通过</a></Popconfirm>/
                                <Popconfirm title="确定拒绝退款，不可反悔?"
                                            onConfirm={this.refuseRefund.bind(this, record.orderId)} okText="Yes"
                                            cancelText="No">
                                    <a>拒绝</a></Popconfirm></div>
                            : null
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
