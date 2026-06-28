<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import BookCard from '@/components/BookCard.vue'
import BookDetailModal from '@/components/BookDetailModal.vue'
import { useBorrowStore } from '@/stores/borrowStore'
import { useBookFilter } from '@/composables/useBookFilter'
import type { Book } from '@/types'
import categoriesData from '@/data/categories.json'
import { Search, Filter, ArrowUpDown, BookOpen, X } from 'lucide-vue-next'

const store = useBorrowStore()

const selectedBook = ref<Book | null>(null)
const showModal = ref(false)

const booksRef = toRef(store, 'books')
const {
  searchQuery,
  selectedCategory,
  sortBy,
  filteredBooks,
  sortOptions,
  clearSearch,
  setCategory
} = useBookFilter(booksRef)

const hasSearch = computed(() => searchQuery.value.trim().length > 0)

function handleBookClick(book: Book) {
  selectedBook.value = book
  showModal.value = true
}

function handleCloseModal() {
  showModal.value = false
  setTimeout(() => {
    selectedBook.value = null
  }, 300)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-serif font-bold text-primary-700">探索书架</h1>
      <p class="text-primary-500 text-sm mt-1">共 {{ filteredBooks.length }} 本书籍可供选择</p>
    </div>

    <div class="bg-white rounded-xl p-4 md:p-5 shadow-card space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <Filter class="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span class="text-sm font-medium text-primary-700 flex-shrink-0">分类：</span>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="selectedCategory === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-cream-100 text-primary-600 hover:bg-cream-200'"
              @click="setCategory('all')"
            >
              全部
            </button>
            <button
              v-for="cat in categoriesData"
              :key="cat.id"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="selectedCategory === cat.id 
                ? 'bg-primary-600 text-white' 
                : 'bg-cream-100 text-primary-600 hover:bg-cream-200'"
              @click="setCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 sm:ml-auto">
          <ArrowUpDown class="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span class="text-sm font-medium text-primary-700 flex-shrink-0">排序：</span>
          <select
            v-model="sortBy"
            class="select-base text-sm"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入书名或作者关键词搜索..."
          class="w-full pl-12 pr-11 py-3 rounded-xl bg-cream-100 border-2 border-primary-200 text-primary-800 placeholder:text-primary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
        />
        <button
          v-if="hasSearch"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-600 flex items-center justify-center transition-all duration-200"
          @click="clearSearch"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-if="filteredBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
        @click="handleBookClick(book)"
      />
    </div>
    
    <div v-else class="bg-white rounded-xl p-12 text-center">
      <BookOpen class="w-16 h-16 text-primary-200 mx-auto mb-4" />
      <h3 class="text-lg font-serif font-semibold text-primary-600 mb-2">没有找到相关书籍</h3>
      <p class="text-primary-400 text-sm">试试其他关键词或分类吧</p>
    </div>

    <BookDetailModal
      :book="selectedBook"
      :visible="showModal"
      @close="handleCloseModal"
    />
  </div>
</template>
