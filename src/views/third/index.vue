<template>
    <!-- <div></div> -->
    <iframe ref="externalWebsite" :src="externalWebsiteUrl" width="100%" height="100%" frameborder="0"></iframe>
    <!-- <webview id="webview" autosize="on" allowpopups :src="externalWebsiteUrl" :data-home="externalWebsiteUrl"
        scrollbars="none" partition="pdd-modal-webview"></webview> -->
</template>

<script setup lang="ts">
const externalWebsiteUrl = 'https://www.baidu.com';
</script>

<style lang="less" scoped>
#webview {
    width: 200px;
    height: 200px;
}
</style>

