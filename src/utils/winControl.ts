const winControl = {
    /**
   * 窗口移动
   * @param {boolean} canMove
   */
    windowMove: (canMove: boolean) => window.ipcRenderer.send("window-move-open", canMove)

};

export default winControl;
