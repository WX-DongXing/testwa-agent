import React, {Component} from 'react';
import {createSelector} from 'reselect';
import {updateUser} from './actions/userAction';
import { connect } from 'react-redux';
import '././style.scss';

class App extends Component {
  render() {
    return (
      <div>
        <p>works!</p>
      </div>
    );
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

export default connect(mapStateToProps, mapActionsToProps)(App);