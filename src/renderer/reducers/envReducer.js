import { UPDATE_ENV} from '../actions/envAction';
const initEnv = {
  node: {
    version: '',
    path: ''
  },
  java: {
    version: '',
    path: ''
  },
  python: {
    version: '',
    path: ''
  },
  adb: {
    version: '',
    path: ''
  },
  appium: {
    version: '',
    path: ''
  },
}

export function envReducer(state = initEnv, {type, payload} ) {
  switch (type) {
    case UPDATE_ENV:
      return payload.env
    default:
      return state
  }
}