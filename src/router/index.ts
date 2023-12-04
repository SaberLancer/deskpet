import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/index.vue'),
    },
    {
        path: '/interaction',
        name: '交流',
        component: () => import('@/views/interaction/index.vue'),
    },
    {
        path: '/todo',
        name: 'todo',
        component: () => import('@/views/todo/index.vue'),
    },
    {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/menu/index.vue'),
    },
    {
        path: '/third',
        name: 'third',
        component: () => import('@/views/third/index.vue'),
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
    },
];

// app router
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
