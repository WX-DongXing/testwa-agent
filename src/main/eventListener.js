import { ipcMain } from 'electron'
import { getScreen } from './db'
import persistent from './persistent'

export default function addEventListener(window) {

  /**
   * check env params and set window size and resizable when app init
   */
  ipcMain.on('init_check_env', (event) => {
    persistent()
      .then(isPass => {
        window.setOpacity(0)
        window.setSize(getScreen().width, getScreen().height, true)
        window.setResizable(true)
        window.center()
        setTimeout(() => {
          window.setOpacity(1)
        }, 200)
        event.sender.send('init_check_env_result', isPass)
      })
  })

  /**
   * check env params at config page
   */
  ipcMain.on('config_check_env', (event) => {
    persistent()
      .then(isPass => {

        event.sender.send('config_check_env_result', isPass)
      })
  })

}