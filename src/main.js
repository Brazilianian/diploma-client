import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Notifications from '@kyvg/vue3-notification'
import store from './store.js'

const app = createApp(App)

app
  .use(router)
  .use(Notifications)
  .use(store)

app.mount('#app')
