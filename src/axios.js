import axios from 'axios'
import { getAccessToken } from '@/service/token_service.js'
import { getTokensFromResponse, getUserFromResponse, refreshToken } from '@/service/auth_service.js'

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
    if (error.response.status === 401 && error.response.body.message === 'Expired') {
      await refreshToken()
        .then(res => {

          const user = getUserFromResponse(res)
          const tokens = getTokensFromResponse(res)

          this.$store.commit('auth/loginSuccess', { user, tokens })
          return axios.request(error.config)
        })
        .catch((err) => {
          this.$store.commit('auth/loginFailure')

          throw err
        })
    }

    return Promise.reject(error);
  })