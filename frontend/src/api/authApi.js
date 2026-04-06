import axios from 'axios'

const api = axios.create({
  baseURL: '/auth',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export const authApi = {
  register: (username, email, password) =>
    api.post('/register', { username, email, password }),

  login: (username, password) =>
    api.post('/login', { username, password }),
}

// Store token in localStorage
export const saveAuth = (token, username, email) => {
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)
  localStorage.setItem('email', email)
}

export const getAuth = () => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
})

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
}

export const isLoggedIn = () => !!localStorage.getItem('token')
