import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {createSelector} from 'reselect';
import {updateUser} from '../actions/userAction';
import connect from 'react-redux/es/connect/connect';
import {Cookie} from '../cookie';
const cookie = new Cookie();

class Login extends Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    cookie.set('name1', '1', 10);
    cookie.set('name2', 2, 10);
    cookie.set('name3', 'a', 10);
    setTimeout(() => {console.log(cookie.getAll())}, 4)
  }

  updateUser(event) {
    this.props.onUpdateUser(event.target.value);
  }

  render() {
    return (
      <div>
        <p>login</p>
        <input type="text" onChange={this.updateUser}/>
        {this.props.user}
        <Link to='/config'>go to config</Link>
      </div>
    )
  }
}

const userSelector = createSelector(
  state => state.user,
  user => user
)

const mapStateToProps = createSelector(
  userSelector,
  (user) => ({
    user
  })
)

const mapActionsToProps = {
  onUpdateUser: updateUser
}

export default connect(mapStateToProps, mapActionsToProps)(Login);