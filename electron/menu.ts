import { Menu } from 'electron'
import { createChildWindow } from './createChidWindow'
// import { initChat } from './python'
import { mainWindow } from './main'
const menu = Menu.buildFromTemplate([
    // {
    //     click: () => eat(),
    //     label: '吃饭'
    // },
    {
        click: () => {
            try {
                const child = createChildWindow('#/chat', { width: 300, height: 400, title: 'Chat' }, true)

                mainWindow?.webContents.send('console', JSON.stringify({ child: child }))
                child.once('show', () => {
                    // initChat()
                    mainWindow?.webContents.send('console', 2222)
                })
            } catch (e) {

                mainWindow?.webContents.send('console', JSON.stringify(e))
            }
        },
        label: 'TODO'
    },
    {
        click: () => {
            mainWindow?.webContents.openDevTools();
        },
        label: 'DevTools'
    }
])

export default menu
