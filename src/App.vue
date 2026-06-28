<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-cream-100">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    <footer class="bg-white border-t border-cream-200 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-sm text-primary-500">
        <p class="font-serif">小区图书角 · 让阅读成为生活的一部分</p>
        <p class="mt-1 text-xs text-primary-400">Community Library Corner © 2026</p>
      </div>
    </footer>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
