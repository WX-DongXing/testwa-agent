import { ipcMain, dialog, session } from 'electron'
import path from 'path'
import util from 'util'
import childProcess from 'child_process'
import { getScreen, setEnv, getEnv, isPass, getServePath } from './db'
import persistent from './persistent'
import { mainWindow as window } from './index'
import { is } from 'electron-util'
import { first } from 'rxjs/operators'
import { ENV, LOGIN_URL } from './config';
const exec = childProcess.exec
const execPromise = util.promisify(require('child_process').exec)
const rootPath = is.development ? path.resolve(__static, '..') : path.resolve(__dirname, '..')
const targetPath = path.join(rootPath, 'static/java/resources')
const execPath = path.join(rootPath, 'static/java')
let serveProcess

function addEventListener() {
  /**
   * check env params and set window size and resizable when app init
   */
  ipcMain.on('init_check_env', (event) => {
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
    if (is.macos || is.linux) {
      const command = `sh start.sh -t "${ENV}" -u "${cookie.username}" -p "${cookie.password}" -n "${envPaths.nodePath}" -s "${envPaths.sdkPath}" -a "${envPaths.appiumPath}" -r "${targetPath}"`
      serveProcess = exec(command, { cwd: execPath, encoding: 'utf-8', maxBuffer: 5000 * 1024 })
    } else if (is.windows) {
      const command = `java -jar -server -Xms1024m -Xmx2048m TestwaJar.jar --spring.profiles.active="${ENV}"`
        + ` -Dorg.springframework.boot.logging.LoggingSystem=none`
        + ` --username="${cookie.username}"`
        + ` --password="${cookie.password}"`
        + ` --node.excute.path="${envPaths.nodePath}"`
        + ` --ANDROID_HOME="${envPaths.sdkPath}"`
        + ` --appium.js.path="${envPaths.appiumPath}"`
        + ` --distest.agent.resources="${targetPath}"`
      console.log('Java command', command)
      serveProcess = exec(command, { cwd: execPath, encoding: 'utf-8', maxBuffer: 5000 * 1024 })
    }

    // add child process listeners
    serveProcess.on('error', (error) => emitServiceLog(event, error))
    serveProcess.stdout.on('data', (stdout) => emitServiceLog(event, stdout))
    serveProcess.stderr.on('data', (stderr) => emitServiceLog(event, stderr))
  })

  /**
   * stop service event
   */
  ipcMain.on('stop-service', (event) => {
    // remove listeners
    serveProcess.removeAllListeners('error')
    serveProcess.stdout.removeAllListeners('data')
    serveProcess.stderr.removeAllListeners('data')

    // kill child process
    serveProcess.kill()
    stopService()
      .then(() => {
        event.sender.send('service-log', '- - - > 服务已关闭！')
      })
      .catch(e => {
        console.log(e)
      })
  })

}

/**
 * kill mac or linux platform service
 * @returns {Promise<any | void | string | Buffer>}
 */
async function stopUnixService() {
  return await execPromise('sh stop.sh', { cwd: execPath, encoding: 'utf-8'})
}

/**
 * kill windows platform service
 * @returns {Promise<any | void | string | Buffer>}
 */
async function stopWinService() {
  return await execPromise('taskkill /F /IM "java.exe"', { cwd: execPath, encoding: 'utf-8'})
}

/**
 * kill service
 * @returns {Promise<any|void|string|Buffer>}
 */
async function stopService() {
  return is.windows ? stopWinService() : stopUnixService()
}

/**
 * emit log function
 * @param event
 * @param target
 */
function emitServiceLog(event, target) {
  event.sender.send('service-log', target)
}

/**
 * ipcMain remove all of listeners
 */
function ipcMainRemoveListeners() {
  ipcMain.removeAllListeners('init_check_env')
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
