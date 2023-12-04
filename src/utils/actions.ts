import { ref, watch } from "vue";
import HeartBeat from './randomInterval'

// import log from '../utils/console'

const mainScreen: any = localStorage.getItem('mainScreen')
const { width = 0 } = JSON.parse(mainScreen)?.size || {}

const heartbeat = new HeartBeat({
    0: () => {
        const winStartPosition: any = window?.electronStore.get('winStartPosition')
        if (winStartPosition.x > -50) {
            changePath('左转')
        } else {
            if (winStartPosition.y == 0) {
                changePath('左下落')
            } else {
                changePath('左上爬')
            }
        }
    },
    1: () => {
        const winStartPosition: any = window?.electronStore.get('winStartPosition')
        if (winStartPosition.x < width - 105) {
            changePath('右转')
        } else {
            if (winStartPosition.y == 0) {
                changePath('右下落')
            } else {
                changePath('右上爬')
            }
        }
    }
})

let imgIndex = ref(0)
let filePath = ref('默认')
let imgSrc = ref('')
let requestId = ref(0)
let imgLength = ref(0)
let number = ref(0)
let timer: any = ref(null)

const getImageUrl = (path: any, index: any) => {
    return new URL(`../assets/pet/${path}/${index}_125.png`, import.meta.url).href
}

watch(imgIndex, (newVal) => {
    let index = String(newVal).padStart(3, '0')
    const img = new Image();
    img.src = getImageUrl(filePath.value, index);
    img.onload = function () {
        imgSrc.value = img.src
    };
})

watch(number, () => {
    //获取这个动作的图片数量
    const files = import.meta.glob(`../assets/pet/**`)
    imgLength.value = Object.keys(files).filter(file => file.includes(filePath.value)).length - 1
    actions[filePath.value]()
})

const changePath = (path: string) => {
    filePath.value = path
    number.value++
}

/**
 * 动画
 * @param time 定时器延迟时间
 * @param isLoop 是否循环
 */
const motion = (time: number = 11, isLoop: boolean = false) => {
    imgIndex.value = 0
    const date = new Date().getTime()
    return new Promise((resolve) => {
        let temp = date
        function animate(time: number, isLoop: boolean, date: any) {
            if (imgIndex.value < imgLength.value) {
                requestId.value = requestAnimationFrame(() => {
                    if (new Date().getTime() - date > time * 17) {
                        imgIndex.value++;
                        temp = new Date().getTime()
                    }
                    animate(time, isLoop, temp);
                });
            } else {
                if (isLoop) {
                    imgIndex.value = 0;
                    animate(time, isLoop, temp);
                } else {
                    resolve(true);
                }
            }
        }

        animate(time, isLoop, temp)
    })

};

// 默认
const normal = () => {
    motion(3).then(() => {
        imgIndex.value = 0;
    })
}

// 启动
const start = async () => {
    await motion(7).then(() => {
        actionRun('默认');
    })
}
// 启动1
const start1 = async () => {
    await motion(7).then(() => {
        actionRun('默认');
    })
}
// 启动2
const start2 = async () => {
    await motion(7).then(() => {
        actionRun('默认');
    })
}
// 生病咳嗽
const sicklyCough = async () => {
    motion().then(() => {
        actionRun('默认');
    })
}

// 开心
const happy = async () => {
    await motion(3).then(() => {
        actionRun('默认');
    })
}

// 工作
const work = async () => {
    await motion(12).then(() => {
        actionRun('默认');
    })
}

// 提起
const carry = async () => {
    await motion(8, true)
}

// 下落
const drop = async () => {
    let stopText = '右停止下落'

    if (filePath.value == '左下落') {
        stopText = '左停止下落'
    }
    motion(8, true)
    await window.ipcRenderer.invoke("start-drop")
    cancelAnimationFrame(requestId.value);
    changePath(stopText)
    motion(20).then(() => {
        actionRun('默认');
    })
}

// 向左走或向右走
const walk = async () => {
    let orientations = -1
    let actText = '向左走'
    let stopText = '停止左走'

    if (filePath.value == '右转') {
        actText = '向右走'
        stopText = '停止右走'
        orientations = 1
    }
    await motion(7)
    changePath(actText)
    motion(7, true)
    window.ipcRenderer.invoke("start-walk", orientations).then(() => {
        clearTimeout(timer.value)
        cancelAnimationFrame(requestId.value);
        if (filePath.value == '向左走') {
            changePath('左上爬')
        } else {
            changePath('右上爬')
        }
    });
    timer.value = setTimeout(async () => {
        cancelAnimationFrame(requestId.value);
        window.ipcRenderer.send("stop");
        changePath(stopText)
        await motion(8)
        actionRun('默认');
    }, 5000)
}
// 左上爬或右上爬
const upCrawl = async () => {
    motion(12, true)
    window.ipcRenderer.invoke("start-crawl").then(() => {
        clearTimeout(timer.value)
        cancelAnimationFrame(requestId.value);
        if (filePath.value == '左上爬') {
            changePath('左下落')
        } else {
            changePath('右下落')
        }
    });
    timer.value = setTimeout(async () => {
        cancelAnimationFrame(requestId.value);
        window.ipcRenderer.send("stop");
        heartbeat.start(true)
    }, 5000)
}

const actions: any = {
    '默认': normal,
    '启动': start,
    '启动1': start1,
    'start2': start2,
    '开心': happy,
    '生病咳嗽': sicklyCough,
    '工作': work,
    '提起': carry,
    '下落': drop,
    '左转': walk,
    '左上爬': upCrawl,
    '左下落': drop,
    '右转': walk,
    '右上爬': upCrawl,
    '右下落': drop,
}

const actionRun = (type: string) => {
    clearTimeout(heartbeat.timer)
    if (type == '右下落') {
        cancelAnimationFrame(requestId.value);
        imgIndex.value = 0
    }
    if (type != '提起' && type != '右下落') {
        // heartbeat.start()
    }
    if (imgIndex.value !== 0 && type != '默认') return
    changePath(type)
}

export { actionRun, imgSrc }
