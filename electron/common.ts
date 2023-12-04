/**
 * 防抖
 * @param callback 回调函数
 * @param delay 延迟时间
 */
function debounce(callback: any, delay: number = 1000) {
    let timer: any = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            callback(arguments);
            timer = null;
        }, delay);
    }
}

export {
    debounce
}
