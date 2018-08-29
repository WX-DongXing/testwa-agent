const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.join(__static, '/config/config.json'))
const db = low(adapter)

let data

/**
 * init db
 */
(function initDb () {
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
      },
    }
  })
    .write()
  return db.get('config').value()
})()

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
 * set env program config
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
  return db.get('config.env').value()
}

function getServePath() {
  return {
    node_path: db.get('config.env.node.path').value(),
    sdk_path: db.get('config.env.sdk.path').value(),
    appium_path: db.get('config.env.appium.path').value()
  }
}

/**
 * get screen width and height
 * @returns {*}
 */
function getScreen() {
  return db.get('config.screen').value()
}

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