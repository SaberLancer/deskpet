<template>
  <div class="todo-box">
    <a-card
      v-for="(item, index) in todoList"
      :title="item.title"
      :hoverable="true">
      <template #extra>
        <a-space>
          <EditTwoTone @click="edit(item, index)" />
          <check-circle-two-tone
            two-tone-color="#52c41a"
            @click="fulfill(index)" />
          <BellTwoTone two-tone-color="#eb2f96" @click="openReminder(index)" />
        </a-space>
      </template>
      {{ item.text }}
    </a-card>
  </div>
  <todoPopup
    v-if="editShow"
    v-model:show="editShow"
    :info="editInfo"
    @changeInfo="changeInfo">
  </todoPopup>
  <todoReminder
    v-if="reminderShow"
    v-model:show="reminderShow"
    :date="todoList[reminderIndex].date"
    @setReminder="setReminder">
  </todoReminder>
  <a-float-button
    type="default"
    :style="{
      right: '24px',
    }"
    @click="addCard">
    <template #icon>
      <PlusOutlined />
    </template>
  </a-float-button>
</template>

<script setup lang="ts">
import {
  EditTwoTone,
  CheckCircleTwoTone,
  BellTwoTone,
  PlusOutlined,
} from "@ant-design/icons-vue";
import todoPopup from "@/components/todoPopup.vue";
import todoReminder from "@/components/todoReminder.vue";
import { formatDay } from "@/utils/formatDay";
import { ref, reactive } from "vue";
let todoList = reactive([
  {
    title: "todo1",
    text: "这是第一条todo",
    date: "",
  },
  {
    title: "todo2",
    text: "这是第一条todo",
    date: "",
  },
  {
    title: "todo3",
    text: "创建失败咋吃撒不吃亏不超速好不哈不成熟卡机不合适吧冲击波在擦奥斯卡补差价洒布车课程编号按款参不参加巴萨 茶杯查卡号仓库啊吃吧毕竟啊吃爱词霸画饼充饥好撒比哈私家车课程表萨比策就把成绩吧穷矮矬阿市场部补差价八行书不会继承",
    date: "",
  },
]);
let editInfo = reactive({});
const editShow = ref<boolean>(false);
const reminderShow = ref<boolean>(false);
let editIndex = -1;
let reminderIndex = -1;

const edit = (item: any, index: number) => {
  editInfo = item;
  editIndex = index;
  editShow.value = true;
};
const changeInfo = (info: any) => {
  if (!info.title) {
    if (editIndex >= 0) {
      todoList.splice(editIndex, 1);
    }
  } else {
    if (editIndex < 0) {
      todoList.push(info);
    } else {
      todoList[editIndex] = info;
    }
  }
};
const fulfill = (index: number) => {
  todoList.splice(index, 1);
};
const openReminder = (index: number) => {
  reminderIndex = index;
  reminderShow.value = true;
};
const setReminder = (date: string) => {
  if (date) {
    todoList[reminderIndex].date = date;
    let info = JSON.stringify({
      date: formatDay(date),
      info: todoList[reminderIndex],
    });
    window.ipcRenderer.send("reminder", info);
  }
};
const addCard = () => {
  editInfo = {};
  editIndex = -1;
  editShow.value = true;
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.todo-box {
  padding: 10px;
  font-size: 12px;
  background: #fff;
  text-align: left;
  -webkit-app-region: drag;
  & :deep(.ant-card) {
    margin-bottom: 20px;
    box-shadow: 5px 5px 5px #f0f0f0;
  }
}
.todo-box :deep(.ant-card-head) {
  min-height: 40px;
  padding: 0 15px;
}
.todo-box :deep(.ant-card-body) {
  padding: 15px;
}
.todo-item {
  /* border: 1px solid #ccc; */
  /* border-radius: 5px; */
  border-bottom: 1px solid #ccc;
  text-align: left;
  padding: 10px 5px;
  .todo-item-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 2px;
  }
  /* .todo-item-content {
  } */
}
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>
