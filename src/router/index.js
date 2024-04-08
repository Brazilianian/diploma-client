import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegistrationView from '@/views/RegistationView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { auth } from '@/store/auth_store.js'
import AdminView from '@/views/AdminView.vue'
import UnitView from '@/views/UnitView.vue'

const names = Object.freeze({
  MAIN: 'main',
  LOGIN: 'login',
  REGISTRATION: 'registration',
  ADMIN: 'admin',
  UNIT: 'unit'
})


const WHITE_NAME_LIST = [names.LOGIN, names.REGISTRATION]
const ADMIN_NAME_LIST = [names.ADMIN]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: names.MAIN,
      component: HomeView
    },
    {
      path: '/login',
      name: names.LOGIN,
      component: LoginView
    },
    {
      path: '/registration',
      name: names.REGISTRATION,
      component: RegistrationView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/admin',
      name: names.ADMIN,
      component: AdminView
    },
    {
      path: '/units/:id',
      name: names.UNIT,
      component: UnitView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (WHITE_NAME_LIST.includes(to.name)) {
    return next()
  }

  const isAuth = auth.state.isAuth
  const isAdmin = auth.state.isAdmin

  if (ADMIN_NAME_LIST.includes(to.name)) {
    // Trying to go to the admin urls

    if (isAdmin) {
      return next()
    }

    return next({name: names.MAIN})
  }

  if (isAuth) {
    // Allow common user
    return next()
  }

  // Forbid
  next({ name: names.LOGIN })
})

export default router
