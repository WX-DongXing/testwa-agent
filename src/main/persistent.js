import check from './check'
import {setNodePath, setSDKPath, setConfigState, getEnvPath } from './db';

export default async function persistent_env() {
  let db = await check()
  setNodePath(db.env.node.path)
  setSDKPath(db.env.sdk.path)
  let paths = getEnvPath()
  setConfigState(paths.node_path && paths.sdk_path && paths.appium_path)
}