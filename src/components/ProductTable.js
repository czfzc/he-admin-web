import React from 'react';
import {message, Table, Popconfirm, Menu,Tooltip} from 'antd';
import axios from "../common/axios";
import "../config"
import ProductCard from './ProductCard'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


export default class ProductTable extends React.Component {

    state = {
        listData:[],
        session_key:global.data.session_key
    }

    constructor(props) {
        super(props)

        this.state.listData=props.listData

        console.log(this.state.listData)

    }

    render() {
        const columns = [{
            title: '主键',
            dataIndex: 'mainKey',
            key: '1',
        },{
            title: '商品id',
            dataIndex: 'productId',
            key: '2',
            render:(text,record) => {
                return (
                    <Tooltip title="点击查看" >
                        <span onClick={()=>{
                            console.log("sbsbsb")
                        }}>{text}</span>
                    </Tooltip>
                )
            }
        }, {
            title: '预付单id',
            dataIndex: 'preorderId',
            key: '3'
        }, {
            title: '数量',
            dataIndex: 'num',
            key: '4'
        } ,{
            title: '总价',
            dataIndex: 'totalFee',
            key: '5'
        }, {
            title: '用户id',
            dataIndex: 'userid',
            key: '6'
        },{
            title: '时间',
            dataIndex: 'time',
            key: '7'
        }]

        return (
            <div>
                <Table columns={columns}
                       dataSource={this.state.listData}
                       pagination={false}
                       rowKey={record => record.mainKey}/>
            </div>
        )
    }



}
