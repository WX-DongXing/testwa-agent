const path = require('path')
const targetPath = path.join(__static, '/config/config.json')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(targetPath)
const db = low(adapter)

let data

/**
 * init db
 */
(function initDb () {
  db.defaults({
    config: {
      screen: {
        width: 400,
        height: 600
      },
      env_path: {
        node_path: '',
        sdk_path: '',
        appium_path: ''
      },
      configured: false
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
 * set node path
 * @param path
 */
function setNodePath (path) {
  db.set('config.env_path.node_path', path)
    .write()
}

/**
 * set sdk path
 * @param path
 */
function setSDKPath (path) {
  db.set('config.env_path.sdk_path', path)
    .write()
}

/**
 * set appium path
 * @param path
 */
function setAppiumPath (path) {
  db.set('config.env_path.appium_path', path)
    .write()
}

/**
 * get all data of env path
 * @returns {*}
 */
function getEnvPath () {
  return db.get('config.env_path').value()
}

/**
 * get screen width and height
 * @returns {*}
 */
function getScreen() {
  return db.get('config.screen').value()
}

/**
 * set config state
 * @param bool
 */
function setConfigState(bool) {
  db.set('config.configured', bool)
    .write()
}

/**
 * get config state
 * @returns {*}
 */
function getConfigState() {
  return db.get('config.configured').value()
}

export {
  setScreen,
  getScreen,
  setNodePath,
  setSDKPath,
  setAppiumPath,
  getEnvPath,
  setConfigState,
  getConfigState
}