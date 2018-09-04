import React, { Component } from 'react'
import {Switch, Route, withRouter, NavLink} from 'react-router-dom'
import {AppBar, Divider, List, ListItem, ListItemIcon, IconButton, Toolbar, Tooltip, Icon} from '@material-ui/core';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import CodeRoundedIcon from '@material-ui/icons/CodeRounded';
// import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import Config from './config/config';
import Simple from './simple/simple';
import './control.scss'
import {ipcRenderer} from 'electron';

class Control extends Component {
  constructor(props) {
    super(props)
    this.navigateToLogin = this.navigateToLogin.bind(this)
  }

  componentDidMount(){
    ipcRenderer.on('reset-window', (event, args) => {
      if (args) this.props.history.push('/login')
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('reset-window')
  }

  navigateToLogin() {
    ipcRenderer.send('resetting-window')
  }

  render() {
    return (
      <div className="control-wrap">
        <AppBar position="static" className="control-drag-bar">
          <Toolbar variant="dense">
            <Tooltip title="退出登录">
              <IconButton color="inherit" aria-label="Menu" onClick={this.navigateToLogin}>
                <ExitToAppRounded />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <div className="control-main">
          <List component="nav" className="control-side">
            <NavLink to='/control/config' replace activeClassName='router-active'>
              <ListItem button className="router-link">
                <div className="router-link-side"></div>
                <div className="router-link-content">
                  <div className="router-link-icon">
                    <SettingsRoundedIcon />
                  </div>
                  <p>环境配置</p>
                </div>
              </ListItem>
            </NavLink>

            {/*<NavLink to='/control/simple' replace activeClassName='router-active'>*/}
              {/*<ListItem button className="router-link">*/}
                {/*<div className="router-link-side"></div>*/}
                {/*<div className="router-link-content">*/}
                  {/*<div className="router-link-icon">*/}
                    {/*<SendRoundedIcon />*/}
                  {/*</div>*/}
                  {/*<p>简单模式</p>*/}
                {/*</div>*/}
              {/*</ListItem>*/}
            {/*</NavLink>*/}

            <Divider />

            <NavLink to='/terminal' replace>
              <ListItem button className="router-link">
                <div className="router-link-side"></div>
                <div className="router-link-content">
                  <div className="router-link-icon">
                    <CodeRoundedIcon />
                  </div>
                  <p>专业模式</p>
                </div>
              </ListItem>
            </NavLink>
          </List>
          <div className="control-area">
            <Switch>
              <Route exact path='/control/config' component={Config}></Route>
              <Route path='/control/simple' component={Simple}></Route>
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Control)