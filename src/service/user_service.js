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