import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegistationView from '@/views/RegistationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {/
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/auth/registration',
      name: 'registration',
      component: RegistationView
    }
  ]
})

export default router
