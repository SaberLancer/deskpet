import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import './ipcMain'
import './schedule'
import './python'
import windowMove from './windowMove'
import Store from 'electron-store'
import menu from './menu'

const store = new Store()


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

// 判断是否为 macOS
const is_mac = process.platform === "darwin";

// 如果是 macOS，则隐藏 dock 图标
if (is_mac) {
  app.dock.hide(); // - 1 -
}


// 计算窗口的坐标，以使其出现在右下角
const WINDOW_WIDTH = 150 || 150; // 窗口的宽度
const WINDOW_HEIGHT = 150 || 150; // 窗口的高度
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

let mainWindow: BrowserWindow | undefined //主窗口
let winUrl: string = '' //渲染进程路径
let x: number = 0 // 主窗口生成右侧坐标
let y: number = 0 // 主窗口生成底部坐标

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
console.log('VITE_DEV_SERVER_URL', VITE_DEV_SERVER_URL)
if (VITE_DEV_SERVER_URL) {
  winUrl = VITE_DEV_SERVER_URL
} else {
  console.log('process.env.DIST', process.env.DIST)
  winUrl = path.join(process.env.DIST, 'index.html')
}

app.on("ready", () => {
  const mainScreen = screen.getPrimaryDisplay();
  const { width, height } = mainScreen.size;
  x = width - WINDOW_WIDTH - 100;
  y = height - WINDOW_HEIGHT - 100;
  store.set('winStartPosition', { x: x, y: y });
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: x,
    y: y,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      // nodeIntegration: true, // 根据您的需求启用或禁用 Node.js 集成
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
    // frame: false,
    // transparent: true,
    // resizable: false,
    alwaysOnTop: true
  })

  // 设置窗口始终在最前面
  mainWindow.setAlwaysOnTop(true, "screen-saver"); // - 2 -
  // 设置窗口在所有工作区都可见
  mainWindow.setVisibleOnAllWorkspaces(true); // - 3 -


  mainWindow.webContents.openDevTools();

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    windowMove(mainWindow)
    mainWindow?.webContents.on('context-menu', () => {
      menu.popup({ window: mainWindow })
    })
    mainWindow?.webContents.send('mainScreen', screen.getPrimaryDisplay())
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(winUrl)
  } else {
    // const url = encodeURI('file://' + __dirname + '/index.html')
    mainWindow.loadFile(winUrl)
  }
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = undefined
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

export { mainWindow, WINDOW_WIDTH, winUrl }
