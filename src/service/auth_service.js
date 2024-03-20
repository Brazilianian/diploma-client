import axios from 'axios'

export async function createUser(user) {
  return await axios.post('/auth/register', {
    firstName: user.name,
    lastName: user.surname,
    email: user.email,
    password: user.password
  })
}

export async function loginUser(user) {
  return await axios.post('/auth/authenticate', {
    email: user.email,
    password: user.password
  })
}

export function getTokensFromResponse(response) {
  return response.data.tokens
}

export function getUserFromResponse(response) {
  return response.data.user
}