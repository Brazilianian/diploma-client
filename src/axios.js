import axios from "axios";
import { getAccessToken } from '@/service/token_service.js'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

axios.interceptors.request.use(function (config) {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})