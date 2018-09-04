import { ipcRenderer, remote } from 'electron'
import React, {Component} from 'react';
import {createSelector} from 'reselect';
import {updateUsername, updatePassword} from '../../actions/loginAction';
import connect from 'react-redux/es/connect/connect';
import {Icon, Button, Typography, Paper, Snackbar} from '@material-ui/core';
import { MySnackbarContentWrapper } from '../custormSnackbars/custormSnackbars';
import * as anime from 'animejs';
import '../login/login.scss';
import { LOGIN_URL} from '../../../main/config';
const session = remote.session.defaultSession
const expirationDate = Math.round(new Date().getTime() / 1000) + 24 * 60 * 60 * 30

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFocus: false,
      passwordFocus: false,
      open: false,
      type: false
    }
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.usernameFocus = this.usernameFocus.bind(this);
    this.usernameBlur = this.usernameBlur.bind(this);
    this.passwordFocus = this.passwordFocus.bind(this);
    this.passwordBlur = this.passwordBlur.bind(this);
    this.login = this.login.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('check_env_result', (event, args) => {
      if (args) {
        this.props.history.push('/simple')
      } else {
        this.props.history.push('/control/config')
      }
    })
    anime({
      targets: '.login-background .login-svg-path',
      d: [
        { value: 'M0 100 L0 100 L190 300 L0 500 L0 500 L190 300 L0 100 Z'},
        { value: 'M0 100 L0 40 L250 300 L0 560 L0 440 L130 300 L0 160 Z' }
      ],
      easing: 'easeOutQuad',
      duration: 1000,
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('check_env_result')
  }

  updateUsername(event) {
    this.props.onUpdateUsername(event.target.value);
  }

  updatePassword(event) {
    this.props.onUpdatePassword(event.target.value);
  }

  usernameFocus() {
    this.setState({usernameFocus: true});
  }

  usernameBlur() {
    this.setState({usernameFocus: false});
  }

  passwordFocus() {
    this.setState({passwordFocus: true});
  }

  passwordBlur() {
    this.setState({passwordFocus: false});
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  login() {
    fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({
        username: this.props.username,
        password: this.props.password
      })
    })
      .then(response => {
        if(response.ok){
          return response.json();
         }
        throw new Error('Request failed!');
      })
      .then(res => {
        if (res.code === 0) {
          session.cookies.set({
            url: LOGIN_URL,
            name: 'username',
            value: this.props.username,
            expirationDate: expirationDate
          }, error => {
            if(error) console.log(error)
          })
          session.cookies.set({
            url: LOGIN_URL,
            name: 'password',
            value: this.props.password,
            expirationDate: expirationDate
          }, error => {
            if(error) console.log(error)
          })
          anime({
            targets: '.login-background .login-svg-path',
            d: [
              { value: 'M0 100 L0 40 L250 300 L0 560 L0 440 L130 300 L0 160 Z' },
              { value: 'M0 100 L0 100 L190 300 L0 500 L0 500 L190 300 L0 100 Z'}
            ],
            easing: 'easeOutQuad',
            duration: 350,
          })
          this.setState({open: true, type: true})
          setTimeout(() => {
            this.props.history.push('/')
            ipcRenderer.send('init_check_env')
          }, 300);
        } else {
          this.setState({open: true, type: false})
        }
      })
      .catch(err => {
        this.setState({open: true, type: false})
      })
  }

  render() {
    return (
      <div className="login-wrap">
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={this.state.type ? 'success' : 'error'}
            message={this.state.type ? '登录成功！' : '账号或密码错误！'}
          />
        </Snackbar>
        <div className="login-background">
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
            <title>background</title>
            <path className="login-svg-path" fill="#d2dbdf" d="M0 100 L0 100 L190 300 L0 500 L0 500 L190 300 L0 100 Z"></path>
          </svg>
        </div>
        <div className="login-drag-bar"></div>
        <div className="login-container">
          <div className="login-logo">
            <img src={require(`${__static}/image/logo.png`)} alt=""/>
          </div>
          <Typography className="login-welcome" variant="headline" gutterBottom color="primary">
            欢迎登陆Testwa
          </Typography>
          <div className={this.state.usernameFocus ? 'login-input-field input-focus' : 'login-input-field'}>
            <Paper className="login-input-field-paper">
              <Icon color={this.state.usernameFocus ? 'secondary' : 'primary'}>perm_identity</Icon>
              <input type="text" onFocus={this.usernameFocus} onBlur={this.usernameBlur} value={this.props.username} onChange={this.updateUsername} />
            </Paper>
          </div>
          <div className={this.state.passwordFocus ? 'login-input-field input-focus' : 'login-input-field'}>
            <Paper className="login-input-field-paper">
              <Icon color={this.state.passwordFocus ? 'secondary' : 'primary'}>lock_open</Icon>
              <input type="password" onFocus={this.passwordFocus} onBlur={this.passwordBlur} value={this.props.password} onChange={this.updatePassword} />
            </Paper>
          </div>
          <Button className="login-button" variant="contained" color="primary" onClick={this.login}>登录</Button>
        </div>
      </div>
    )
  }
}

const usernameSelector = createSelector(
  state => state.username,
  username => username
)
const passwordSelector = createSelector(
  state => state.password,
  password => password
)

const mapStateToProps = createSelector(
  usernameSelector,
  passwordSelector,
  (username, password) => ({
    username,
    password
  })
)

const mapActionsToProps = {
  onUpdateUsername: updateUsername,
  onUpdatePassword: updatePassword
}

export default connect(mapStateToProps, mapActionsToProps)(Login);