import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import '././style.scss';
import Config from './component/config';
import Terminal from './component/terminal';
import Login from './component/login/login';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Login}></Route>
        <Route path='/config' component={Config}></Route>
        <Route path='/terminal' component={Terminal}></Route>
      </Switch>
    );
  }
}

export default withRouter(App)