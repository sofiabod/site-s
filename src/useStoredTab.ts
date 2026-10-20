import { useSyncExternalStore } from 'react'

type Tab = 'work' | 'mindset'
const listeners = new Set<() => void>()
let currentTab: Tab | undefined
const notify = () => listeners.forEach(listener => listener())
function snapshot(): Tab {
  if (currentTab) return currentTab
  try { return localStorage.getItem('tab') === 'mindset' ? 'mindset' : 'work' } catch { return 'work' }
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'tab' || event.key === null) { currentTab = undefined; notify() }
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}
function setTab(tab: Tab) {
  currentTab = tab
  try { localStorage.setItem('tab', tab) } catch { /* Still works with storage disabled. */ }
  notify()
}
const serverSnapshot = (): Tab => 'work'
export function useStoredTab() {
  return [useSyncExternalStore(subscribe, snapshot, serverSnapshot), setTab] as const
}
