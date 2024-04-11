import axios from 'axios'

const USER_KEY = "USER"

export function getUserFromLocalStorage() {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUserFromLocalStorage() {
  localStorage.removeItem(USER_KEY)
}

export async function getUserImage() {
  return axios.get(`/users/image`)
}

export async function updateUser(user) {
  return axios.put(`/users`, {
    firstName: user.firstName,
    lastName: user.lastName,
    image: {
      content: user.image.content
    }
  })
}
