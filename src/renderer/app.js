import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import '././style.scss';
import Config from './component/config';
import Terminal from './component/terminal';
import Login from './component/login/login';
import {Cookie} from './cookie';
import {CircularProgress} from '@material-ui/core';

const cookie = new Cookie();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    setTimeout(() => {
      cookie.get('username') ? this.props.history.push('/config') : this.props.history.push('/login');
      this.setState({loading: false});
    }, 1000)
  }

  render() {
    return (
      <div className="app-wrap">
        <Switch>
          <Route exact path='/' component={() => (
            <div className="app-loading">
              <CircularProgress size={50} color="secondary" />
            </div>
          )}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/config' component={Config}></Route>
          <Route path='/terminal' component={Terminal}></Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)