import check from './check'
import {setNodePath, setSDKPath, setConfigState, getEnvPath } from './db';
let db, paths

(async function fill() {
  db = await check()
  setNodePath(db.env.node.path)
  setSDKPath(db.env.sdk.path)
})()

function isConfigured() {
  paths = getEnvPath()
  if (paths.node_path && paths.sdk_path && paths.appium_path) {
    setConfigState(true)
    return true;
  } else {
    setConfigState(true)
    return false;
  }
}

export {
  isConfigured
}