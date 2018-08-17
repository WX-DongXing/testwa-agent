import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';
import App from './app';

const allReducers = combineReducers({
  user: userReducer
})

const store = createStore(
  allReducers,
  window.devToolsExtension && window.devToolsExtension()
)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));