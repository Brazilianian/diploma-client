import { getUserFromLocalStorage } from '@/service/user_service.js'
import { getAccessToken, getRefreshToken } from '@/service/token_service.js'

const user = getUserFromLocalStorage()
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()

export const auth = {
  namespaced: true,
  state: {
    isAuth: !!user,
    user: user,
    isAdmin: user?.role === 'ADMIN',
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  },
  mutations: {
    loginFailure(state) {
      state.isAuth = false
      state.user = null
      state.tokens = {}
    },
    loginSuccess(state, { tokens, user }) {
      state.isAuth = true
      state.tokens = tokens
      state.user = user
    },
    logout(state) {
      state.isAuth = false
      state.user = null
      state.tokens = {}
    },
  },
  actions: {},
}