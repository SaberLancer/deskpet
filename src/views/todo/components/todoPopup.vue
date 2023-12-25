<template>
  <a-modal
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
    <a-form ref="formRef" :model="infor">
      <a-form-item label="" name="text">
        <a-textarea v-model:value="infor.text" placeholder="任务描述（选填）" />
      </a-form-item>
    </a-form>
    <template #title>
      <a-form-item label="" name="title">
        <a-input
          v-model:value="infor.title"
          autocomplete="off"
          placeholder="任务名称" />
      </a-form-item>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, reactive, watchEffect } from "vue";

const props = defineProps(["show", "info"]);
const emit = defineEmits(["update:show", "changeInfo"]);
let open = false;
let infor = reactive(JSON.parse(JSON.stringify(props.info)));
const okText = infor.title ? "修改任务" : "添加任务";
watchEffect(() => {
  open = props.show;
});
const handleOk = () => {
  emit("changeInfo", infor);
  handleCancel();
};
const handleCancel = () => {
  emit("update:show", false);
};
</script>

<style scoped></style>
