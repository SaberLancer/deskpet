import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

let action: any
let mixer: any
let camera: any
let controls: any
let model: any
let height: number = 0
let width: number
let boxId: string

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const loader = new FBXLoader();
let clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();


// 初始化场景，灯光，像机，控制器
export function init(id: string) {
    boxId = id
    document.getElementById(id)?.appendChild(renderer.domElement);
    height = document.getElementById(id)!.offsetHeight;
    height = 150
    width = document.getElementById(id)!.offsetWidth;
    // width = width;
    // height = height

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    controls = new OrbitControls(camera, renderer.domElement);
    //光源
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(100, 50, 400);
    scene.add(pointLight)


    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); //光源，color:灯光颜色，intensity:光照强度
    directionalLight.position.set(0, 100, 100);
    scene.add(directionalLight);
    // const pointLightHelper = new THREE.PointLightHelper(directionalLight,10);
    // scene.add(pointLightHelper);

    //设置相机位置
    // camera.position.set(0, 1, 1.5);
    //设置相机方向
    camera.lookAt(0, 0.6, 0);

    //辅助坐标轴
    // const axesHelper = new THREE.AxesHelper(200); //参数200标示坐标系大小，可以根据场景大小去设置
    // scene.add(axesHelper);
    // 背景颜色
    // scene.background = new THREE.Color(0xeaeaea);

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setClearAlpha(0.0);
    // renderer.antialias = true;
    renderModel();

    render();
}



// 加载人物模型
export function gltfModel(url: string) {
    loader.load(url, function (obj) {
        model = obj
        let scale = 1
        model.scale.set(scale, scale, scale); // 将模型放大两倍
        model.position.set(0, 0, 0); // 将模型位置设置为长方形模型的中心点
        model.rotation.set(0, 0, 0); // 可以根据需要调整模型的旋转

        // 遍历模型中的每一个材质并替换为 MeshBasicMaterial（支持骨骼动画）
        model.traverse(function (child: any) {
            if (child.isSkinnedMesh) { // 确保是 SkinnedMesh
                child.visible = false;
                // 检查材质是否是数组
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat: any, index: number) => {
                        if (mat.map) {
                            const texture = mat.map;

                            // 创建新的 MeshBasicMaterial 作为 Unlit 材质
                            const unlitMaterial = new THREE.MeshBasicMaterial({
                                map: texture,
                                skinning: true // 启用骨骼动画
                            } as { map: any, skinning: boolean });

                            // 替换材质数组中的材质
                            child.material[index] = unlitMaterial;

                            setTimeout(() => {
                                child.visible = true;
                            }, 100);
                        }
                    });
                } else {
                    // 如果材质不是数组
                    if (child.material.map) {
                        const texture = child.material.map;

                        const unlitMaterial = new THREE.MeshBasicMaterial({
                            map: texture,
                            skinning: true // 启用骨骼动画
                        } as { map: any, skinning: boolean });

                        // 直接替换材质
                        child.material = unlitMaterial;

                        setTimeout(() => {
                            child.visible = true;
                        }, 100);
                    }
                }
            }
        });
        mixer = new THREE.AnimationMixer(model);
        scene.add(model)

        loadExternalAnimation('/idle/pose.fbx')
    })
}

// 加载骨骼动画
export function loadExternalAnimation(url: string, isLoop: boolean = true, isPosition: boolean = false) {
    loader.load(url, (fbx: { animations: any[]; }) => {
        if (fbx.animations.length > 0) {
            // 仅使用动画部分，不使用模型
            fbx.animations.forEach((clip) => {
                // 清除根运动，保持动画原地进行
                // 遍历动画中的每个轨道
                if (isPosition) {
                    clip.tracks.forEach((track: { name: string | string[]; values: any; }) => {
                        // 查找根骨骼的位移轨道，通常是 ".position" 结尾的通道
                        if (track.name.includes('.position')) {
                            const len = track.values.length
                            // console.log(track.values)
                            // 判断哪个轴的位移值需要清0
                            const idx = Math.abs(track.values[0] - track.values[len - 3]) > Math.abs(track.values[2] - track.values[len - 1]) ? 0 : 2
                            // 清除位移关键帧数据，或手动设置为0
                            // "track.values" 是该动画轨道的位移值，每三个数字代表一个关键帧的 X, Y, Z
                            // console.log(track.values[0], track.values[len - 3])
                            for (let i = 0; i < len; i += 3) {
                                track.values[i + idx] = 0;   // X轴置0
                                // track.values[i + 2] = 0; // Z轴置0
                                // Y轴值保留不变，通常是 track.values[i + 1]
                            }
                        }
                    });
                }
                // 剪辑动画帧
                // const clipIdle = clip
                // const clipIdle = THREE.AnimationUtils.subclip(clip, "Walk", 0, 30);
                if (model) {
                    // 假设模型和动画使用相同的骨架
                    action = mixer.clipAction(clip, model);
                    // 设置动画只播放一次
                    if (!isLoop) {
                        action.setLoop(THREE.LoopOnce);
                        action.clampWhenFinished = true; // 动画结束后保持最后一帧
                    }
                    action?.play();
                }
            });
        }
    });
}

//获取与射线相交的对象数组
export function getIntersects(event: any) {
    let rect = document.getElementById(boxId)!.getBoundingClientRect();
    let rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    //通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    rayCaster.setFromCamera(mouse, camera);
    return rayCaster.intersectObjects(scene.children);
}

function renderModel() {
    //渲染
    renderer.setSize(width, height); //设置渲染区尺寸
    renderer.render(scene, camera); //执行渲染操作、指定场景、相机作为参数
    // renderer.setClearColor(0x00ff00); // 设置背景颜色为绿色
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // 设置曝光度
    renderer.toneMappingExposure = 1; // 适当调整曝光度

    // 同时设置Math.PI / 3代表只能左右转动不能上下转动
    controls.minPolarAngle = Math.PI / 3; // 最小极角为 60 度
    controls.maxPolarAngle = Math.PI / 3; // 最大极角为 60 度
}

function render() {
    // camera.lookAt(0, 0.6, 0);
    updateCameraPosition();
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
    if (mixer) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
    }
}

function updateCameraPosition() {
    if (model) {
        // 获取人物模型的位置
        const modelPosition = new THREE.Vector3();
        model.getWorldPosition(modelPosition);

        // 设置摄像机距离模型的相对位置
        const cameraDistance = 1.5; // 根据需求调整摄像机距离
        const cameraHeight = 1; // 调整摄像机高度
        camera.position.set(
            modelPosition.x,
            modelPosition.y + cameraHeight,
            modelPosition.z + cameraDistance
        );

        // 让摄像机始终看向模型
        camera.lookAt(modelPosition.x, modelPosition.y + 0.6, modelPosition.z);
    }
}

// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};
