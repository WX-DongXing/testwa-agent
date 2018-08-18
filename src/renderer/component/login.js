import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Login extends Component {
  render() {
    return (
      <div>
        <p>login</p>
        <Link to='/config'>config</Link>
      </div>
    )
  }
}

export default Login;