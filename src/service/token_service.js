const ACCESS_TOKEN_KEY = "ACCESS_TOKEN"
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN"

export function getAccessToken() {
  return JSON.parse(localStorage.getItem(ACCESS_TOKEN_KEY))
}

export function saveAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
}

export function getRefreshToken() {
  return JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY))
}

export function saveRefreshToken(refreshToken) {
  localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken))
}