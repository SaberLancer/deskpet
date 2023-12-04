const { spawn } = require('child_process');
const path = require('path');
import { ipcMain, BrowserWindow } from 'electron'

const cookie = "di_c_mti=84c71244-c6d6-6fad-94d5-8871e8eb5b8c; d_d_app_ver=1.4.0; daas_st={%22sdk_ver%22:%221.3.9%22%2C%22status%22:%220%22}; appid=150b4dfebe; d_d_ci=c43db2c5-be50-6dbd-a843-e5ab25bec793; ssoSessionId=91e72aed-f3c5-4b46-95ac-f8fde8a7b393; account_id=17876584134; gt_local_id=/IICsVkum+lO9c6kHEJcN2haRPTE3Z7RXm/DFx9wBYXd2a1UuNMIwA=="
const fd = "945990"
const GtToken = "RzAwAGNkY1FlAnKfraq8CC7EECd15YSg7LMFfBRfC/LaxLOEObztWfhZvxk9yPef11rjkIxQJtbTomdjefKsuXysRt7ODMzN2kMbSByTI6DlPpubRZFzJj8qomD0lrdgvvXcSSP7qsLTqlOvGzyKcuJv4SLf5rs6GppzvftNHgQeuEHwJS4ZE4DniKa0e03EhYTeZ4DvqlSp4K1J835h1qYILxNWqF9UUCAkUsoiCy1rJ2fRwOnDnnhXrvxxnUxmKI1zQE4bMze3hbFZq0W3mh4aL1VoeblSL8xaspTJwRyTd4Rn065Ys6yVPApxeBlJ9JIptBfQyRRhDyy9Y+Zs1QFhPfb9iGyfgrOp08BZv4RGteACjZzLbUmEmCDnVoAVMS4I/DhEJYD0QQqcPKBtkIwHYq0I57iEJFH/BGO2TqBypPoYBCa3GHRBa1TmGuP7nUvfIt8f5ruPrKZriUkLmK2RTPC6GzjQqAoRxiCFC7VpWCNpVciL+j87DXmc9t6B/gzRrSXzz1OKs0lcU1w0HGNiHyGtc0dHZ7PPdPlvDGHjT6M+2kmno372t2pkTzA3/vnnhWbM4lRTcLMvCmc7J9oYfxkNiUi5PxNV15pziQXnG5fMjuqeqeu5PB68adHZZE/THus5+UvJGLGqff1lsJZSsNRKZQ22v1Spz/cOvLSQsEg5xvx5vW4ivWD6o2LNJVic5GlxVHT6ty2GXEBpA3bXXNntanL85LCNTpQZb/Ll00t7VjCeR3Tcx9qf+XCF7GOrsjoc+jD7i3KonhW2M9lDbjyETYaACMLuVUHlh7utxdWoTwRpe1j4wkfz2NjmU2/4G3W+nlsoX1t7QjfCQ5EEdJVJMRg9As83B4yVF+IbPj/bAjPReethgY2YwjGmAF6io/yaKY/KtNgVVLyOG4HxtBl34rlxUug2ZPfU48vNWtxwCZ1dB0RlwKyD/87g7Xl1AdGokdN8Ds7pfZxezitj0FrP9xfjHccrQI7Rsn5KLmJk7i4Xn8RR8LtZI4fkkr+mpHzjFb6DqJncnlQjcAiZbXO2feyQSM4jyIXr2d2Kn+HOku5gJtSS5EUMWpOIuzCAiao+eb0JtIwGHX3KGg0A363KJf3054hmdizKTmavmAOoEnF3ZB5kl2tgMH2Qd8Qu+/WeuFkbiqW8ENLDdF7Ho3vfGbhcNc4ZlsnbRAjSYBGYeHje4IHURarN1Qx0mINXgs3GhmUdHnEIkdPCtpuyTrBYDoBkX9fU3afvdZOIwNGsP8SrN9scX+Iv8dNTctdkp+O5Cq7RBZf0/2OLKgTaewaYiZekYYozRiRUXm49L8OZnMaxGP8sX9lmUZbA4jmjUvcUaq7DER+3O7UtYwp836OoITvinfB/RqaHCvCOXY4AeDYU79Cczd4hPuaqruq6LddgVZszU5mo93Ux42VeZ7Nynw//4kR6XTT6LdfOPCoFtJWP0Vauoj/GiSPpHHab0wVvHcOLL039dSzEJKot4TezXHq0XZ0z08Bzu+0DQ0Zc67uFZLFSQ9GJD3C4lu/DM8Kmx7fpXK12pb6caltn2774"

let chatId = ""

ipcMain.on('chat-start', sendMessage);

function sendMessage(event: any, position: any) {
    let win: any = null
    // 要执行的 Python 脚本和参数
    const pythonScriptPath = path.join(__dirname, '../sparkdesk_webs/chat.py');
    const pythonArgs = [position, cookie, fd, GtToken, chatId];

    // 启动 Python 子进程
    const pythonProcess = spawn('python3', [pythonScriptPath, ...pythonArgs]);

    // 监听子进程的标准输出
    pythonProcess.stdout.on('data', (data: any) => {
        const result = data.toString();
        const webContents = event.sender
        win = BrowserWindow.fromWebContents(webContents)
        event.sender.send('chat-continue', result)
        // event.reply('chat-end', result)
        // console.log(`Python 插件返回结果: ${result}`);
    });

    // 监听子进程的错误输出
    pythonProcess.stderr.on('data', (data: any) => {
        console.error(`Python 插件错误: ${data}`);
    });

    // 在子进程完成后执行回调
    pythonProcess.on('close', (code: any) => {
        win?.webContents.send('chat-end')
        console.log(`Python 子进程已退出，退出码 ${code}`);
    });
}

function initChat() {
    // 要执行的 Python 脚本和参数
    const pythonScriptPath = path.join(__dirname, '../sparkdesk_webs/start.py');
    const pythonArgs = [cookie, fd, GtToken];

    // 启动 Python 子进程
    const pythonProcess = spawn('python3', [pythonScriptPath, ...pythonArgs]);

    // 监听子进程的标准输出
    pythonProcess.stdout.on('data', (data: any) => {
        const result = data.toString();
        chatId = result
        // event.reply('chat-end', result)
        // console.log(`Python 插件返回结果: ${result}`);
    });

    // 监听子进程的错误输出
    pythonProcess.stderr.on('data', (data: any) => {
        console.error(`Python 插件错误: ${data}`);
    });

    // 在子进程完成后执行回调
    pythonProcess.on('close', (code: any) => {
        console.log(`Python 子进程已退出，退出码 ${code}`);
    });
}

export { initChat }
