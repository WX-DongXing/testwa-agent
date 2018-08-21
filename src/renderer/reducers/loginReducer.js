import {UPDATE_USERNAME} from '../actions/loginAction';
import {UPDATE_PASSWORD} from '../actions/loginAction';

export function usernameReducer(state = '', { type, payload }) {
  switch (type) {
    case UPDATE_USERNAME:
      return payload.username
    default:
      return state;
  }
}

export function passwordReducer(state = '', { type, payload }) {
  switch (type) {
    case UPDATE_PASSWORD:
      return payload.password
    default:
      return state;
  }
}