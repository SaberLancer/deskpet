<template>
    <div :class="className" class="code" v-html="htmlContent">
    </div>
    <div class="comment" v-if="props.message.end">
        <SyncOutlined @click="again" />
        <CopyOutlined @click="copy" />
        <LikeOutlined />
        <DislikeOutlined />
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed, watch, onMounted, defineEmits, reactive } from 'vue'
import {
    SyncOutlined,
    CopyOutlined,
    LikeOutlined,
    DislikeOutlined
} from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import MathJax from '@/utils/mathJax'

interface Props {
    className: string;
    message: any;
    index: number
}
const props = defineProps<Props>()

const emit = defineEmits(['again'])

const state = reactive({
    lang: '',
    code: ''
})

const htmlContent = computed(() => {
    return md.render(props.message.result)
})

watch(() => props.message.end, (value) => {
    if (value) {
        laTexToMath(props.className)
    }
}, { deep: true })

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str: any, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                state.lang = lang
                state.code = str.replace(/\n/g, '<aaa>')
                const code = hljs.highlight(lang, str).value
                const html = `<div class="copy">
                    <span>${lang}</span>
                    <span style="cursor: pointer;" onclick="copyCode(${state.code})">复制代码</span>
                    </div><div class="content">${code}</div>`;
                return html;
            } catch (__) { }
        }
        if (lang == 'multi_image_url') {
            try {
                const obj = JSON.parse(str)
                const html = `<img src="${obj.url}" alt=""`;
                return html;
            } catch (__) { }
        }
        return '';
    }
})

const laTexToMath = (name: string) => {
    // MathJax3.0版本
    if (!MathJax.isMathjaxConfig) {
        //判断是否初始配置，若无则配置。
        MathJax.initMathjaxConfig();
    }
    MathJax.MathQueue(name);
}

const copyCode = (text: any) => {
    // 创建一个文本输入框
    var textArea = document.createElement("textarea");
    // 设置文本框的值为要复制的文本
    textArea.value = text.replace(/<aaa>/g, '\n');;
    // 将文本框添加到文档中
    document.body.appendChild(textArea);
    // 选择文本
    textArea.select();
    try {
        // 尝试执行复制操作
        var successful = document.execCommand('copy');
        var msg = successful ? '复制成功' : '复制失败';
        message.success(msg)
    } catch (err) {
        console.error('无法复制文本', err);
        message.error('无法复制文本')
    }
    // 从文档中移除文本框
    document.body.removeChild(textArea);
}

const copy = () => {
    // 创建一个文本输入框
    var textArea = document.createElement("textarea");
    // 设置文本框的值为要复制的文本
    textArea.value = props.message.result;
    // 将文本框添加到文档中
    document.body.appendChild(textArea);
    // 选择文本
    textArea.select();
    try {
        // 尝试执行复制操作
        var successful = document.execCommand('copy');
        var msg = successful ? '复制成功' : '复制失败';
        message.success(msg)
    } catch (err) {
        console.error('无法复制文本', err);
        message.error('无法复制文本')
    }
    // 从文档中移除文本框
    document.body.removeChild(textArea);
}

const again = () => {
    emit('again', { position: props.message.position, index: props.index })
}

onMounted(() => {
    window.copyCode = copyCode
})
</script>

<style lang="less" scoped>
.code {
    margin-top: 10px;
    white-space: normal;
    word-wrap: break-word;

    :deep(pre) {
        background-color: #000;
        color: #fff;
        border-radius: 5px;
        overflow: hidden;
    }

    :deep(*) {
        margin-bottom: 0;
    }

    :deep(.copy) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        background-color: #343541;
        padding: 5px 10px;

        span:last-child {
            font-size: 10px;
        }
    }

    :deep(.content) {
        padding: 10px 10px;
        font-size: 12px;
        white-space: pre-wrap;
    }

    :deep(.hljs-comment) {
        font-size: 10px;
    }

    margin-bottom: 10px;
}

.comment {
    display: flex;
    justify-content: end;

    span {
        margin-right: 10px;
    }
}
</style>
