import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {createSelector} from 'reselect';
import {updateUsername, updatePassword} from '../../actions/loginAction';
import connect from 'react-redux/es/connect/connect';
import {Cookie} from '../../cookie';
import {Icon, Button, Typography, Paper, CircularProgress} from '@material-ui/core';
import '../login/login.scss';

const cookie = new Cookie();

class Login extends Component {
  constructor(props) {
    super(props);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateUsername(event) {
    this.props.onUpdateUsername(event.target.value);
  }

  updatePassword(event) {
    this.props.onUpdatePassword(event.target.value);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="login-wrap">
        <div className="login-drag-bar"></div>
        <div className="login-container">
          <div className="login-loading">
            <CircularProgress size={50} color="secondary" />
          </div>
          <div className="login-logo">
            <img src={require(`${__static}/image/logo.png`)} alt=""/>
          </div>
          <Typography className="login-welcome" variant="headline" gutterBottom color="primary">
            欢迎登陆Testwa
          </Typography>
          <div className="login-input-field">
            <Paper className="login-input-field-paper">
              <Icon color="primary">perm_identity</Icon>
              <input type="text" value={this.props.username} onChange={this.updateUsername} />
            </Paper>
          </div>
          <div className="login-input-field">
            <Paper className="login-input-field-paper">
              <Icon color="primary">lock_open</Icon>
              <input type="password" value={this.props.password} onChange={this.updatePassword} />
            </Paper>
          </div>
          <Button className="login-button" variant="contained" color="primary">登录</Button>
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