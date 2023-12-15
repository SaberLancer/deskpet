import { ipcMain, BrowserWindow } from 'electron'
import { mainWindow } from './main'
import { chat, getcChatId } from '../sparkdesk/chat.ts'

const cookie = "JSESSIONID=8BF4FAD71A6DC5B6307299BB5EC49EE7; di_c_mti=84c71244-c6d6-6fad-94d5-8871e8eb5b8c; d_d_app_ver=1.4.0; d_d_ci=c43db2c5-be50-6dbd-a843-e5ab25bec793; ssoSessionId=91e72aed-f3c5-4b46-95ac-f8fde8a7b393; account_id=17876584134; daas_st={%22sdk_ver%22:%221.3.9%22%2C%22status%22:%220%22}; appid=150b4dfebe; gt_local_id=/IICsVkum+lO9c6kHEJcN2haRPTE3Z7RXm/DFx9wBYXd2a1UuNMIwA=="
const fd = "606566"
const GtToken = "RzAwAGNkY1FlAnKfraq8CC7EECd15YSg7LMFfBRfC/LaxLOEObztWfhZvxk9yPef11rjkIxQJtbTomdjefKsuXysRt7ODMzN2kMbSByTI6DlPpubRZFzJj8qomD0lrdgvvXcSSP7qsLTqlOvGzyKcuJv4SLf5rs6GppzvftNHgQeuEHwJS4ZE4DniKa0e03EhYTeZ4DvqlSp4K1J835h1qYILxNWqF9UUCAkUsoiCy1rJ2fRwOnDnnhXrvxxnUxmKI1zQE4bMze3hbFZq0W3mh4aL1VoeblSL8xaspTJwRyTd4Rn065Ys6yVPApxeBlJ9JIptBfQyRRhDyy9Y+Zs1QFhPfb9iGyfgrOp08BZv4RGteACjZzLbUmEmCDnVoAVMS4I/DhEJYD0QQqcPKBtkIwHYq0I57iEJFH/BGO2TqBypPoYBCa3GHRBa1TmGuP7nUvfIt8f5ruPrKZriUkLmK2RTPC6GzjQqAoRxiCFC7VpWCNpVciL+j87DXmc9t6B/gzRrSXzz1OKs0lcU1w0HGNiHyGtc0dHZ7PPdPlvDGHjT6M+2kmno372t2pkTzA3/vnnhWbM4lRTcLMvCmc7J9oYfxkNiUi5PxNV15pziQXnG5fMjuqeqeu5PB68adHZZE/THus5+UvJGLGqff1lsJZSsNRKZQ22v1Spz/cOvLSQsEg5xvx5vW4ivWD6o2LNJVic5GlxVHT6ty2GXEBpA3bXXNntanL85LCNTpQZb/Ll00t7VjCeR3Tcx9qf+XCF7GOrsjoc+jD7i3KonhW2M9lDbjyETYaACMLuVUHlh7utxdWoTwRpe1j4wkfz2NjmU2/4G3W+nlsoX1t7QjfCQ5EEdJVJMRg9As83B4yVF+IbPj/bAjPReethgY2YwjGmAF6io/yaKY/KtNgVVLyOG4HxtBl34rlxUug2ZPfU48vNWtxwCZ1dB0RlwKyD/87g7Xl1AdGokdN8Ds7pfZxezitj0FrP9xfjHccrQI7Rsn5KLmJk7i4Xn8RR8LtZI4fkkr+mpHzjFb6DqJncnlQjcAiZbXO2feyQSM4jyIXr2d2Kn+HOku5gJtSS5EUMWpOIuzCAiao+eb0JtIwGHX3KGg0A363KJf3054hmdizKTmavmAOoEnF3ZB5kl2tgMH2Qd8Qu+/WeuFkbiqW8ENLDdF7Ho3vfGbhcNc4ZlsnbRAjSYBGYeHje4IHURarN1Qx0mINXgs3GhmUdHnEIkdPCtpuyTrBYDoBkX9fU3afvdZOIwNGsP8SrN9scX+Iv8dNTctdkp+O5Cq7RBZf0/2OLKgTaewaYiZekYYozRiRUXm49L8OZnMaxGP8sX9lmUZbA4jmjUvcUaq7DER+3O7UtYwp836OoITvinfB/RqaHCvCOXY4AeDYU79Cczd4hPuaqruq6LddgVZszU5mo93Ux42VeZ7NyV+fPPxiBhTR4S3OTGsLvi7wniyDLolW4qBERTvLpTf7Ovd5dA/oOGMebWrqI6i16TqfXjJ+yiF1ZNtjiM2O+olHXPwibpFFJrVmwcwPKlprWWOZnqBJHWdKsvgfrOI/gOGSd7vijWkzouFOIW/Q5dr3PLEOL+6K1/WoD50rhqUA="

let chatId = ""

ipcMain.on('chat-start', sendMessage);

function sendMessage(event: any, position: any) {
    try {
        let win: any = null
        const webContents = event.sender
        win = BrowserWindow.fromWebContents(webContents)

        chat(position, cookie, fd, GtToken, chatId, win)
    } catch (error) {
        mainWindow?.webContents.send('console', JSON.stringify({ error: error }))
    }
}

async function initChat() {
    try {
        chatId = await getcChatId(cookie, fd, GtToken)
    } catch (error) {
        mainWindow?.webContents.send('console', JSON.stringify({ error: error }))
    }
}

export { initChat }
