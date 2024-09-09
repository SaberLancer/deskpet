<template>
    <div id="my-three"></div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { init, gltfModel, loadExternalAnimation, getIntersects } from "@/utils/threeMethods";
let height = 0, width
onMounted(() => {
    init('my-three');
    gltfModel('keli.fbx')
});

// 交互事件
window.addEventListener("click", onMouseDblclick, false);

function onMouseDblclick(event) {
    let intersects = getIntersects(event);

    if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
        const selectedObject = intersects[0].object;

        // loadExternalAnimation('/status/Pacing And Talking On A Phone.fbx')
        loadExternalAnimation('/idle/Dwarf Idle.fbx')
        // window.ipcRenderer.invoke("start-walk", 1).then(() => {
        //     // clearTimeout(timer.value)
        //     // cancelAnimationFrame(requestId.value);
        //     // if (filePath.value == '向左走') {
        //     //     changePath('左上爬')
        //     // } else {
        //     //     changePath('右上爬')
        //     // }
        // });


        // if (action) {
        //     if (action?.isRunning()) {
        //         action.paused = true
        //     } else if (action?.paused) {
        //         action.paused = false
        //     }
        // } else {
        //     // model.rotation.y = Math.PI / 2
        //     loadExternalAnimation('/status/Pacing And Talking On A Phone.fbx')
        // }
    }
}
</script>

<style lang="less" scoped></style>
