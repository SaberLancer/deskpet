<template>
    <div class="menu">
        <div class="menu-item">
            <img src="@/assets/images/22.png" alt="吃饭">
        </div>
        <div class="menu-item">
            <img src="@/assets/images/22.png" alt="学习">
        </div>
        <div class="menu-item">
            <img src="@/assets/images/22.png" alt="打工">
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
    overflow: hidden;
    cursor: pointer;

    img {
        width: 30px;
        vertical-align: middle;
        object-fit: cover;
        transform-origin: 15px 15px;
    }

    &:nth-child(1) {
        animation: rotateLeft 1s ease-in-out forwards;

        img {
            transform: rotate(45deg);
        }
    }

    &:nth-child(3) {
        animation: rotateRight 1s ease-in-out forwards;

        img {
            transform: rotate(-45deg);
        }
    }
}

@keyframes rotateLeft {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-45deg);
    }
}

@keyframes rotateRight {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(45deg);
    }
}
</style>
