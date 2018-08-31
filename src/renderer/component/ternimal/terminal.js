import React, {Component} from 'react';
import { ipcRenderer, remote } from 'electron'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {MySnackbarContentWrapper} from '../custormSnackbars/custormSnackbars';
import {Snackbar} from '@material-ui/core';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@material-ui/icons/PauseCircleOutlineRounded';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import PaletteRoundedIcon from '@material-ui/icons/PaletteRounded';
import { getServePath } from '../../../main/db'
import './terminal.scss'
const session = remote.session.defaultSession
let container, logs = []

class Terminal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      run: false,
      color: 'terminal-wrap primary',
      anchorEl: null,
      type: false,
      open: false,
      message: '',
      log: []
    }
    this.run = this.run.bind(this)
    this.openTheme = this.openTheme.bind(this)
    this.closeTheme = this.closeTheme.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.navigateToConfig = this.navigateToConfig.bind(this)
    this.clearLog = this.clearLog.bind(this)
  }

  componentDidMount() {
    container = document.getElementById('container')
    ipcRenderer.on('service-log', (event, args) => {
      logs = [...logs, ...[args]]
      if (logs.length > 30) logs = logs.slice(0, 2)
      this.setState({ log: logs})
    })
    ipcRenderer.on('reset-window', (event, args) => {
      if (args) this.props.history.push('/login')
    })
  }

  run() {
    this.setState({ run: !this.state.run })
    if (this.state.run) {
      ipcRenderer.send('stop-service')
      this.setState({
        open: true,
        type: true,
        message: '已停止服务!'
      })
    } else {
      this.getCookie()
        .then(cookie => {
          if (cookie.username && cookie.password) {
            if (Object.values(getServePath()).reduce((pre, cur) => Boolean(pre) && Boolean(cur) )) {
              this.setState({
                open: true,
                type: true,
                message: '服务开启!'
              })
              ipcRenderer.send('run-service', cookie)
            } else {
              this.setState({
                run: false,
                open: true,
                type: false,
                message: '请检查运行环境的完整性!'
              })
            }
          } else {
            ipcRenderer.send('resetting-window')
          }
        })
    }
  }

  openTheme(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  closeTheme() {
    this.setState({ anchorEl: null })
  }

  setColor(color) {
    this.setState({ color: color })
    this.closeTheme()
  }

  navigateToConfig() {
    this.props.history.push('/control/config')
  }

  clearLog() {
    this.setState({ log: [] })
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  async getCookie() {
    let cookie, username, password
    try {
      username = await this.promiseCookie('username')
      password = await this.promiseCookie('password')
      cookie = {
        username: username.length === 0 ? '' : username[0].value,
        password: password.length === 0 ? '' : password[0].value
      }
    } catch (e) {
      cookie = {
        username: '',
        password: ''
      }
    }
    return cookie
  }

  promiseCookie(name) {
    return new Promise(((resolve, reject) => {
      session.cookies.get({name: name}, (error, cookies) => {
        if (error) reject(error)
        resolve(cookies)
      })
    }))
  }

  scrollToBottom() {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 0)
  }

  render() {
    return (
      <div className={ this.state.color }>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={ this.state.open }
          autoHideDuration={ 3000 }
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={ this.handleClose }
            variant={ this.state.type ? 'success' : 'error' }
            message={ this.state.message }
          />
        </Snackbar>
        <div className="terminal-drag-title">
          <IconButton aria-label="white" className="icon-button home" onClick={this.navigateToConfig} disabled={this.state.run}>
            <SettingsRoundedIcon />
          </IconButton>
          <IconButton className="icon-button theme"
                      aria-label="theme"
                      aria-owns={Boolean(this.state.anchorEl) ? 'long-menu' : null}
                      aria-haspopup="true"
                      onClick={this.openTheme}
          >
            <PaletteRoundedIcon />
          </IconButton>
          <Menu className="icon-menu"
                id="long-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.closeTheme}
                PaperProps={{
                  style: {
                    background: '#bbbbbb',
                    width: 56
                  },
                }}
          >

            <MenuItem key='light' onClick={this.setColor.bind(this, 'terminal-wrap light')}>
              <ListItemIcon className="icon-button white">
                <FiberManualRecordRoundedIcon className="icon-light"/>
              </ListItemIcon>
            </MenuItem>
            <MenuItem key='dark' onClick={this.setColor.bind(this, 'terminal-wrap dark')}>
              <ListItemIcon>
                <FiberManualRecordRoundedIcon className="icon-dark"/>
              </ListItemIcon>
            </MenuItem>
            <MenuItem key='primary' onClick={this.setColor.bind(this, 'terminal-wrap primary')}>
              <ListItemIcon>
                <FiberManualRecordRoundedIcon className="icon-primary"/>
              </ListItemIcon>
            </MenuItem>
          </Menu>
          {
            this.state.run
              ?
                <IconButton aria-label="parse" className="icon-button" onClick={this.run}>
                  <PauseCircleOutlineRoundedIcon color="error" />
                </IconButton>
              :
                <IconButton aria-label="run" className="icon-button start" onClick={this.run}>
                  <PlayCircleOutlineRoundedIcon />
                </IconButton>

          }
          <IconButton aria-label="clear" className="icon-button clear" onClick={this.clearLog}>
            <ClearAllRoundedIcon />
          </IconButton>
        </div>
        <div className="terminal-main">
          <div className="terminal-log-container" id="container">
            {
              this.state.log.map((item, index)=> {
                this.scrollToBottom()
                return <p key={index}>{item}</p>
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Terminal;