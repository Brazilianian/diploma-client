import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegistrationView from '@/views/RegistationView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { auth } from '@/store/auth_store.js'
import AdminView from '@/views/AdminView.vue'

const MAIN_NAME = 'main'
const LOGIN_NAME = 'login'
const REGISTRATION_NAME = 'registration'
const ADMIN = 'ADMIN'

const WHITE_NAME_LIST = [LOGIN_NAME, REGISTRATION_NAME]
const ADMIN_NAME_LIST = [ADMIN]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: MAIN_NAME,
      component: HomeView
    },
    {
      path: '/login',
      name: LOGIN_NAME,
      component: LoginView
    },
    {
      path: '/registration',
      name: REGISTRATION_NAME,
      component: RegistrationView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/admin',
      name: ADMIN,
      component: AdminView
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

    return next({name: MAIN_NAME})
  }

  if (isAuth) {
    // Allow common user
    return next()
  }

  // Forbid
  next({ name: LOGIN_NAME })
})

export default router
