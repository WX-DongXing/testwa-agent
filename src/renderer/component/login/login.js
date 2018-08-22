import React, {Component} from 'react';
import {createSelector} from 'reselect';
import {updateUsername, updatePassword} from '../../actions/loginAction';
import connect from 'react-redux/es/connect/connect';
import {Icon, Button, Typography, Paper} from '@material-ui/core';
import {Link} from 'react-router-dom';
import '../login/login.scss';
import * as anime from 'animejs';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFocus: false,
      passwordFocus: false,
    }
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.usernameFocus = this.usernameFocus.bind(this);
    this.usernameBlur = this.usernameBlur.bind(this);
    this.passwordFocus = this.passwordFocus.bind(this);
    this.passwordBlur = this.passwordBlur.bind(this);
  }

  componentDidMount() {
    console.log('did mount!')
    anime({
      targets: '.login-background .login-svg-path',
      d: [
        { value: 'M0 100 L0 99 L191 300 L0 501 L0 499 L189 300 L0 101 Z'},
        { value: 'M0 100 L0 40 L250 300 L0 560 L0 440 L130 300 L0 160 Z' }
      ],
      easing: 'easeOutQuad',
      duration: 1000,
    })
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

  render() {
    return (
      <div className="login-wrap">
        <div className="login-background">
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
            <title>background</title>
            <path className="login-svg-path" fill="rgb(80, 170, 56)" d="M0 100 L0 99 L191 300 L0 501 L0 499 L189 300 L0 101 Z"></path>
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
          <Link to='/config'>
            <Button className="login-button" variant="contained" color="primary">登录</Button>
          </Link>
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