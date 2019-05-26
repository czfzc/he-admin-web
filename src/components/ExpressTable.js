import React from 'react';
import {message, Table, Popconfirm, Menu} from 'antd';
import axios from "../common/axios";
import "../config"

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


export default class ExpressTable extends React.Component {

    state = {
        listData:[],
        expressPoint:global.data.expressPoint,
        expressSize:global.data.expressSize,
        session_key:global.data.session_key
    }

    constructor(props) {
        super(props)

        this.state.listData=props.listData

        console.log(this.state.listData)

        this.withdraw=this.withdraw.bind(this)
        this.sended=this.sended.bind(this)

    }



    getExpressPointNameByExpressPointId(expressPointId){
        let point=this.state.expressPoint;
        for(let i=0;i<point.length;i++){
            if(point[i].expressPointId===expressPointId)
                return point[i].name;
        }
        return '未知'
    }

    getExpressSizeNameBySizeId(sizeId){
        let size=this.state.expressSize;
        for(let i=0;i<size.length;i++){
            if(size[i].sizeId===sizeId)
                return size[i].sizeName;
        }
        return '未知'
    }


    withdraw(id){
        axios(global.data.host+'/admin/set_status_to_withdraw', {
            session_key: this.state.session_key,
            express_id:id
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
            } else {
                message.error('失败')
            }
            console.log(this.state.pagination)
        })
    }

    sended(id){
        axios(global.data.host+'/admin/set_status_to_sended', {
            session_key: this.state.session_key,
            express_id:id
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
            } else {
                message.error('失败')
            }
            console.log(this.state.pagination)
        })
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

    render() {
        const columns = [{
            title: '快递代取号',
            dataIndex: 'expressId',
            key: '1',
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2',
        }, {
            title: '快递姓名',
            dataIndex: 'name',
            key: '3'
        }, {
            title: '快递手机号',
            dataIndex: 'time',
            key: '4'
        }, {
            title: '快递点',
            dataIndex: 'expressPointId',
            key: '5',
            render:(text,record)=>{
                return this.getExpressPointNameByExpressPointId(record.expressPointId)
            }
        },{
            title: '快递大小',
            dataIndex: 'sizeId',
            key: '6',
            render:(text,record)=>{
                return this.getExpressSizeNameBySizeId(record.sizeId)
            }
        },{
            title: '单价',
            dataIndex: 'totalFee',
            key: '7'
        },{
            title: '短信内容',
            dataIndex: 'smsContent',
            key: '8'
        },{
            title:'收货码',
            dataIndex:'receiveCode',
            key: '9'
        },{
            title: '送达情况',
            dataIndex: 'status',
            key: '10',
            render:(text,record)=>{
                if(record.status===0)
                    return '未领取'
                else if(record.status===1)
                    return '已领取'
                else if(record.status===2)
                    return '已送达'
                else return '未知'
            }
        },{
            title:'下单时间',
            dataIndex:'time',
            key: '11'
        },{
            title: '状态',
            dataIndex: 'abled',
            key: '12',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        },{
            title:'操作',
            dataIndex: '',
            key:'13',
            render: (text,record)=>{
                return (
                    <div>
                        {this.getAction(record)}
                    </div>
                )
            }
        }]

        return (
            <div>
                <Table columns={columns}
                       dataSource={this.state.listData}
                       pagination={false}
                       rowKey={record => record.expressId}/>
            </div>
        )
    }



}
