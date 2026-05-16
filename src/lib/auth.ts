const AUTH_KEY = 'love_admin_auth'
const PWD_KEY = 'love_admin_password'
const DEFAULT_PASSWORD = 'love2026'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

interface AuthState {
  loggedIn: boolean
  username: string
  timestamp: number
}

function getPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD
  return localStorage.getItem(PWD_KEY) || DEFAULT_PASSWORD
}

export function login(password: string): boolean {
  if (password !== getPassword()) return false

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
  if (oldPassword !== getPassword()) return false
  if (newPassword.length < 4) return false
  localStorage.setItem(PWD_KEY, newPassword)
  return true
}
