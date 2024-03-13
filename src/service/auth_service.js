import axios from 'axios'

export async function createUser(user) {
  return await axios.post('/auth/registration', {
    user: user
  })
}