import React, {Component} from 'react';
import {createSelector} from 'reselect';
import {updateUsername, updatePassword} from '../../actions/loginAction';
import connect from 'react-redux/es/connect/connect';
import {Icon, Button, Typography, Paper} from '@material-ui/core';
import {Link} from 'react-router-dom';
import '../login/login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentDidMount() {
    console.log('login component did mount!')
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