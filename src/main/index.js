'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { addEventListener, ipcMainRemoveListeners, stopService } from './eventListener'
import { is } from 'electron-util'
import { menu } from './menu'

const isDevelopment = process.env.NODE_ENV !== 'production'
// disable electron security warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true
// global reference to mainWindow (necessary to prevent window from being garbage collected)
export let mainWindow

function createMainWindow() {

  const window = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: true,
    center: true,
    frame: !is.macos,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    show: false
  })

  /**
   * macOS menu
   */
  if (is.macos) Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

  /**
   * add all event listener to main process
   */
  addEventListener()

  if (isDevelopment) {
    window.webContents.openDevTools()
    // BrowserWindow.addDevToolsExtension('/Users/xd/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0')
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  /**
   * window ready to show
   */
  window.once('ready-to-show', () => {
    mainWindow.show()
  })

  window.on('closed', () => {
    /**
     * remove all of ipcMain event listeners
     */
    ipcMainRemoveListeners()
    stopService()
      .then(() => {
        mainWindow = null
      })
      .catch(e => {
        console.log(e)
      })
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

// app will quit event
app.on('will-quit', (event) => {
  /**
   * remove all of ipcMain event listeners
   */
  ipcMainRemoveListeners()
  stopService()
    .then(() => {
      app.quit()
    })
})
