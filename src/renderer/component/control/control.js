import React, { Component } from 'react'
import {Switch, Route, withRouter, NavLink} from 'react-router-dom'
import {AppBar, Divider, List, ListItem, ListItemIcon, Toolbar, Tooltip, Icon} from '@material-ui/core';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import CodeRoundedIcon from '@material-ui/icons/CodeRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Config from './config/config';
import Simple from './simple/simple';
import './control.scss'

class Control extends Component {
  render() {
    return (
      <div className="control-wrap">
        <AppBar position="static" className="control-drag-bar">
          <Toolbar variant="dense">
            {/*<Typography variant="title" color="inherit">*/}
            {/*Testwa*/}
            {/*</Typography>*/}
          </Toolbar>
        </AppBar>
        <div className="control-main">
          <List component="nav" className="control-side">
            <Tooltip title="环境配置">
              <NavLink to='/control/config' replace activeClassName='router-active'>
                <ListItem button className="router-link">
                  <ListItemIcon>
                    <SettingsRoundedIcon />
                  </ListItemIcon>
                </ListItem>
              </NavLink>
            </Tooltip>

            <Tooltip title="简单模式">
              <NavLink to='/control/simple' replace activeClassName='router-active'>
                <ListItem button className="router-link">
                  <ListItemIcon>
                    <SendRoundedIcon />
                  </ListItemIcon>
                </ListItem>
              </NavLink>
            </Tooltip>

            <Divider />

            <Tooltip title="专业模式">
              <NavLink to='/terminal' replace>
                <ListItem button>
                  <ListItemIcon>
                    <CodeRoundedIcon />
                  </ListItemIcon>
                </ListItem>
              </NavLink>
            </Tooltip>
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