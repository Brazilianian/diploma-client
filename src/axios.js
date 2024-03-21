import axios from 'axios'
import {
  getAccessToken,
  removeAccessTokenFromLocalStorage,
  removeRefreshTokenFromLocalStorage
} from '@/service/token_service.js'
import { getTokensFromResponse, getUserFromResponse, refreshToken } from '@/service/auth_service.js'
import { removeUserFromLocalStorage } from '@/service/user_service.js'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

axios.interceptors.request.use(function(config) {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

axios.interceptors.response.use(response => {
    return response
  },
  async error => {
    if (error.response.status === 401 && error.response.data.message === 'Expired') {
      await refreshToken()
        .then(res => {

          const user = getUserFromResponse(res)
          const tokens = getTokensFromResponse(res)

          this.$store.commit('auth/loginSuccess', { user, tokens })
          return axios.request(error.config)
        })
        .catch(() => {
          removeUserFromLocalStorage()
          removeAccessTokenFromLocalStorage()
          removeRefreshTokenFromLocalStorage()

          this.$store.commit('auth/logout')
          this.$router.push('/auth/login')
        })
    }

    return Promise.reject(error);
  })