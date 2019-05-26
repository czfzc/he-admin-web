import React from 'react'
import {HashRouter, Route, Switch, hashHistory} from 'react-router-dom';
import {Index} from '../pages/Index/Index'
import {Login} from '../pages/Login/Login'
import {App} from '../App'

const BasicRoute = () => (
    <HashRouter history={hashHistory}>
        <Switch>
            <Route exact path="/index" component={Index}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/" component={App}/>
        </Switch>
    </HashRouter>
);


export default BasicRoute;
