<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { actionRun, imgSrc } from '@/utils/actions'
import winControl from "@/utils/winControl.ts";
let type = ref("默认")
let menuShow = ref(false)
let timer: any = ref(null)
onMounted(() => {
  type.value = 'start2'
  // window.ipcRenderer.send("third");
});
watch(type, (newValue) => {
  actionRun(newValue)
})
const action = () => {
  if (menuShow.value) {
    menuShow.value = false
    return
  }
  communication()
}
const showMenu = () => {
  // if (menuShow.value) {
  //   window.ipcRenderer.send("menu-hide");
  // } else {
  //   window.ipcRenderer.send("menu-show");
  // }
  menuShow.value = !menuShow.value
  winControl.windowMove(false)
}
const communication = () => {
  window.ipcRenderer.send("interaction-start");
  actionRun('开心')
};

const onMouseDown = (e: any) => {
  if (e.target instanceof HTMLInputElement
    || e.target instanceof HTMLButtonElement
    || e.target instanceof HTMLTextAreaElement
  ) {
    winControl.windowMove(false);
    return;
  }
  winControl.windowMove(true);
};
const onMouseUp = (_: any) => {
  winControl.windowMove(false)
  if (type.value == '提起') {
    type.value = "右下落"
  }
}
const onDrop = (event: any) => {
  if (event.button == 2) {
    return
  }
  if (timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(() => {
    type.value = "提起"
  }, 500)
}
const onDropUp = () => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
}
window.ipcRenderer.on('console', (_, message) => {
  console.log(JSON.parse(message))
})
</script>

<template>
  <div class="flex">
    <div class="menu" :class="{ show: menuShow }">
      <div class="menu-item">
        <img src="@/assets/images/22.png" alt="吃饭">
      </div>
      <div class="menu-item">
        <img src="@/assets/images/22.png" alt="学习">
      </div>
      <div class="menu-item">
        <img src="@/assets/images/22.png" alt="打工">
      </div>
    </div>
    <div id="box" @contextmenu="showMenu">
      <div class="logo" @click="action" @mousedown.preventDefault='onMouseDown' @mouseup.preventDefault='onMouseUp'
        :key="type" :style="{ backgroundImage: `url(${imgSrc})` }">
        <div style="height: 30vh;"></div>
        <div style="height: 70vh;" @mousedown='onDrop' @mouseup.preventDefault='onDropUp'></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.flex {
  width: 100vw;
  height: 100vh;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  -webkit-app-region: drag;
  position: relative;
}

#box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7em;
  height: 7em;
  margin: 0 auto;
}

.logo {
  width: 7em;
  height: 7em;
  will-change: filter;
  transition: filter 300ms;
  -webkit-app-region: no-drag;
  user-select: none;
  /* -webkit-user-drag: none; */
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  cursor: grab;
  background-color: transparent;
}

.menu {
  position: relative;
  height: 45px;
  display: none;
  justify-content: center;
  align-items: center;
  cursor: default;
  margin: 10px 0 20px;
}

.menu-item {
  position: absolute;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform-origin: 50% 250%;
  transform: rotate(0deg);
  transition: transform 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  z-index: 222;

  img {
    width: 30px;
    vertical-align: middle;
    object-fit: cover;
    transform-origin: 15px 15px;
  }

  &:nth-child(1) {
    animation: rotateLeft 1s ease-in-out forwards;

    img {
      transform: rotate(45deg);
    }
  }

  &:nth-child(3) {
    animation: rotateRight 1s ease-in-out forwards;

    img {
      transform: rotate(-45deg);
    }
  }
}

.show {
  animation: show 1s ease-in-out forwards;
}

@keyframes rotateLeft {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-45deg);
  }
}

@keyframes rotateRight {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(45deg);
  }
}

@keyframes show {
  from {
    display: none;
  }

  to {
    display: flex;
  }
}
</style>
