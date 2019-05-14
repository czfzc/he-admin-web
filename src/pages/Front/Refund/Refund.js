import React from 'react';
import {message, Table, Popconfirm} from 'antd';
import axios from "../../../common/axios";
import "../../../config"

export class Refund extends React.Component {

    state = {
        loading: false,
        session_key : global.data.session_key,
        pagination : global.data.pagination
    }

    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.acceptRefund = this.acceptRefund.bind(this)
        this.refuseRefund = this.refuseRefund.bind(this)

    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({loading: true})
        axios(global.data.host+'/admin/get_refund', {
            session_key: this.state.session_key,
            page: this.state.pagination.current - 1,
            size: this.state.pagination.pageSize
        }).then((res) => {
            if (res.data.status !== false) {
                this.setState({
                    listData: res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current:this.state.pagination.current,
                        pageSize:this.state.pagination.pageSize
                    }
                })
            } else {
                message.error('加载失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
        this.setState({loading: false})

    }

    handleChange = (pagination, filters, sorter) => {
        this.state.pagination = pagination;
        this.setState({loading: true})
        this.getData();
        this.setState({loading: false})
    }

    acceptRefund(refundId) {
        axios(global.data.host+'/admin/accept_refund', {
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
        axios(global.data.host+'/admin/refuse_refund', {
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
            width:100,
            key: '1',
            render:(text,record)=>{
                return <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
            }
        }, {
            title: '对应订单号',
            dataIndex: 'orderId',
            width:100,
            key: '2',
            render:(text,record)=>{
                return <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
            }
        }, {
            title: '时间',
            dataIndex: 'time',
            width:100,
            key: '3'
        }, {
            title: '理由',
            dataIndex: 'reason',
            width:100,
            key: '4'
        }, {
            title: '用户手机号',
            dataIndex: 'userId',
            width:100,
            key: '5'
        }, {
            title: '状态',
            dataIndex: 'refused',
            key: '6',
            width:100,
            render: (text, record) => {
                if (record.succeed)
                    return '成功'
                else return record.refused ? '被拒绝' : '请求退款'
            }
        }, {
            title: '操作',
            dataIndex: '',
            key: '7',
            width:100,
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
                   onChange={this.handleChange}
                   scroll={{ x: 700 }}
                   bordered
                   rowKey={record => record.refundId}
            />
        )
    }

}
