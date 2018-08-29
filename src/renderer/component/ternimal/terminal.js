import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@material-ui/icons/PauseCircleOutlineRounded';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PaletteRoundedIcon from '@material-ui/icons/PaletteRounded';
import './terminal.scss'

class Terminal extends Component {
  constructor(props) {
    super(props)
    this.state = { run: false, color: 'terminal-wrap primary', anchorEl: null }
    this.run = this.run.bind(this)
    this.openTheme = this.openTheme.bind(this)
    this.closeTheme = this.closeTheme.bind(this)
  }

  run() {
    this.setState({ run: !this.state.run })
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

  render() {
    return (
      <div className={this.state.color}>
        <div className="terminal-drag-title">
          <Link to='/control/config'>
            <IconButton aria-label="white" className="icon-button home">
              <HomeRoundedIcon />
            </IconButton>
          </Link>
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
          {/*<IconButton aria-label="white" className="icon-button white" onClick={this.setColor.bind(this, 'terminal-wrap light')}>*/}
            {/*<FiberManualRecordRoundedIcon />*/}
          {/*</IconButton>*/}
          {/*<IconButton aria-label="primary" className="icon-button primary" onClick={this.setColor.bind(this, 'terminal-wrap primary')}>*/}
            {/*<FiberManualRecordRoundedIcon />*/}
          {/*</IconButton>*/}
          {/*<IconButton aria-label="dark" className="icon-button" onClick={this.setColor.bind(this, 'terminal-wrap dark')}>*/}
            {/*<FiberManualRecordRoundedIcon />*/}
          {/*</IconButton>*/}
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
          <IconButton aria-label="clear" className="icon-button clear">
            <ClearAllRoundedIcon />
          </IconButton>
        </div>
        <div className="terminal-main">
          <div className="terminal-log-container">
          </div>
        </div>
      </div>
    )
  }
}

export default Terminal;