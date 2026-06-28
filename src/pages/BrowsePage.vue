<script setup lang="ts">
import { ref, computed } from 'vue'
import BookCard from '@/components/BookCard.vue'
import BookDetailModal from '@/components/BookDetailModal.vue'
import { useBorrowStore } from '@/stores/borrowStore'
import type { Book, SortType } from '@/types'
import categoriesData from '@/data/categories.json'
import { Search, Filter, ArrowUpDown, BookOpen } from 'lucide-vue-next'

const store = useBorrowStore()

const selectedBook = ref<Book | null>(null)
const showModal = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const sortBy = ref<SortType>('borrowCount')

const sortOptions = [
  { value: 'borrowCount', label: '借阅次数' },
  { value: 'title', label: '书名' },
  { value: 'newest', label: '最新上架' }
]

const filteredBooks = computed(() => {
  let books = [...store.books]
  
  if (selectedCategory.value !== 'all') {
    books = books.filter(b => b.categoryId === selectedCategory.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    books = books.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query)
    )
  }
  
  if (sortBy.value === 'borrowCount') {
    books.sort((a, b) => b.borrowCount - a.borrowCount)
  } else if (sortBy.value === 'title') {
    books.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  }
  
  return books
})

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
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-primary-700">探索书架</h1>
        <p class="text-primary-500 text-sm mt-1">共 {{ filteredBooks.length }} 本书籍可供选择</p>
      </div>
      
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索书名或作者..."
          class="input-base pl-10"
        />
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 shadow-card">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center space-x-2">
          <Filter class="w-4 h-4 text-primary-500" />
          <span class="text-sm font-medium text-primary-700">分类：</span>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="selectedCategory === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-cream-100 text-primary-600 hover:bg-cream-200'"
              @click="selectedCategory = 'all'"
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
              @click="selectedCategory = cat.id"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 sm:ml-auto">
          <ArrowUpDown class="w-4 h-4 text-primary-500" />
          <span class="text-sm font-medium text-primary-700">排序：</span>
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
