import { createStore } from 'vuex'
import { auth } from '@/store/auth_store.js'

export default createStore({
  modules: { auth }
})