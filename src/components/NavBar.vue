<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, Search, User, Library, Sun, Moon } from 'lucide-vue-next'
import { useBorrowStore } from '@/stores/borrowStore'
import { useTheme } from '@/composables/useTheme'
import { computed } from 'vue'

const route = useRoute()
const store = useBorrowStore()
const { isDark, toggleTheme } = useTheme()

const navItems = [
  { path: '/', name: '书架', icon: Library },
  { path: '/browse', name: '选书', icon: Search },
  { path: '/my', name: '我的', icon: User }
]

const isActive = (path: string) => route.path === path

const dueSoonCount = computed(() => store.borrowStats.dueSoon)
</script>

<template>
  <nav class="bg-white/80 dark:bg-[#121a16]/80 backdrop-blur-md shadow-sm dark:shadow-none sticky top-0 z-50 border-b border-cream-200 dark:border-primary-900 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 dark:group-hover:bg-primary-400 transition-colors duration-300">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-serif font-bold text-primary-700 dark:text-primary-200 leading-tight">小区图书角</h1>
            <p class="text-xs text-primary-500 dark:text-primary-400">Community Library</p>
          </div>
        </RouterLink>

        <div class="flex items-center space-x-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link flex items-center space-x-2 relative"
            :class="{ 'nav-link-active': isActive(item.path) }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="hidden sm:inline">{{ item.name }}</span>
            <span
              v-if="item.path === '/my' && dueSoonCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-accent-red text-white text-xs rounded-full flex items-center justify-center animate-pulse"
            >
              {{ dueSoonCount }}
            </span>
          </RouterLink>
          <button
            class="w-9 h-9 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-300 hover:bg-cream-200 dark:hover:bg-primary-900 transition-colors duration-200"
            :title="isDark ? '切换到浅色' : '切换到深色'"
            @click="toggleTheme"
          >
            <Moon v-if="!isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
