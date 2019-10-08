import React from 'react'
import {message,Menu,Icon,Row,Col,Pagination,Button,Input} from 'antd'
import ProductCard from '../../../components/ProductCard'
import axios from "../../../common/axios";
import "../../../config"

const {Search} = Input

export default class ShopProduct extends React.Component{

    state = {
        buildingId:global.data.building[0].id,
        products : [],
        productTypes:[],
        session_key:global.data.session_key,
        page:1,
        pageSize:20,
        total:0,
        defaultImg:null
    }

    constructor(props){
        super(props)
        this.selectBuilding = this.selectBuilding.bind(this)
        this.getData = this.getData.bind(this)
        this.setPage = this.setPage.bind(this)
        this.addProduct = this.addProduct.bind(this)
        this.cancelNewAdd = this.cancelNewAdd.bind(this)
        this.onSearch = this.onSearch.bind(this)
    }

    componentDidMount() {
        this.getData(this.state.buildingId)
    }

    cancelNewAdd(){
        this.state.products.shift();
        this.setState({
            products:this.state.products
        })
    }

    selectBuilding(e){
        console.log(e.key)
        this.getData(e.key)
        this.setState({
            buildingId : e.key
        })
    }

    getData(buildingId){
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

        //获取商品
        axios(global.data.host+'/admin/get_shop_product', {
            session_key: this.state.session_key,
            building_id: buildingId,
            page:this.state.page-1,
            size:this.state.pageSize
        }).then((res) => {
            this.setState({
                products:res.data.content,
                total:res.data.totalElements
            })
        }).catch((error) => {
            message.error('网络错误')
        })

    }

    setPage(page){
        this.state.page = page
        this.getData(this.state.buildingId)
        this.setState({
            page:page
        })
    }

    addProduct(){
        this.state.products.unshift({
            id:'000000',
            buildingId:'',
            name:'',
            price:0,
            rest:0,
            typeId:'',
            imgLink:this.state.defaultImg,
            abled:true,
            addition:'',
            isChanging:true,
            isNew:true
        })

        this.setState({
            products:this.state.products
        })

    }

    onSearch(e){
        //获取商品
        if (e.target.value=='')
            this.getData(this.state.buildingId)

        axios(global.data.host+'/admin/search_shop_product_by_name', {
            session_key: this.state.session_key,
            building_id: this.state.buildingId,
            page:this.state.page-1,
            size:this.state.pageSize,
            value:e.target.value
        }).then((res) => {
            this.setState({
                products:res.data.content,
                total:res.data.totalElements
            })
        }).catch((error) => {
            message.error('网络错误')
        })

    }

    render() {

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
                <Row gutter={0} type="flex" style={{marginLeft:12}}>
                    <Button type="primary" size="large" onClick={this.addProduct} style={{margin:10}}>添加商品</Button>
                    <Col span={10} style={{marginTop:10}}>
                        <Search
                            placeholder="输入商品名"
                            enterButton="搜索"
                            size="large"
                            allowClear
                            onChange={this.onSearch}
                        />
                    </Col>
                </Row>
                <Row gutter={0} type="flex">
                    {
                        this.state.products.map((item)=>{
                            return(
                                <Col span={6} key={item.id}>
                                    <ProductCard product={item} productTypes={this.state.productTypes} buildingId={this.state.buildingId}
                                        getData={this.getData} isChanging={item.isChanging} isNew={item.isNew} cancel={this.cancelNewAdd}/>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Pagination showQuickJumper defaultCurrent={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onChange={this.setPage} />

            </div>
            )
    }
}