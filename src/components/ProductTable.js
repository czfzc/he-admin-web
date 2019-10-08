import React from 'react';
import {message, Table, Popconfirm, Menu, Tooltip} from 'antd';
import axios from "../common/axios";
import "../config"
import ProductCard from './ProductCard'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


export default class ProductTable extends React.Component {

    state = {
        listData: [],
        session_key: global.data.session_key,
        buildingId: '',
        productTypes: []
    }

    constructor(props) {
        super(props)

        this.state.listData = props.listData
        this.state.buildingId = props.building_id
        this.state.productTypes = props.productTypes

        this.Product.bind(this)

        console.log(this.state.listData)

    }

    getNameByTypeId(productTypes,typeId){
        if(typeof(productTypes)=='undefined') return '未知'
        for (let i = 0; i < productTypes.length; i++) {
            if (productTypes[i].id == typeId)
                return productTypes[i].name
        }
        return '未知'
    }

    Product(props) {

        const productColumns = [
            {
                title: '商品名',
                dataIndex: 'name',
                key: '1'
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: '2'
            },
            {
                title: '商品号',
                dataIndex: 'id',
                key: '3'
            },
            {
                title: '余量',
                dataIndex: 'rest',
                key: '4'
            },
            {
                title: '种类',
                dataIndex: 'typeId',
                key: '5',
                render(text, record) {
                    return props.getNameByTypeId(props.productTypes,text)
                }
            },
            {
                title: '是否上架',
                dataIndex: 'abled',
                key: '6',
                render(text, record) {
                    return text ? '是' : '否'
                }
            }
        ]
        let productlist = [props.product]
        return (<div>
                    <Table columns={productColumns}
                           dataSource={productlist}
                           pagination={false}
                           rowKey={record => record.id}/>
                </div>)
    }

    render() {

        const expandedRowRender = (record, index, indent, expanded) =>{
            return <this.Product product={record.product} getNameByTypeId={this.getNameByTypeId.bind(this)}
                                 productTypes={this.state.productTypes}/>
        };

        const columns = [
            {
                title: '主键',
                dataIndex: 'mainKey',
                key: '1',
                ...global.data.getTextTruncProps()
            }, {
                title: '商品id',
                dataIndex: 'productId',
                key: '2',
                render: (text, record) => {
                    return (
                        <Tooltip title="点击查看">
                        <span onClick={() => {
                        }}>{text}</span>
                        </Tooltip>
                    )
                }
            }, {
                title: '预付单id',
                dataIndex: 'preorderId',
                key: '3',
                ...global.data.getTextTruncProps()
            }, {
                title: '数量',
                dataIndex: 'num',
                key: '4'
            }, {
                title: '总价',
                dataIndex: 'totalFee',
                key: '5'
            }, {
                title: '用户id',
                dataIndex: 'userid',
                key: '6',
                ...global.data.getTextTruncProps()
            }, {
                title: '时间',
                dataIndex: 'time',
                key: '7'
            }]

        return (
            <div>
                <Table columns={columns}
                       expandedRowRender={expandedRowRender}
                       dataSource={this.state.listData}
                       pagination={false}
                       rowKey={record => record.mainKey}/>
            </div>
        )
    }


}
