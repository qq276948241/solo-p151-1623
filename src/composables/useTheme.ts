import { ref, watch, onMounted, computed } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
let isInited = false

export function useTheme() {
  const theme = ref<Theme>('light')

  const getPreferredTheme = (): Theme => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(t)
    root.style.colorScheme = t
    localStorage.setItem(STORAGE_KEY, t)
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) {
      meta.content = t === 'dark' ? '#121a16' : '#FAF8F5'
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    if (!isInited) {
      theme.value = getPreferredTheme()
      isInited = true
    }
    applyTheme(theme.value)
  })

  watch(
    theme,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        applyTheme(newVal)
      }
    },
    { flush: 'post' }
  )

  return {
    theme,
    toggleTheme,
    isDark: computed(() => theme.value === 'dark'),
  }
}
