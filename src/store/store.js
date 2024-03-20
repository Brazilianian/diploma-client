import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuth: Boolean,
    user: {
    },
    tokens: {}
  },
  mutations: {
    loginFailure(state) {
      state.isAuth = false
      state.user = null
      state.tokens = null
    },
    loginSuccess(state, { tokens, user }) {
      state.isAuth = true
      state.tokens = tokens
      state.user = user
    },
    logout(state) {
      state.isAuth = false
      state.user = null
      state.tokens = null
    },
  },
  actions: {},
})