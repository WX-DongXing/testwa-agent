import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';
import { HashRouter as Router } from 'react-router-dom';
import App from './app';

const allReducers = combineReducers({
  user: userReducer
})

const store = createStore(
  allReducers,
  window.devToolsExtension && window.devToolsExtension()
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('app'));