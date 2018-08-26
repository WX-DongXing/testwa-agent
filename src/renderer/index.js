import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {usernameReducer, passwordReducer} from './reducers/loginReducer';
import {envReducer} from './reducers/envReducer';
import { HashRouter as Router } from 'react-router-dom';
import App from './app';
import 'typeface-roboto/index.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      light: '#d2dbdf',
      main: '#334955',
      dark: '#222f33'
    },
    secondary: {
      light: '#ffdb66',
      main: '#f9a934',
      dark: '#c17a00',
    },
    // error: will use the default color
  },
});

const allReducers = combineReducers({
  username: usernameReducer,
  password: passwordReducer,
  env: envReducer
})

const store = createStore(
  allReducers,
  window.devToolsExtension && window.devToolsExtension()
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>
  , document.getElementById('app'));