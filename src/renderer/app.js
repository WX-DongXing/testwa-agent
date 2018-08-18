import React, {Component} from 'react';
import {createSelector} from 'reselect';
import {updateUser} from './actions/userAction';
import { connect } from 'react-redux';
import {Switch, Route, withRouter} from 'react-router-dom';
import '././style.scss';
import Config from './component/config';
import Terminal from './component/terminal';
import Login from './component/login';

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

const userSelector = createSelector(
  state => state.user,
  user => user
)

const mapStateToProps = createSelector(
  userSelector,
  (user) => ({
    user
  })
)

const mapActionsToProps = {
  onUpdateUser: updateUser
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(App));