class HeartBeat {
    private actions: (() => void)[]; // 这是一个函数数组，用于存储要执行的操作
    private minTime: number; // 最小时间间隔
    private maxTime: number; // 最大时间间隔
    public timer: any; // 定时器
    private isLoop: boolean; // 是否继续上一个动作
    private randomNumber: number; // 随机动作下标
    constructor(obj: any, minTime: number = 4 * 60 * 1000, maxTime: number = 6 * 60 * 1000) {
        this.actions = obj
        this.minTime = minTime;
        this.maxTime = maxTime;
        this.isLoop = false
        this.randomNumber = 0
    }
    randomInterval() {
        const randomTime = Math.floor(Math.random() * (this.maxTime - this.minTime + 1)) + this.minTime;
        return setTimeout(() => {
            // 在这里执行你想要触发的事件
            if (!this.isLoop) {
                this.randomNumber = Math.floor(Math.random() * 2)
            }
            this.randomNumber = 1
            this.actions[this.randomNumber]()
        }, randomTime);

    }
    start(isLoop: boolean = false) {
        this.isLoop = isLoop
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = this.randomInterval()
    }
}

export default HeartBeat;
