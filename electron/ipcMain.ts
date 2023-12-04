
import { ipcMain, BrowserWindow, BrowserView, screen, session } from 'electron'
import path from 'node:path'
import { createChildWindow } from './createChidWindow'
import customTimer from './schedule'
import { debounce } from './common'
import { mainWindow } from './main'
import Store from 'electron-store'

let child: BrowserWindow | undefined //子窗口
let childMap = new Map()

let winStartPosition: any = { x: 0, y: 0 };
let movingInterval: any = null;

const store = new Store();

const close = debounce(() => {
    child?.close()
    childMap.delete('interaction')
}, 2000)

ipcMain.on('console', (_, message) => {
    console.log(message)
});

ipcMain.on('interaction-start', () => {
    if (childMap.has('menu')) {
        childMap.get('menu')?.close()
        return
    }
    //给子窗口发送消息
    child = createChildWindow("#/interaction")
    child.once('show', () => {
        child?.webContents.send('interaction-end')
        close()
    })
    childMap.set('interaction', child)
});

ipcMain.on('reminder', (_, message) => {
    message = JSON.parse(message)
    //给子窗口发送消息
    customTimer(message.date, () => {
        child = createChildWindow("#/interaction", { width: 300, height: 200, title: "您有一条待办事项" }, true, true)
        child.once('show', () => {
            child?.webContents.send('reminder-show', JSON.stringify(message.info))
        })
    })
});
ipcMain.on('third', () => {
    child = new BrowserWindow({
        width: 200, height: 200, parent: mainWindow,
        show: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        },
        frame: true,
        transparent: false,
        resizable: true,
        movable: true
    })

    const parentPosition = mainWindow?.getPosition() || [];
    const xOffset = -(200 - 150) / 2; // 与主窗口左侧的偏移量
    const yOffset = -200; // 与主窗口顶部的偏移量
    child.setPosition(parentPosition?.[0] + xOffset, parentPosition?.[1] + yOffset);

    // 创建一个新的 session，启用缓存
    const viewSession = session.fromPartition('persist:my-cache', { cache: true });
    // 创建一个 BrowserView 对象
    const view = new BrowserView({
        webPreferences: {
            zoomFactor: 1,
            session: viewSession,
        }
    })
    view.webContents.session.clearStorageData()
    // 设置 BrowserView 作用的窗口
    child?.setBrowserView(view)
    view.setBounds({
        x: 0, // 窗口x轴的起始位置
        y: 0, // 窗口y轴的起始位置
        width: 200, // BrowserView 的宽度
        height: 200 // BrowserView 的高度，如果是和窗口大小一致，一般获取窗口的宽度和高度
    })
    // 这段代码可以设置browserView视图宽度随窗口变化
    view.setAutoResize({ width: true, height: true })
    // BrowserView 嵌套网页
    view.webContents.loadURL('https://www.bilibili.com/video/BV17U4y1b7kf/?vd_source=93a2b3e1bec06eb76d4dc9eac9a3da5d')

    // // 加载一个外部链接
    view.webContents.once("did-finish-load", () => {
        view.webContents.setZoomFactor(0.1)
    })

    // 禁止窗口最大化
    child.setMaximizable(false);

    // 禁止窗口全屏
    child.setFullScreenable(false);
});
// 监听菜单显示
ipcMain.on('menu-show', () => {
    //给子窗口发送消息
    child = createChildWindow("#/menu", {
        width: 200, height: 50, frame: false, transparent: true,
        resizable: false, movable: false, title: "您有一条待办事项"
    }, true)
    child.on("close", () => {
        childMap.delete('menu')
    })
    childMap.set('menu', child)
});
ipcMain.on('menu-hide', () => {
    //给子窗口发送消息
    if (childMap.has('menu')) {
        childMap.get('menu')?.close()
        childMap.delete('menu')
        return
    }
});
// 监听下落
ipcMain.handle('start-drop', () => {
    //给子窗口发送消息
    return new Promise((resolve) => {
        const mainScreen = screen.getPrimaryDisplay();
        const { height } = mainScreen.size;
        const winPosition = mainWindow?.getPosition() || [];
        winStartPosition = { x: winPosition[0], y: winPosition[1] };
        movingInterval = setInterval(() => {
            // 实时更新位置
            const x = winStartPosition.x;
            const y = winStartPosition.y + 10;
            winStartPosition.y = y
            mainWindow?.setPosition(x, y, true);
            if (y >= height - 150) {
                stop()
                resolve(false)
            }
        }, 1);
    })
});
// 监听走路
ipcMain.handle('start-walk', (_, number) => {
    return new Promise((resolve) => {
        const mainScreen = screen.getPrimaryDisplay();
        const { width } = mainScreen.size;
        const winPosition = mainWindow?.getPosition() || [];
        winStartPosition = { x: winPosition[0], y: winPosition[1] };
        if (winPosition[0] <= -50) {
            mainWindow?.webContents.send('message-from-main', 'Hello from main process!');
            return
        }
        if (winPosition[0] >= width - 150) {
            mainWindow?.webContents.send('message-from-main', 'Hello from main process!');
            return
        }
        movingInterval = setInterval(() => {
            // 实时更新位置
            const x = winStartPosition.x + 1 * number;
            const y = winStartPosition.y;
            winStartPosition.x = x
            mainWindow?.setPosition(x, y, true);
            if (x <= -50) {
                stop()
                resolve(false)
            }
            if (x >= width - 105) {
                stop()
                resolve(false)
            }
        }, 50);
    })
});
// 监听上爬
ipcMain.handle('start-crawl', () => {
    return new Promise((resolve) => {
        const winPosition = mainWindow?.getPosition() || [];
        winStartPosition = { x: winPosition[0], y: winPosition[1] };
        if (winPosition[1] <= 0) {
            mainWindow?.webContents.send('message-from-main', 'Hello from main process!');
            return
        }
        movingInterval = setInterval(() => {
            // 实时更新位置
            const x = winStartPosition.x;
            const y = winStartPosition.y - 1;
            winStartPosition.y = y;
            mainWindow?.setPosition(x, y, true);
            if (y <= 0) {
                stop()
                resolve(false)
            }
        }, 50);
    })
});
// 监听下摔
ipcMain.handle('start-down-drop', (_, number) => {
    return new Promise((resolve) => {
        const mainScreen = screen.getPrimaryDisplay();
        const { height } = mainScreen.size;
        const winPosition = mainWindow?.getPosition() || [];
        winStartPosition = { x: winPosition[0], y: winPosition[1] };
        winStartPosition.x = winStartPosition.x - number * 50;
        movingInterval = setInterval(() => {
            // 实时更新位置
            const x = winStartPosition.x;
            const y = winStartPosition.y + 10;
            winStartPosition.y = y;
            mainWindow?.setPosition(x, y, true);
            if (y >= height - 150) {
                stop()
                resolve(false)
            }
        }, 50);
    })
});
ipcMain.on('stop', () => {
    stop()
});

const stop = () => {
    movingInterval && clearInterval(movingInterval);
    store.set('winStartPosition', winStartPosition)
}
