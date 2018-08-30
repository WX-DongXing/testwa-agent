import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { is } from 'electron-util'
const target = is.development ? path.join(__static, 'db/db.json') : path.join(path.resolve(__dirname, '..'), 'static/db/db.json')
const adapter = new FileSync(target)
const db = low(adapter)

/**
 * init db
 */
db.defaults({
  config: {
    screen: {
      width: 920,
      height: 576
    },
    env: {
      java: {
        version: '',
        path: ''
      },
      python: {
        version: '',
        path: ''
      },
      node: {
        version: '',
        path: ''
      },
      adb: {
        version: '',
        path: ''
      },
      sdk: {
        version: '',
        path: ''
      },
      appium: {
        version: '',
        path: ''
      }
    }
  }
})
  .write()

/**
 * set screen width and height
 * @param width the width of screen
 * @param height the height of screeb
 */
function setScreen (width, height) {
  db.set('config.screen.width', width)
    .write()
  db.set('config.screen.height', height)
    .write()
}

/**
 * set env program db
 * @param name
 * @param version
 * @param path
 */
function setEnv(name, version, path) {
  db.set(`config.env.${name}`, {
    version: version,
    path: path
  }).write()
}

/**
 * get all data of env path
 * @returns {*}
 */
function getEnv() {
  return db.read().get('config.env').value()
}

function getServePath() {
  return {
    nodePath: db.read().get('config.env.node.path').value(),
    sdkPath: db.read().get('config.env.sdk.path').value(),
    appiumPath: db.read().get('config.env.appium.path').value()
  }
}

/**
 * get screen width and height
 * @returns {*}
 */
function getScreen() {
  return db.read().get('config.screen').value()
}

/**
 * check env is pass of all
 * @returns {any}
 */
function isPass() {
  return Object.values(getEnv()).map(item => item.path).reduce((pre, cur) => Boolean(pre) && Boolean(cur))
}

export {
  setScreen,
  getScreen,
  setEnv,
  getEnv,
  isPass,
  getServePath
}