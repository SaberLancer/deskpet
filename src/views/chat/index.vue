<template>
    <div class="main" id="main">
        <div class="chat-message" v-for="(message, index) in state.chatMessage">
            <div class="chat-message-content">
                <span class="chat-image">
                    <img src="@/assets/images/22.png" alt="">
                </span>
                <div class="text" style="background: transparent;">{{ message.position }}</div>
            </div>
            <div class="chat-message-content">
                <span class="chat-image">
                    <img src="http://124.221.105.45/images/zp3.png" alt="">
                </span>
                <div class="text">
                    <Markdown v-if="message.result" :className="`question-stem-${index}`" :index="index" :message="message"
                        @again="again">
                    </Markdown>
                    <span v-else style="margin-left: 10px;"><loading-outlined />回答中...</span>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <a-input class="input" v-model:value="state.chatPosition" placeholder="Basic usage" @pressEnter="send" />
            <a-button type="primary" @click="send">发送</a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
    LoadingOutlined,
} from '@ant-design/icons-vue';
// import Markdown from './components/markdown.vue'
// import log from "../../utils/console";
const state: any = reactive({
    chatPosition: '',
    chatMessage: [],
    isChat: false
})

watch(state.chatMessage, () => {
    const chatContainer: any = document.getElementById('main');
    chatContainer.scrollTop = chatContainer?.scrollHeight || 0;
})

const send = () => {
    if (!state.chatPosition) return
    state.isChat = true
    window.ipcRenderer.send("chat-start", state.chatPosition)
    window.ipcRenderer.on("chat-continue", (_, res) => {
        let message = state.chatMessage[state.chatMessage.length - 1]
        message.result += res
    });
    window.ipcRenderer.on("chat-end", () => {
        let message = state.chatMessage[state.chatMessage.length - 1]
        state.isChat = false
        message.end = true
        window.ipcRenderer.removeAllListeners('chat-continue');
    });
    let messgae = {
        position: state.chatPosition,
        result: ''
    }
    state.chatMessage.push(messgae)
    state.chatPosition = ''
}

const again = (obj: any) => {
    window.ipcRenderer.send("chat-start", obj.position)
    state.chatMessage[obj.index].result = ''
    window.ipcRenderer.on("chat-continue", (_: any, res: any) => {
        let message = state.chatMessage[obj.index]
        message.result += res
    });
    window.ipcRenderer.on("chat-end", () => {
        let message = state.chatMessage[obj.index]
        message.end = true
        window.ipcRenderer.removeAllListeners('chat-continue');
    });
}
</script>

<style lang="less" scoped>
.main {
    width: calc(100% - 40px);
    height: calc(100vh - 70px);
    text-align: left;
    overflow-x: auto;
    padding: 10px 20px;
    background: #eef2fb;
}

.chat-message {
    margin-bottom: 20px;

    .chat-message-content {
        display: flex;
        margin-bottom: 20px;
    }

    .chat-image {
        height: 34px;
        border-radius: 100%;
        overflow: hidden;
        flex-shrink: 0;

        img {
            width: 34px;
            vertical-align: middle;
            object-fit: cover;
        }
    }

    .text {
        width: 100%;
        margin-left: 10px;
        padding: 5px 10px;
        background: #fff;
        border-radius: 5px;
    }
}

.chat-input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    box-shadow: 0px 0px 10px 0px #666;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.input {
    width: 75%;
}
</style>
