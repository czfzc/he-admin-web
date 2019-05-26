import React from 'react';
import {Table} from 'antd';
import ExpressTable from "./ExpressTable";

export default class PreorderTable extends React.Component {

    state={
        listData:[]
    }

    constructor(props) {
        super(props)
        this.state.listData=props.listData
    }

    expressRender=(record, index, indent, expanded)=>{
        return <ExpressTable listData={record.express}/>
    }

    render() {
        const columns = [{
            title: '预付单号',
            dataIndex: 'id',
            key: '1',
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2',
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
                   pagination={false}
                   rowKey={record => record.id}
                   expandedRowRender={this.expressRender}/>
        )
    }

}
