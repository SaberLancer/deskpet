import { BrowserWindow } from 'electron'
import path from 'node:path'
import { mainWindow, WINDOW_WIDTH, winUrl } from './main'

let child: BrowserWindow | undefined = undefined
let childWindowWidth = 200
let childWindowHeight = 50
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
/**
 * 创建子窗口
 * @param url //子窗口路径
 * @param customOption //自定义参数
 * @param resizable //控制子窗口是否有边框，是否透明，是否可拉伸，是否可以的，是否可穿透
 * @returns 返回子窗口对象
 */
function createChildWindow(url: string, customOption: any = null, resizable: boolean = false, reset: boolean = false): BrowserWindow {
    if (child && !reset) return child
    let option = {
        title: 'TODO',
        width: childWindowWidth,
        height: childWindowHeight,
        parent: mainWindow,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        },
        frame: resizable,
        transparent: !resizable,
        resizable: resizable,
        movable: resizable
    }
    if (customOption) {
        childWindowWidth = customOption.width ?? childWindowWidth
        childWindowHeight = customOption.height ?? childWindowHeight
        Object.assign(option, customOption)
    }
    child = new BrowserWindow(option)
    child.webContents.openDevTools();
    child.setIgnoreMouseEvents(!resizable)
    // 设置子窗口位置以产生相对于主窗口的偏移
    const parentPosition = mainWindow?.getPosition() || [];
    const xOffset = -(childWindowWidth - WINDOW_WIDTH) / 2; // 与主窗口左侧的偏移量
    const yOffset = -childWindowHeight; // 与主窗口顶部的偏移量
    child.setPosition(parentPosition?.[0] + xOffset, parentPosition?.[1] + yOffset);
    mainWindow?.webContents.send('console', JSON.stringify({ child: winUrl + url }))
    if (VITE_DEV_SERVER_URL) {
        child.loadURL(winUrl + url)
    } else {
        child.loadFile(winUrl, { hash: url })
    }

    child.webContents.once("did-finish-load", () => {
        child?.show()
    })

    child.on("close", () => {
        child = undefined
    })

    return child
}

const closeChildWindow = (curChild: BrowserWindow) => {
    curChild?.close()
}

export { createChildWindow, closeChildWindow }
