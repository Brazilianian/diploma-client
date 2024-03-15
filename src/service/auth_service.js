import axios from 'axios'

export async function createUser(user) {
  return await axios.post('/auth/register', {
    firstName: user.name,
    lastName: user.surname,
    email: user.email,
    password: user.password
  })
}