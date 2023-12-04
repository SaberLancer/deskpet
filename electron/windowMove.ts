import { screen, ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store()

/**
 * 窗口移动
 * @param win
 */
function windowMove(win: any) {

    let winStartPosition = { x: 0, y: 0 };
    let mouseStartPosition = { x: 0, y: 0 };
    let movingInterval: any = null;

    /**
     * 窗口移动事件
     */
    ipcMain.on("window-move-open", (_, canMoving) => {
        if (canMoving) {
            // 读取原位置
            const winPosition = win?.getPosition();
            winStartPosition = { x: winPosition[0], y: winPosition[1] };
            mouseStartPosition = screen.getCursorScreenPoint();
            // 清除
            if (movingInterval) {
                clearInterval(movingInterval);
            }
            // 新开
            movingInterval = setInterval(() => {
                // 实时更新位置
                const cursorPosition = screen.getCursorScreenPoint();
                const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
                const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
                win.setPosition(x, y, true);
            }, 1);
        } else {
            clearInterval(movingInterval);
            movingInterval = null;
            const winPosition = win?.getPosition();
            store.set('winStartPosition', { x: winPosition[0], y: winPosition[1] })
            // win.blur();
        }
    });
}

export default windowMove;
