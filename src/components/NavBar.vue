<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, Search, User, Library } from 'lucide-vue-next'
import { useBorrowStore } from '@/stores/borrowStore'
import { computed } from 'vue'

const route = useRoute()
const store = useBorrowStore()

const navItems = [
  { path: '/', name: '书架', icon: Library },
  { path: '/browse', name: '选书', icon: Search },
  { path: '/my', name: '我的', icon: User }
]

const isActive = (path: string) => route.path === path

const dueSoonCount = computed(() => store.borrowStats.dueSoon)
</script>

<template>
  <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-cream-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-serif font-bold text-primary-700 leading-tight">小区图书角</h1>
            <p class="text-xs text-primary-500">Community Library</p>
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
        </div>
      </div>
    </div>
  </nav>
</template>
