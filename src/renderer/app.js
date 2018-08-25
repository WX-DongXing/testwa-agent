import { ipcRenderer, remote } from 'electron'
import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import Login from './component/login/login'
import Control from './component/control/control'
import Terminal from './component/ternimal/terminal';
import {CircularProgress} from '@material-ui/core'
import '././style.scss'
const session = remote.session.defaultSession
const LOGIN_URL = 'http://api.test.testwa.com/v1/auth/login'

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

    // session.cookies.remove(LOGIN_URL, 'username', error => {
    //   console.log('remove username')
    //   if (error) console.log(error)
    // })

    session.cookies.get({name: 'username'}, (error, cookies) => {
      if (cookies.length === 0) {
        this.props.history.push('/login')
      } else {
        ipcRenderer.send('init_check_env')
      }
    })
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