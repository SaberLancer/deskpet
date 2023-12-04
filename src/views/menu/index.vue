<template>
    <div class="menu">
        <div class="menu-item">
            <img src="@/assets/foods/food.png" alt="吃饭">
        </div>
        <div class="menu-item">
            <img src="@/assets/foods/food.png" alt="学习">
        </div>
        <div class="menu-item">
            <img src="@/assets/foods/food.png" alt="打工">
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.menu {
    position: relative;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
}

.menu-item {
    position: absolute;
    top: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transform-origin: 50% 250%;
    transform: rotate(0deg);
    transition: transform 0.3s ease;
    cursor: pointer;

    &:nth-child(1) {
        transform: rotate(-45deg);

        img {
            transform: rotate(45deg);
        }
    }

    &:nth-child(2) {
        transform: rotate(0deg);

        img {
            transform: rotate(0deg);
        }
    }

    &:nth-child(3) {
        transform: rotate(45deg);

        img {
            transform: rotate(-45deg);
        }
    }

    img {
        height: 30px;
        vertical-align: middle;
    }
}

// .menu-item img:nth-child(1) {
//     transform: rotate(45deg);
// }

// .menu-item img:nth-child(2) {
//     transform: rotate(-45deg);
// }

// .menu-item img:nth-child(3) {
//     transform: rotate(-45deg);
// }
</style>
