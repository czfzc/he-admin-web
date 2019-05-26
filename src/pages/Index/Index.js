import React from 'react';
import './Index.css';
import {Menu, Breadcrumb,Icon,Layout} from 'antd';
import cookie from '../../common/cookie'
import {Order} from '../Front/Order/Order'
import {ExpressPreorder} from '../Front/ExpressPreorder/ExpressPreorder'
import {Express} from '../Front/Express/Express'
import {Refund} from '../Front/Refund/Refund'
import {ExpressPrice} from '../Front/ExpressPrice/ExpressPrice'
import {SendMethod} from '../Front/SendMethod/SendMethod'
import {ExpressPoint} from '../Front/ExpressPoint/ExpressPoint'
import {ExpressSize} from '../Front/ExpressSize/ExpressSize'
import {DestPoint} from '../Front/DestPoint/DestPoint'

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
    }

    getList() {
        switch (this.state.index) {
            case 1:
                return (
                    <Order />
                )
            case 2:
                return (
                    <ExpressPreorder />
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
        }

    }

    selectList(index) {
        if (this.state.index !== index)
            this.setState({
                index: index
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
                                <SubMenu key="sub2" title={<span><Icon type="tool"/>快递管理</span>}>
                                    <Menu.Item key="3" onClick={this.selectList.bind(this, 3)}>代取快递列表</Menu.Item>
                                    <Menu.Item key="5" onClick={this.selectList.bind(this, 5)}>代取快递价格管理</Menu.Item>
                                    <Menu.Item key="8" onClick={this.selectList.bind(this, 8)}>快递点管理</Menu.Item>
                                    <Menu.Item key="9" onClick={this.selectList.bind(this, 9)}>送货方式管理</Menu.Item>
                                    <Menu.Item key="10" onClick={this.selectList.bind(this, 10)}>目的地管理</Menu.Item>
                                    <Menu.Item key="11" onClick={this.selectList.bind(this, 11)}>快递质量规则管理</Menu.Item>
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
