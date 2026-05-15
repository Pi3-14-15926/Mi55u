const AUTH_KEY = 'love_admin_auth'

interface AuthState {
  loggedIn: boolean
  username: string
  timestamp: number
}

const DEFAULT_PASSWORD = 'love2024'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export function login(password: string): boolean {
  if (password !== DEFAULT_PASSWORD) return false

  const state: AuthState = {
    loggedIn: true,
    username: 'admin',
    timestamp: Date.now(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(state))
  return true
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false

  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return false

  try {
    const state: AuthState = JSON.parse(stored)
    if (!state.loggedIn) return false
    if (Date.now() - state.timestamp > SESSION_DURATION) {
      logout()
      return false
    }
    return true
  } catch {
    return false
  }
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  if (oldPassword !== DEFAULT_PASSWORD) return false
  localStorage.setItem('love_admin_password', newPassword)
  return true
}
