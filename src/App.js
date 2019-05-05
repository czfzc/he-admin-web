import React from 'react';
import './App.css';
import Index from "./pages/Index/Index";
import {Login} from "./pages/Login/Login"
import axios from './common/axios';
import {message} from 'antd'
import cookie from './common/cookie'

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            loading: false
        }
        this.toLogin = this.toLogin.bind(this)
    }

    componentWillMount() {
        this.tryLogin()
    }


    tryLogin() {
        console.log("validating session_key")
        axios("http://127.0.0.1:8081/admin/validate", {
            session_key: cookie.getCookie("session_key")
        }).then((res) => {
            if (res.data.status) {
                this.setState({
                    isLogin: true
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    toLogin(name, password, event) {
        event.preventDefault();
        this.setState({
            loading: true
        })

        axios("http://127.0.0.1:8081/admin/login", {
            admin_id: name,
            raw_password: password
        }).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                this.setState({
                    isLogin: true,
                    session_key: res.data.session_key
                })
                cookie.setCookie("session_key", '')
                cookie.setCookie("session_key", res.data.session_key)
            } else {
                message.error('密码错误');
            }
        }).catch((error) => {
            console.log(error)
            message.error('网络错误');
        })

        this.setState({
            loading: false
        })

    }

    render() {
        return (
            this.state.isLogin ? <Index/> : <Login toLogin={this.toLogin} loading={this.state.loading}/>
        )
    }
}
