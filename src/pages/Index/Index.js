import React from 'react';
import './Index.css';
import {Menu, Breadcrumb,Icon,Layout,message} from 'antd';
import cookie from '../../common/cookie'
import {Order} from '../Front/Order/Order'
import {Preorder} from '../Front/Preorder/Preorder'
import {Express} from '../Front/Express/Express'
import {Refund} from '../Front/Refund/Refund'
import {ExpressPrice} from '../Front/ExpressPrice/ExpressPrice'
import {SendMethod} from '../Front/SendMethod/SendMethod'
import {ExpressPoint} from '../Front/ExpressPoint/ExpressPoint'
import {ExpressSize} from '../Front/ExpressSize/ExpressSize'
import {DestPoint} from '../Front/DestPoint/DestPoint'
import {ProductType} from '../Front/ProductType/ProductType'
import ProductSend from '../Front/ProductSend/ProductSend'
import ProductWithdraw from '../Front/ProductWithdraw/ProductWithdraw'
import ShopProduct from "../Front/ShopProduct/ShopProduct";
import axios from "../../common/axios";
import "../../config"


const {SubMenu} = Menu;
const {
    Header, Content, Footer, Sider,
} = Layout;


export class Index extends React.Component {

    state = {
        index: 1,
        session_key: cookie.getCookie('session_key'),
        loading: false
    }

    constructor(props) {
        super(props)
        this.selectList = this.selectList.bind(this)
        global.data.session_key = this.state.session_key;
        this.getExtraData()
    }

    getList() {
        switch (this.state.index) {
            case 1:
                return (
                    <Order />
                )
            case 2:
                return (
                    <Preorder />
                )
            case 3:
                return (
                    <Express />
                )
            case 4:
                return (
                    <Refund />
                )
            case 5:
                return (
                    <ExpressPrice />
                )
            case 9:
                return (
                    <SendMethod />
                )
            case 8:
                return (
                    <ExpressPoint />
                )
            case 11:
                return (
                    <ExpressSize />
                )
            case 10:
                return (
                    <DestPoint />
                )
            case 20:
                return <ProductSend/>
            case 21:
                return <ProductWithdraw/>
            case 22:
                return <ShopProduct/>
            case 23:
                return <ProductType/>
        }

    }

    selectList(index) {
        if (this.state.index !== index)
            this.setState({
                index: index
            })
    }

    /**
     * 获取一些选项的信息
     */

    getExtraData(){
        //获取快递点
        axios(global.data.host+'/admin/get_express_point', {
            session_key: this.state.session_key
        }).then((res) => {
            global.data.expressPoint=res.data
        }).catch((error) => {
            message.error('网络错误')
        })

        //获取快递大小
        axios(global.data.host+'/admin/get_express_size', {
            session_key: this.state.session_key
        }).then((res) => {
            global.data.expressSize=res.data
        }).catch((error) => {
            message.error('网络错误')
        })

        //获取目的地
        axios(global.data.host+'/admin/get_building', {
            session_key: this.state.session_key
        }).then((res) => {
            global.data.building=res.data
        }).catch((error) => {
            message.error('网络错误')
        })

        //获取送货方式
        axios(global.data.host+'/admin/get_send_method', {
            session_key: this.state.session_key
        }).then((res) => {
            global.data.expressSendMethod=res.data
        }).catch((error) => {
            message.error('网络错误')
        })

        //获取商品送货方式
        axios(global.data.host+'/admin/get_send_method', {
            session_key: this.state.session_key,
            service_id:2
        }).then((res) => {
            global.data.productSendMethod=res.data
        }).catch((error) => {
            message.error('网络错误')
        })

        //获取服务
        axios(global.data.host+'/admin/get_service', {
            session_key: this.state.session_key
        }).then((res) => {
            global.data.service=res.data
        }).catch((error) => {
            message.error('网络错误')
        })


    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{lineHeight: '64px'}}
                    >
                        <Menu.Item key="1">概览</Menu.Item>
                        <Menu.Item key="2">后台</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>后台</Breadcrumb.Item>
                        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                        <Breadcrumb.Item>总订单</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout style={{padding: '24px 0', background: '#fff'}}>
                        <Sider width={200} style={{background: '#fff'}}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{height: '100%'}}
                            >
                                <SubMenu key="sub1" title={<span><Icon type="solution"/>订单管理</span>}>
                                    <Menu.Item key="1" onClick={this.selectList.bind(this, 1)}>总订单</Menu.Item>
                                    <Menu.Item key="2" onClick={this.selectList.bind(this, 2)}>预付单</Menu.Item>
                                    <Menu.Item key="4" onClick={this.selectList.bind(this, 4)}>退款订单</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub4" title={<span><Icon type="solution"/>业务管理</span>}>
                                    <Menu.Item key="10" onClick={this.selectList.bind(this, 10)}>目的地管理</Menu.Item>
                                    <Menu.Item key="9" onClick={this.selectList.bind(this, 9)}>送货方式管理</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon type="tool"/>快递管理</span>}>
                                    <Menu.Item key="3" onClick={this.selectList.bind(this, 3)}>代取快递列表</Menu.Item>
                                    <Menu.Item key="5" onClick={this.selectList.bind(this, 5)}>代取快递价格管理</Menu.Item>
                                    <Menu.Item key="8" onClick={this.selectList.bind(this, 8)}>快递点管理</Menu.Item>
                                    <Menu.Item key="11" onClick={this.selectList.bind(this, 11)}>快递质量规则管理</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub3" title={<span><Icon type="tool"/>商品管理</span>}>
                                    <Menu.Item key="20" onClick={this.selectList.bind(this, 20)}>商品待送列表</Menu.Item>
                                    <Menu.Item key="21" onClick={this.selectList.bind(this, 21)}>商品自提列表</Menu.Item>
                                    <Menu.Item key="22" onClick={this.selectList.bind(this, 22)}>商品管理</Menu.Item>
                                    <Menu.Item key="23" onClick={this.selectList.bind(this, 23)}>商品类型管理</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub5" title={<span><Icon type="user"/>账号管理</span>}>
                                    <Menu.Item key="6" onClick={this.selectList.bind(this, 6)}>我的信息</Menu.Item>
                                    <Menu.Item key="7" onClick={this.selectList.bind(this, 7)}>密码修改</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            {this.getList()}
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    沈阳市小一小时网络服务部@2019
                </Footer>
            </Layout>
        )
    }
}
