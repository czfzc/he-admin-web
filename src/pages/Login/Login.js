import React from 'react';
import './Login.css'
import {
    Form, Icon, Input, Button, Checkbox
} from 'antd';

class LoginForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            userId:'',
            pass:'',
            loading:props.loading
        }
        this.handlePass=this.handlePass.bind(this)
        this.handleUserId=this.handleUserId.bind(this)
    }

    handleUserId(event){
        this.setState({
            userId:event.target.value
        })
    }

    handlePass(event){
        this.setState({
            pass:event.target.value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <Form onSubmit={this.props.toLogin.bind(this,this.state.userId,this.state.pass)} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('userId', {
                            rules: [{ required: true, message: '请输入手机号!' }],
                        })(
                            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                   placeholder="手机号" onChange={this.handleUserId}/>
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                   type="password" placeholder="密码" onChange={this.handlePass} />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住我</Checkbox>
                        )}
                        <a className="login-form-forgot" href="">忘记密码</a>
                        <Button loading={this.state.loading} size="large" type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        <a href="">注册</a>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export const Login=Form.create({ name: 'normal_login' })(LoginForm);
