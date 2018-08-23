import { ipcMain } from 'electron'
import { isConfigured } from './persistent'
import { getScreen, getConfigState } from './db'
const logger = require('electron-timber')

export default function addEventListener(window) {

  /**
   * check env params and set window size and resizable
   */
  ipcMain.on('check_env', (event) => {
    if (!getConfigState()) {
      window.setSize(getScreen().width, getScreen().height, true)
      window.setResizable(true)
    }
    event.sender.send('check_env_result', getConfigState())
  })

}