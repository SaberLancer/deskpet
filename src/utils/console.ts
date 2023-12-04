const log = (message: any) => {
    window.ipcRenderer.send('console', message)
}

export default log
