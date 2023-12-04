import * as dayjs from "dayjs"
/**
 * 时间格式化 YYYY-MM-DD HH:mm:ss
 * @param time 传入时间
 */
function formatDay(time: any) {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
}

export { formatDay }
