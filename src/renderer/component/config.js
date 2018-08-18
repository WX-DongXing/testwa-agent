import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Config extends Component {
  render() {
    return (
      <div>
        <p>config</p>
        <Link to='/' replace>to login</Link>
      </div>
    )
  }
}

export default Config;