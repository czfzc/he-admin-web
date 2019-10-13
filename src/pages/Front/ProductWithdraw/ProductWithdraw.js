import { Table, Badge, Menu, Dropdown, Icon, message, Popconfirm, Pagination } from 'antd';
import React from 'react'
import axios from "../../../common/axios";
import ProductTable from '../../../components/ProductTable'

export default class ProductWithdraw extends React.Component{

    state = {
        page:1,
        pageSize:20,
        total:0,
        buildingId: global.data.building[0].id
    }

    constructor(props){
        super(props)
        this.state.session_key = global.data.session_key
        this.changePage = this.changePage.bind(this)
        this.selectBuilding = this.selectBuilding.bind(this)
    }

    componentDidMount() {
        this.getData(this.state.buildingId);
    }

    getData(buildingId){
        axios(global.data.host+'/admin/get_product_preorder_withdraw', {
            session_key: this.state.session_key,
            page: this.state.page-1,
            size: this.state.pageSize,
            building_id: buildingId
        }).then((res) => {
            this.state.buildingId=res.data.buildingId
            this.setState({
                preorders:res.data.content,
                total:res.data.totalElements,
                pageSize:res.data.size
            })
        }).catch((error) => {
            message.error('网络错误')
        })
        //获取商品类型
        axios(global.data.host+'/admin/get_shop_product_type', {
            session_key: this.state.session_key,
            building_id: buildingId
        }).then((res) => {
            this.setState({
                productTypes:res.data
            })
        }).catch((error) => {
            message.error('网络错误')
        })

    }

    setSended(id){
        axios(global.data.host+'/admin/set_product_preorder_sended', {
            session_key: this.state.session_key,
            preorder_id:id
        }).then((res) => {
            if(res.data.status){
                message.success('成功')
                this.getData(this.state.buildingId);
            }else message.success('失败')
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    changePage(page){
        this.setState({
            page:page
        })
        this.getData(this.state.buildingId);
    }

    selectBuilding(e){
        console.log(e.key)
        this.getData(e.key)
        this.setState({
            buildingId : e.key
        })
    }

    render() {
        const expandedRowRender = (record, index, indent, expanded) => {
            return <ProductTable listData={record.userProduct} buildingId={this.state.buildingId} productTypes={this.state.productTypes}/>
        };

        const columns = [
            { title: '商品预付单号', dataIndex: 'id', key: '1',...global.data.getTextTruncProps() },
            { title: '总价', dataIndex: 'totalFee', key: '2' },
            { title: '时间', dataIndex: 'time', key: '3' },
            { title: '用户id', dataIndex: 'userId', key: '4' },
            {
                title:'姓名',
                render:(text,record)=>{
                    return record.address.name
                }
            },
            {
                title:'寝室号',
                render:(text,record)=>{
                    return record.address.roomNum
                }
            },
            {
                title:'电话',
                render:(text,record)=>{
                    return record.address.phoneNum
                }
            },
            { title: '提货码', dataIndex: 'statusData', key: '8' },
            {
                title: '状态',
                dataIndex: 'payed',
                key: '5',
                render: (text,record) => {
                    if (record.payed === 0)
                        return '未付款'
                    if (record.payed === 1)
                        return '已付款'
                    if (record.payed === 2)
                        return '已退款'
                    if (record.payed === 3)
                        return '已申请退款'
                }
            },
            {
                title: '送货方式',
                dataIndex: '6',
                key: '6' ,
                render: (text,record) => {
                    return global.data.getValueById('sendMethodIdProduct',text)
                }
            },
            { title: '备注', dataIndex: 'addition', key: '9' },
            {
                title: '操作',
                key: '7',
                render: (text,record) => {
                    return record.status != 3?(<Popconfirm title="不可撤销，确定?"
                                                           onConfirm={this.setSended.bind(this,record.id)} okText="Yes" cancelText="No">
                        <a>设置已送达</a></Popconfirm>):<div>已送达</div>
                }
            },
        ];

        return (
            <div>
                <Menu onClick={this.selectBuilding} selectedKeys={[this.state.buildingId]} mode="horizontal">
                    {
                        global.data.building.map((item)=>{
                            return (
                                <Menu.Item key={item.id}>
                                    <Icon type="mail" />
                                    {item.name}
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandedRowRender={expandedRowRender}
                    dataSource={this.state.preorders}
                    scroll={{ x: 1300 }}
                />
                <Pagination showQuickJumper defaultCurrent={this.state.page} total={this.state.total} onChange={this.changePage} />
            </div>
        );
    }
}