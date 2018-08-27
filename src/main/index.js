'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import addEventListener from './eventListener'

const logger = require('electron-timber')

const isDevelopment = process.env.NODE_ENV !== 'production'
// disable electron security warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {

  const window = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    center: true,
    frame: false,
    titleBarStyle: 'hiddenInset',
    show: false
  })

  /**
   * add all event listener to main process
   */
  addEventListener(window)

  // if (isDevelopment) {
    window.webContents.openDevTools()
    BrowserWindow.addDevToolsExtension('/Users/xd/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0')
  // }

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
    mainWindow = null
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