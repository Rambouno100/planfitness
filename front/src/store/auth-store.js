import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'

const KEY = 'planfitness-auth'

export const authStore = new Store({
  token: localStorage.getItem(KEY) || null,
})

export function setToken(token) {
  localStorage.setItem(KEY, token)
  authStore.setState((s) => ({ ...s, token }))
}

export function logout() {
  localStorage.removeItem(KEY)
  authStore.setState((s) => ({ ...s, token: null }))
}

export function useToken() {
  return useStore(authStore, (s) => s.token)
}
