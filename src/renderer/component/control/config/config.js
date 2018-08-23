import React, {Component} from 'react'
import { Button } from '@material-ui/core'
import './config.scss'

class Config extends Component {
  render() {
    return (
      <div className="config-wrap">
        <h1>config</h1>
        <Button>name</Button>
      </div>
    )
  }
}

export default Config;