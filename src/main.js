import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios.js'
import store from './store/store.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Notifications from '@kyvg/vue3-notification'

import { GoogleMap, Marker,  } from 'vue3-google-map'

const app = createApp(App)

app
  .use(router)
  .use(Notifications)
  .use(store)

app

  .component('GoogleMap', GoogleMap)
  .component('Marker', Marker)

app.mount('#app')
