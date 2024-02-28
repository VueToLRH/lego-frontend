import { createRouter, createWebHistory } from 'vue-router'

import HomeLayout from '@/layouts/home/index.vue'

import Home from '@/views/home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomeLayout',
      component: HomeLayout,
      children: [
        { path: '', name: 'home', component: Home, meta: { title: '欢迎来到乐高 lego' } },
      ],
    },
  ],
})

export default router
