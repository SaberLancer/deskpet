import * as schedule from 'node-schedule'

/**
 * 自定义定时器
 * @param time 时间 2023-10-17 10:38:30
 */
const customTimer = (time: string, fn: any) => {
    const arr = time.split(" ")
    const month = arr[0].split("-")[1] //月
    const day = arr[0].split("-")[2] //日
    const hour = arr[1].split(":")[0] //时
    const minute = arr[1].split(":")[1] //分
    const second = arr[1].split(":")[2] //秒
    // 设置定时任务
    schedule.scheduleJob(`${second} ${minute} ${hour} ${day} ${month} *`, fn);
}

export default customTimer
