import { ipcRenderer } from 'electron'
import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import Login from './component/login/login'
import Control from './component/control/control'
import Terminal from './component/ternimal/terminal';
import { Cookie } from './cookie'
import {CircularProgress} from '@material-ui/core'
import '././style.scss'

const cookie = new Cookie();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {

    ipcRenderer.on('init_check_env_result', (event, args) => {
      if (args) {
        this.props.history.push('/control/simple')
      } else {
        this.props.history.push('/control/config')
      }
    })
    // cookie.remove('username')
    if (cookie.get('username')) {
      ipcRenderer.send('init_check_env')
    } else {
      this.props.history.push('/login')
    }
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
          <Route path='/control' component={Control}></Route>
          <Route path='/terminal' component={Terminal}></Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)