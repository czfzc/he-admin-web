import React from 'react';
import {message, Table, Popconfirm} from 'antd';
import axios from "../../../common/axios";

export default class Express extends React.Component {

    state = {
        loading: false
    }

    constructor(props) {
        super(props)

        this.state.session_key = props.session_key;
        this.state.pagination = props.pagination;

        this.handleChange=this.handleChange.bind(this)
        this.withdraw=this.withdraw.bind(this)
        this.sended=this.sended.bind(this)

        this.setState({loading: true})

        this.getTotal();
        this.getData();

        this.setState({loading: false})
    }

    getTotal() {
        axios('http://127.0.0.1:8081/admin/get_total_express', {
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
        axios('http://127.0.0.1:8081/admin/get_express', {
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

    withdraw(id){
        axios('http://127.0.0.1:8081/admin/set_status_to_withdraw', {
            session_key: this.state.session_key,
            express_id:id
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

    sended(id){
        axios('http://127.0.0.1:8081/admin/set_status_to_sended', {
            session_key: this.state.session_key,
            express_id:id
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

    render() {
        const columns = [{
            title: '快递代取号',
            dataIndex: 'expressId',
            key: '1'
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2'
        }, {
            title: '快递姓名',
            dataIndex: 'name',
            key: '3'
        }, {
            title: '快递手机号',
            dataIndex: 'time',
            key: '4'
        }, {
            title: '单价',
            dataIndex: 'totalFee',
            key: '5'
        },{
            title: '短信内容',
            dataIndex: 'smsContent',
            key: '6'
        },{
            title:'收货码',
            dataIndex:'receiveCode',
            key: '7'
        },{
            title: '送达情况',
            dataIndex: 'status',
            key: '8',
            render:(text,record)=>{
                if(record.status==0)
                    return '未领取'
                else if(record.status==1)
                    return '已领取'
                else if(record.status==2)
                    return '已送达'
                else return '未知'
            }
        },{
            title:'下单时间',
            dataIndex:'time',
            key: '9'
        },{
            title: '状态',
            dataIndex: 'abled',
            key: '10',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        },{
            title:'操作',
            dataIndex: '',
            key:'11',
            render: (text,record)=>{
                return (
                    <div>
                        {this.getAction(record)}
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

    getAction = (record)=>{
        if(record.status===0)
            return (
                <Popconfirm title="确定取到货了?"
                            onConfirm={this.withdraw.bind(this,record.expressId)} okText="Yes" cancelText="No">
                    <a>设置已取货</a></Popconfirm>
            )
        else if(record.status===1)
            return (
                <Popconfirm title="确定送到手了?"
                            onConfirm={this.sended.bind(this,record.expressId)} okText="Yes" cancelText="No">
                    <a>设置已送达</a></Popconfirm>
            )
    }

}
