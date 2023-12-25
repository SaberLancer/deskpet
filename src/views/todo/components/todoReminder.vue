<template>
  <div ref="createCreative"></div>
  <a-modal
    :getContainer="() => createCreative"
    wrapClassName="modal"
    ref="modalRef"
    v-model:open="open"
    :wrap-style="{ overflow: 'hidden' }"
    :centered="true"
    :destroyOnClose="true"
    :closable="false"
    :okText="okText"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-time-picker
      placeholder="选择提醒时间"
      :disabled-time="disabledTime"
      :hideDisabledOptions="true"
      v-model:value="date">
    </a-time-picker>
    <template #title> 设置提醒时间 </template>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect } from "vue";
import type { Dayjs } from "dayjs";

const createCreative = ref();
const props = defineProps(["show", "date"]);
const emit = defineEmits(["update:show", "setReminder"]);
let open = false;
let date = ref<Dayjs>(props.date);
const okText = date ? "修改时间" : "添加提醒";
watchEffect(() => {
  open = props.show;
});
const disabledTime = (current: any) => {
  // 在这个函数中编写禁用时间的逻辑
  const currentHour = current.value.$H;
  const currentMinute = current.value.$m;
  // const currentSeconds = current.value.$s;

  if (currentHour) {
    // 禁用过去的时间
    return {
      disabledHours: () => range(0, currentHour),
      disabledMinutes: (selectedHour: any) =>
        selectedHour <= currentHour ? range(0, currentMinute) : [],
      // disabledSeconds: (selectedHour: any, selectedMinute: any) =>
      //   selectedHour <= currentHour && selectedMinute <= currentMinute
      //     ? range(0, currentSeconds)
      //     : [],
    };
  }
};
const handleOk = () => {
  emit("setReminder", date.value);
  handleCancel();
};
const handleCancel = () => {
  emit("update:show", false);
};
const range = (start: any, end: any) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
</script>

<style scoped>
:deep(.modal) .ant-modal-content .ant-modal-header,
:deep(.modal) .ant-modal-content .ant-modal-body,
:deep(.modal) .ant-modal-content .ant-modal-footer {
  display: flex;
  justify-content: center;
}
:deep(.modal) .ant-modal-content .ant-modal-footer {
  margin-top: 30px;
}
</style>
