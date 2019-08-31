import React from 'react'
import {message,Menu,Icon,Row,Col,Pagination,Button} from 'antd'
import ProductCard from '../../../components/ProductCard'
import axios from "../../../common/axios";
import "../../../config"

export default class ShopProduct extends React.Component{

    state = {
        buildingId:global.data.building[0].id,
        products : [],
        productTypes:[],
        session_key:global.data.session_key,
        page:1,
        pageSize:20,
        total:0,
        defaultImg:'https://timgsa.baidu.com/timg?' +
            'image&quality=80&size=b9999_10000&sec=15' +
            '67249488846&di=eca5987a51448437b22715aa7b1' +
            '7309a&imgtype=0&src=http%3A%2F%2Fp2.so.qh' +
            'imgs1.com%2Ft010147a810cb3c47d2.jpg'
    }

    constructor(props){
        super(props)
        this.selectBuilding = this.selectBuilding.bind(this)
        this.getData = this.getData.bind(this)
        this.setPage = this.setPage.bind(this)
        this.addProduct = this.addProduct.bind(this)
        this.cancelNewAdd = this.cancelNewAdd.bind(this)
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
                <Button type="primary" onClick={this.addProduct} style={{margin:10}}>添加商品</Button>
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
                <Pagination showQuickJumper defaultCurrent={this.state.page} pageSize={this.state.pageSize} total={500} onChange={this.setPage} />

            </div>
            )
    }
}