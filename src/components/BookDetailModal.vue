<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Book } from '@/types'
import { X, MapPin, User, BookOpen, Clock, Check } from 'lucide-vue-next'
import { useBorrowStore } from '@/stores/borrowStore'
import { getStatusText, getStatusClass } from '@/utils/date'
import categoriesData from '@/data/categories.json'

interface Props {
  book: Book | null
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = useBorrowStore()
const isReserving = ref(false)

const category = computed(() => {
  if (!props.book) return null
  return categoriesData.find(c => c.id === props.book!.categoryId)
})

const isReserved = computed(() => {
  if (!props.book) return false
  return store.isBookReserved(props.book.id)
})

const canReserve = computed(() => {
  if (!props.book) return false
  return props.book.status === 'available' && !isReserved.value
})

const handleClose = () => {
  emit('close')
}

const handleReserve = async () => {
  if (!props.book || !canReserve.value) return
  
  isReserving.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  store.reserveBook(props.book.id)
  isReserving.value = false
}

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible && book"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleOverlayClick"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <div class="relative bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl dark:border dark:border-primary-800 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-float" style="animation-iteration-count: 1; animation-duration: 0.5s;">
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-[#1b2720]/90 dark:border dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-all duration-300 shadow-md"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>

          <div class="flex flex-col md:flex-row">
            <div class="md:w-2/5 relative">
              <div class="aspect-[3/4] bg-cream-200 dark:bg-primary-900">
                <img
                  :src="book.cover"
                  :alt="book.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="absolute bottom-4 left-4">
                <span class="tag" :class="isReserved ? 'tag-borrowed' : getStatusClass(book.status)">
                  {{ isReserved ? '已预约' : getStatusText(book.status) }}
                </span>
              </div>
            </div>

            <div class="md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
              <h2 class="text-2xl font-serif font-bold text-primary-800 dark:text-primary-100 mb-2">
                {{ book.title }}
              </h2>
              
              <div class="flex items-center space-x-2 text-primary-500 dark:text-primary-400 mb-4">
                <User class="w-4 h-4" />
                <span>{{ book.author }}</span>
                <span class="text-cream-400 dark:text-primary-700">|</span>
                <span v-if="category">{{ category.name }}</span>
              </div>

              <div class="flex items-center space-x-6 text-sm text-primary-600 dark:text-primary-200 mb-6 py-3 px-4 bg-cream-100 dark:bg-primary-900/60 rounded-xl">
                <div class="flex items-center space-x-2">
                  <MapPin class="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span>{{ book.location }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span>借阅 {{ book.borrowCount }} 次</span>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="font-serif font-semibold text-primary-700 dark:text-primary-200 mb-2 flex items-center">
                  <BookOpen class="w-4 h-4 mr-2" />
                  内容简介
                </h3>
                <p class="text-primary-600 dark:text-primary-300 leading-relaxed text-sm">
                  {{ book.description }}
                </p>
              </div>

              <button
                class="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                :disabled="!canReserve || isReserving"
                @click="handleReserve"
              >
                <template v-if="isReserving">
                  <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>预约中...</span>
                </template>
                <template v-else-if="isReserved">
                  <Check class="w-5 h-5" />
                  <span>已加入预约</span>
                </template>
                <template v-else-if="book.status === 'borrowed'">
                  <span>此书已被借出</span>
                </template>
                <template v-else>
                  <span>立即借阅预约</span>
                </template>
              </button>

              <p v-if="isReserved" class="text-center text-sm text-primary-500 dark:text-primary-400 mt-3">
                请在3天内到图书角取书
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}
</style>
