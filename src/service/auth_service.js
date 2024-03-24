import axios from 'axios'
import { getRefreshToken } from '@/service/token_service.js'

export async function createUser(user) {
  return axios.post('/auth/register', {
    firstName: user.name,
    lastName: user.surname,
    email: user.email,
    password: user.password
  })
}

export async function loginUser(user) {
  return axios.post('/auth/authenticate', {
    email: user.email,
    password: user.password
  })
}

export async function refreshToken() {
  const refreshToken = getRefreshToken()

  return axios.post('/auth/refresh-token', {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    },
    validateStatus: false
  })
}

export function getTokensFromResponse(response) {
  return response.data.tokens
}

export function getUserFromResponse(response) {
  return response.data.user
}
