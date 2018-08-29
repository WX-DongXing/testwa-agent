import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './terminal.scss'
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@material-ui/icons/PauseCircleOutlineRounded';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';

class Terminal extends Component {
  constructor(props) {
    super(props)
    this.state = { run: false, color: 'terminal-wrap primary' }
    this.run = this.run.bind(this)
  }

  run() {
    this.setState({ run: !this.state.run })
  }

  setColor(color) {
    this.setState({ color: color })
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
          <IconButton aria-label="white" className="icon-button white" onClick={this.setColor.bind(this, 'terminal-wrap light')}>
            <FiberManualRecordRoundedIcon />
          </IconButton>
          <IconButton aria-label="primary" className="icon-button primary" onClick={this.setColor.bind(this, 'terminal-wrap primary')}>
            <FiberManualRecordRoundedIcon />
          </IconButton>
          <IconButton aria-label="dark" className="icon-button" onClick={this.setColor.bind(this, 'terminal-wrap dark')}>
            <FiberManualRecordRoundedIcon />
          </IconButton>
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