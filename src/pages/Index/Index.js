import React from 'react';
import './Index.css';
import {
    Layout, Menu, Breadcrumb, Icon, List, Avatar, Table
} from 'antd';
import cookie from '../../common/cookie'
import Order from '../Front/Order/Order'
import ExpressPreorder from '../Front/ExpressPreorder/ExpressPreorder'
import Express from '../Front/Express/Express'
import Refund from '../Front/Refund/Refund'

const { SubMenu } = Menu;
const {
    Header, Content, Footer, Sider,
} = Layout;


export default class Index extends React.Component{

    state={
        index:1,
        session_key:cookie.getCookie('session_key'),
        listData:[],
        pagination:{
            current:1,
            pageSize:10
        },
        loading:false
    }

    constructor(props){
        super(props)
        this.selectList=this.selectList.bind(this)
    }

    getList(){
        switch(this.state.index){
            case 1:
                return (
                    <Order pagination={this.state.pagination}
                           session_key={this.state.session_key}/>
                )
            case 2:
                return (
                    <ExpressPreorder pagination={this.state.pagination}
                           session_key={this.state.session_key}/>
                )
            case 3:
                return (
                    <Express pagination={this.state.pagination}
                                     session_key={this.state.session_key}/>
                )
            case 4:
                return (
                    <Refund pagination={this.state.pagination}
                             session_key={this.state.session_key}/>
                )
        }

    }

    selectList(index){
        if(this.state.index!==index)
            this.setState({
                index:index
            })
    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">概览</Menu.Item>
                        <Menu.Item key="2">后台</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>后台</Breadcrumb.Item>
                        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                        <Breadcrumb.Item>总订单</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={200} style={{ background: '#fff' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}
                            >
                                <SubMenu key="sub1" title={<span><Icon type="solution" />订单管理</span>}>
                                    <Menu.Item key="1" onClick={this.selectList.bind(this,1)}>总订单</Menu.Item>
                                    <Menu.Item key="2" onClick={this.selectList.bind(this,2)}>快递代取预付单</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub3" title={<span><Icon type="tool" />综合管理</span>}>
                                    <Menu.Item key="4" onClick={this.selectList.bind(this,3)}>代取快递</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub4" title={<span><Icon type="exception" />退款情况</span>}>
                                    <Menu.Item key="5" onClick={this.selectList.bind(this,4)}>退款订单</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon type="user" />账号管理</span>}>
                                    <Menu.Item key="6" onClick={this.selectList.bind(this,5)}>我的信息</Menu.Item>
                                    <Menu.Item key="7" onClick={this.selectList.bind(this,6)}>密码修改</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            {this.getList()}
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    沈阳市小一小时网络服务部@2019
                </Footer>
            </Layout>
        )
    }
}
