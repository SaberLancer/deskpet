<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { actionRun, imgSrc } from '@/utils/actions'
import winControl from "@/utils/winControl.ts";
let type = ref("默认")
onMounted(() => {
  type.value = 'start2'
  // window.ipcRenderer.send("third");
});
watch(type, (newValue) => {
  actionRun(newValue)
})
let menuShow = ref(false)
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
  // menuShow.value = !menuShow.value
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
  let timer = null
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    type.value = "提起"
  }, 500)
}
window.ipcRenderer.on('console', (_, message) => {
  console.log(JSON.parse(message))
})
</script>

<template>
  <div class="flex">
    <div id="box" @contextmenu="showMenu">
      <div class="logo" @mousedown.preventDefault='onMouseDown' @mouseup.preventDefault='onMouseUp' :key="type"
        :style="{ backgroundImage: `url(${imgSrc})` }">
        <div style="height: 30vh;" @click="action"></div>
        <div style="height: 70vh;" @mousedown.preventDefault='onDrop'></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;
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
</style>
