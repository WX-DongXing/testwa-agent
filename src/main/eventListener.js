import { ipcMain, dialog } from 'electron'
import path from 'path'
import childProcess from 'child_process'
import { getScreen, setEnv, getEnv, isPass, getServePath, db } from './db'
import persistent from './persistent'
import { mainWindow as window } from './index'
import { is } from 'electron-util'
import { first } from 'rxjs/operators'
const exec = childProcess.exec
const rootPath = is.development ? path.resolve(__static, '..') : path.resolve(__dirname, '..')
const targetPath = path.join(rootPath, 'static/java/resources')
const execPath = path.join(rootPath, 'static/java')

let serveProcess

function addEventListener() {
  /**
   * check env params and set window size and resizable when app init
   */
  ipcMain.once('init_check_env', (event) => {
    persistent().pipe(first())
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
    persistent().pipe(first())
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

  /**
   * store appium path to local
   */
  ipcMain.on('store-appium', (event, args) => {
    setEnv('appium', args.version, args.path)
  })

  ipcMain.on('resetting-window', (event) => {
    window.setOpacity(0)
    window.setSize(400, 600, true)
    window.setResizable(false)
    window.center()
    setTimeout(() => {
      window.setOpacity(1)
    }, 200)
    event.sender.send('reset-window', true)
  })

  ipcMain.on('run-service', (event, cookie) => {
    const envPaths = getServePath()
    const command = `sh start.sh -u "${cookie.username}" -p "${cookie.password}" -n "${envPaths.nodePath}" -s "${envPaths.sdkPath}" -a "${envPaths.appiumPath}" -r "${targetPath}"`
    serveProcess = exec(command, { cwd: execPath, encoding: 'utf-8', maxBuffer: 5000 * 1024 })

    serveProcess.on('error', (error) => {
      console.log('error: ', error)
      event.sender.send('service-log', `Error: ${error}`)
    })

    serveProcess.stdout.on('data', (stdout) => {
      event.sender.send('service-log', stdout)
    })

    serveProcess.stderr.on('data', (stderr) => {
      event.sender.send('service-log', stderr)
    })
  })

  ipcMain.on('service-serve', (event) => {
    event.sender.send('service-log', 'stopped')
  })

}

function ipcMainRemoveListeners() {
  ipcMain.removeAllListeners('int_check_env')
  ipcMain.removeAllListeners('config_check_env')
  ipcMain.removeAllListeners('open-file-dialog')
  ipcMain.removeAllListeners('store-appium')
  ipcMain.removeAllListeners('run-serve')
  ipcMain.removeAllListeners('stop-serve')
}

export {
  addEventListener,
  ipcMainRemoveListeners
}