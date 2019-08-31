import React from "react";
import "../config"
import axios from "../common/axios"
import {Card,Input,Icon,Popconfirm,Typography,Select,InputNumber,message} from 'antd'
const { Title, Text } = Typography;
const {TextArea} = Input
const {Option} = Select

export default class ProductCard extends React.Component{
    /**
     * {
        "id": "ff8081816cbf0e39016cbf0e80c70000",
        "name": "奥利奥",
        "price": 5.5,
        "abled": true,
        "rest": 15,
        "typeId": "989",
        "imgLink": "https://www.baidu.com/img/bd_logo.png",
        "addition": "暂无添加",
        "time": "2019-08-23 23:18:52"
       }
     */
    state = {
        product:{},
        isChanging:false,
        productTemp:{},
        productTypes:[],
        buildingId:'',
        isNew:false,
        getData:function(){},
        cancel:function () {},
    }

    constructor(props){
        super(props)
        this.state.product = props.product
        this.state.productTypes = props.productTypes
        this.state.buildingId = props.buildingId
        this.state.getData = props.getData
        this.state.isChanging = props.isChanging
        this.state.isNew = props.isNew
        this.state.cancel = props.cancel
        this.onEdit = this.onEdit.bind(this)
        this.edit = this.edit.bind(this)
        this.delete = this.delete.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.handleName = this.handleName.bind(this)
        this.handleAddition = this.handleAddition.bind(this)
        this.handlePrice = this.handlePrice.bind(this)
        this.handleRest = this.handleRest.bind(this)
        this.handleAbled = this.handleAbled.bind(this)
        this.handleType = this.handleType.bind(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.state.productTemp = global.data.deepClone(this.state.product)
        this.setState({
            product : nextProps.product,
            productTypes:nextProps.productTypes
        })
    }

    onEdit(){
        this.setState({
            isChanging:true,
            productTemp : global.data.deepClone(this.state.product)
        })

    }

    edit(){
        if(this.state.isNew){
            //添加商品
            axios(global.data.host + '/admin/add_shop_product', {
                session_key: global.data.session_key,
                building_id: this.state.buildingId,
                name: this.state.productTemp.name,
                price: this.state.productTemp.price,
                rest: this.state.productTemp.rest,
                type_id: this.state.productTemp.typeId,
                img_link: this.state.productTemp.imgLink,
                abled: this.state.productTemp.abled,
                addition: this.state.productTemp.addition
            }).then((res) => {
                message.success("添加成功")
                this.state.getData(this.state.buildingId)
                this.setState({
                    isChanging: false,
                    isNew:false
                })
            }).catch((error) => {
                message.error('添加失败')
            })
        }else {
            //修改商品
            axios(global.data.host + '/admin/edit_shop_product', {
                session_key: global.data.session_key,
                product_id: this.state.productTemp.id,
                building_id: this.state.buildingId,
                name: this.state.productTemp.name,
                price: this.state.productTemp.price,
                rest: this.state.productTemp.rest,
                type_id: this.state.productTemp.typeId,
                img_link: this.state.productTemp.imgLink,
                abled: this.state.productTemp.abled,
                addition: this.state.productTemp.addition
            }).then((res) => {
                message.success("修改成功")
                this.state.getData(this.state.buildingId)
                this.setState({
                    isChanging: false
                })
            }).catch((error) => {
                message.error('修改失败')
            })
        }

    }

    delete(){
        //删除商品
        axios(global.data.host+'/admin/remove_shop_product', {
            session_key: global.data.session_key,
            product_id: this.state.product.id,
        }).then((res) => {
            message.success("删除成功")
            this.state.getData(this.state.buildingId)
        }).catch((error) => {
            message.error('删除失败')
        })
    }

    onCancel(){
        if(this.state.isNew){
            this.state.cancel()
        }else{
            this.setState({
                isChanging:false
            })
        }
    }

    handleName(e){
        this.state.productTemp.name = e.target.value
    }

    handlePrice(value){
        this.state.productTemp.price = value
    }

    handleRest(value){
        this.state.productTemp.rest = value
    }

    handleAddition(e){
        this.state.productTemp.addition = e.target.value
    }

    handleAbled(e){
        this.state.productTemp.abled = e.key
    }

    handleType(e){
        console.log(e)
        this.state.productTemp.typeId = e.key
    }

    getNameByTypeId(typeId){
        for(let i=0;i<this.state.productTypes.length;i++){
            if(this.state.productTypes[i].id == typeId)
                return this.state.productTypes[i].name
        }
        return '未知'
    }

    render(){
        return (
            <Card
                style={{ width: 230 ,margin:10}}
                hoverable
                size="small"
                cover={
                    <img
                        alt="example"
                        src={this.state.product.imgLink}
                    />
                }
                actions={[
                    (this.state.isChanging ?
                        <Icon type="check" key="check" onClick={this.edit} />:
                        <Icon type="edit" key="edit" onClick={this.onEdit} /> )
                    ,
                    (this.state.isChanging ?
                        <Popconfirm title="确定取消?"
                                    onConfirm={this.onCancel} okText="Yes" cancelText="No">
                            <Icon type="close" key="close"/></Popconfirm>:
                        <Popconfirm title="确定删除?"
                                    onConfirm={this.delete} okText="Yes" cancelText="No">
                            <Icon type="delete" key="delete"/></Popconfirm>
                    )

                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    名称：
                    {this.state.isChanging?
                        <Input defaultValue={this.state.productTemp.name} onChange={this.handleName} />
                        :
                        <Text>{this.state.product.name}</Text>
                    }

                </div>
                <div style={{ marginBottom: 16 }}>
                    价格：
                    {this.state.isChanging?
                        <InputNumber addonBefore="价格" addonAfter="元" defaultValue={this.state.productTemp.price} onChange={this.handlePrice}/>
                        :
                        <Text>{this.state.product.price}元</Text>
                    }
                </div>
                <div style={{ marginBottom: 16 }}>
                    剩余：
                    {this.state.isChanging?
                        <InputNumber addonBefore="剩余" defaultValue={this.state.productTemp.rest} onChange={this.handleRest} />
                        :
                        <Text>{this.state.product.rest}</Text>
                    }
                </div>
                <div style={{ marginBottom: 16 }}>
                    种类：
                    {this.state.isChanging?
                        <Select
                            labelInValue
                            defaultValue={{ key: this.state.productTemp.typeId }}
                            style={{ width: 120 }}
                            onChange={this.handleType}
                            >
                            {
                                this.state.productTypes.map((item)=>{
                                    return(
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        :
                        <Text>{this.getNameByTypeId(this.state.product.typeId)}</Text>
                    }
                </div>
                <div style={{ marginBottom: 16 }}>
                    状态：
                    {this.state.isChanging?
                        <Select
                            labelInValue
                            defaultValue={{ key: this.state.productTemp.abled?"1":"0" }}
                            style={{ width: 120 }}
                            onChange={this.handleAbled}
                        >
                            <Option value="1">上架</Option>
                            <Option value="0">下架</Option>
                        </Select>
                        :
                        <Text>{this.state.product.abled?"上架":"下架"}
                        </Text>
                    }
                </div>
                <div style={{ marginBottom: 16 }}>
                    {this.state.isChanging?
                        <TextArea rows={4} defaultValue={this.state.productTemp.addition} onChange={this.handleAddition}/>
                        :
                        <Text>备注：{this.state.product.addition}</Text>
                    }
                </div>

            </Card>
        )
    }

}