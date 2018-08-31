import { ipcMain, dialog, session } from 'electron'
import path from 'path'
import util from 'util'
import childProcess from 'child_process'
import { getScreen, setEnv, getEnv, isPass, getServePath, db } from './db'
import persistent from './persistent'
import { mainWindow as window } from './index'
import { is } from 'electron-util'
import { first } from 'rxjs/operators'
const exec = childProcess.exec
const execPromise = util.promisify(require('child_process').exec)
const rootPath = is.development ? path.resolve(__static, '..') : path.resolve(__dirname, '..')
const targetPath = path.join(rootPath, 'static/java/resources')
const execPath = path.join(rootPath, 'static/java')
const LOGIN_URL = 'http://api.test.testwa.com/v1/auth/login'
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
    session.defaultSession.cookies.remove(LOGIN_URL, 'username', (error) => { if (error) console.log(error) })
    session.defaultSession.cookies.remove(LOGIN_URL, 'password', (error) => { if (error) console.log(error) })
    window.setOpacity(0)
    window.setSize(400, 600, true)
    window.setResizable(false)
    window.center()
    setTimeout(() => {
      window.setOpacity(1)
    }, 200)
    event.sender.send('reset-window', true)
  })

  /**
   * run service event
   */
  ipcMain.on('run-service', (event, cookie) => {
    const envPaths = getServePath()
    const command = `sh start.sh -u "${cookie.username}" -p "${cookie.password}" -n "${envPaths.nodePath}" -s "${envPaths.sdkPath}" -a "${envPaths.appiumPath}" -r "${targetPath}"`
    serveProcess = exec(command, { cwd: execPath, encoding: 'utf-8', maxBuffer: 5000 * 1024 })

    serveProcess.on('error', (error) => {
      event.sender.send('service-log', `Error: ${error}`)
    })

    serveProcess.stdout.on('data', (stdout) => {
      event.sender.send('service-log', stdout)
    })

    serveProcess.stderr.on('data', (stderr) => {
      event.sender.send('service-log', stderr)
    })
  })

  /**
   * stop service event
   */
  ipcMain.on('stop-service', (event) => {
    stopService()
      .then(() => {
        event.sender.send('service-log', '> > 服务关闭！')
      })
      .catch(e => {
        console.log(e)
      })
  })

}

/**
 * kill service
 * @returns {Promise<any | void | string | Buffer>}
 */
async function stopService() {
 return await execPromise('sh stop.sh', { cwd: execPath, encoding: 'utf-8'})
}

function ipcMainRemoveListeners() {
  ipcMain.removeAllListeners('int_check_env')
  ipcMain.removeAllListeners('config_check_env')
  ipcMain.removeAllListeners('open-file-dialog')
  ipcMain.removeAllListeners('store-appium')
  ipcMain.removeAllListeners('run-service')
  ipcMain.removeAllListeners('stop-service')
}



export {
  addEventListener,
  ipcMainRemoveListeners,
  stopService
}