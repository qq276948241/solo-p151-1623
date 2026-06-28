<script setup lang="ts">
import { ref, computed } from 'vue'
import BookCard from '@/components/BookCard.vue'
import BookDetailModal from '@/components/BookDetailModal.vue'
import { useBorrowStore } from '@/stores/borrowStore'
import type { Book } from '@/types'
import { BookOpen, BookCheck, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const store = useBorrowStore()
const router = useRouter()

const selectedBook = ref<Book | null>(null)
const showModal = ref(false)

const borrowedBooks = computed(() => store.borrowedBooks)
const availableBooks = computed(() => store.availableBooks.slice(0, 8))

const handleBookClick = (book: Book) => {
  selectedBook.value = book
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  setTimeout(() => {
    selectedBook.value = null
  }, 300)
}

const goToBrowse = () => {
  router.push('/browse')
}
</script>

<template>
  <div class="space-y-10">
    <section class="text-center py-8 bg-gradient-to-b from-primary-50 dark:from-primary-900/30 to-transparent rounded-3xl -mx-4 -mt-8 px-4 pt-12 transition-colors duration-300">
      <h1 class="text-3xl md:text-4xl font-serif font-bold text-primary-700 dark:text-primary-200 mb-3">
        欢迎来到小区图书角
      </h1>
      <p class="text-primary-500 dark:text-primary-400 max-w-xl mx-auto">
        在这里，每一本书都是一次心灵的旅行。探索我们的书架，发现属于你的故事。
      </p>
    </section>

    <section>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <BookCheck class="w-5 h-5 text-white" />
          </div>
          <h2 class="section-title !mb-0 !border-0 !pb-0">正在借阅</h2>
          <span class="tag tag-borrowed">{{ borrowedBooks.length }} 本</span>
        </div>
      </div>
      
      <div v-if="borrowedBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <BookCard
          v-for="book in borrowedBooks"
          :key="book.id"
          :book="book"
          @click="handleBookClick(book)"
        />
      </div>
      <div v-else class="bg-white dark:bg-[#1b2720] dark:border dark:border-primary-900 rounded-xl p-8 text-center transition-colors duration-300">
        <BookOpen class="w-12 h-12 text-primary-300 dark:text-primary-700 mx-auto mb-3" />
        <p class="text-primary-500 dark:text-primary-400">暂无正在借阅的书籍</p>
        <button class="btn-primary mt-4" @click="goToBrowse">去选书</button>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
            <BookOpen class="w-5 h-5 text-primary-600 dark:text-primary-300" />
          </div>
          <h2 class="section-title !mb-0 !border-0 !pb-0">可借书籍</h2>
          <span class="tag tag-available">{{ availableBooks.length }} 本</span>
        </div>
        <button
          class="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm group"
          @click="goToBrowse"
        >
          <span>查看更多</span>
          <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <BookCard
          v-for="book in availableBooks"
          :key="book.id"
          :book="book"
          @click="handleBookClick(book)"
        />
      </div>
    </section>

    <BookDetailModal
      :book="selectedBook"
      :visible="showModal"
      @close="handleCloseModal"
    />
  </div>
</template>
