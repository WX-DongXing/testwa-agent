import { ipcMain, dialog } from 'electron'
import { getScreen, setEnv, getEnv, isPass } from './db'
import persistent from './persistent'

export default function addEventListener(window) {

  /**
   * check env params and set window size and resizable when app init
   */
  ipcMain.on('init_check_env', (event) => {
    persistent()
      .subscribe(() => {
        window.setOpacity(0)
        window.setSize(getScreen().width, getScreen().height, true)
        window.setResizable(true)
        window.center()
        setTimeout(() => {
          window.setOpacity(1)
        }, 200)
        event.sender.send('init_check_env_result', {
          isPass: isPass(),
          env: getEnv()
        })
      })

  })

  /**
   * check env params at config page
   */
  ipcMain.on('config_check_env', (event) => {
    persistent()
      .subscribe(() => {
        event.sender.send('config_check_env_result', {
          isPass: isPass(),
          env: getEnv()
        })
      })
  })

  /**
   * open file dialog to select appium path
   */
  ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog(
      { properties: ['openFile', 'openDirectory'] },
      (files) => {
        if (files) {
          event.sender.send('selected-directory', files)
        }
      })
  })

  ipcMain.on('store-appium', (event, args) => {
    setEnv('appium', args.version, args.path)
  })

}