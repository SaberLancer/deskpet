<template>
  <div v-if="text">
    <span class="interaction-box">{{ text }}</span>
  </div>
  <div v-else-if="todoInfo.title">
    <p class="reminder-title">{{ todoInfo.title }}</p>
    <p class="reminder-text">{{ todoInfo.text }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
type TodoInfo = {
  title: string;
  text: string;
};


let todoInfo = reactive<TodoInfo>({ title: "", text: "你好" });

const textList: string[] = ["吃饭了吗？", "想玩游戏吗?", "我饿了"];
let text = ref<string>('');

window.ipcRenderer.on("interaction-end", () => {
  const index: number = Math.floor(Math.random() * 3);
  text.value = textList[index];
});
window.ipcRenderer.on("reminder-show", (_, info) => {
  text.value = "";
  todoInfo = JSON.parse(info);
});
</script>

<style scoped>
.interaction-box {
  position: relative;
  display: inline-block;
  padding: 5px 20px;
  margin-top: 5px;
  background-color: #fff;
  border-radius: 5px;

  /* -webkit-clip-path: polygon(
    0 0,
    100% 0,
    100% 90%,
    60% 90%,
    50% 100%,
    40% 90%,
    0 90%
  ); */
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
  }

  -webkit-app-region: no-drag;
}

.reminder-title {
  font-size: 20px;
  font-weight: bold;
}

.reminder-text {
  /* text-align: left; */
}
</style>
