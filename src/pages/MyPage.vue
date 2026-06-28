<script setup lang="ts">
import { computed } from 'vue'
import { useBorrowStore } from '@/stores/borrowStore'
import BookCard from '@/components/BookCard.vue'
import { User, BookCheck, History, AlertTriangle, Calendar, Clock } from 'lucide-vue-next'
import { formatDate, isDueSoon, getDaysUntilDue } from '@/utils/date'
import type { BookWithBorrow } from '@/types'

const store = useBorrowStore()

const stats = computed(() => store.borrowStats)
const borrowedBooks = computed(() => store.myBorrowedBooks)
const returnedBooks = computed(() => store.myReturnedBooks)

const dueSoonBooks = computed(() => 
  borrowedBooks.value.filter(b => b.borrowRecord && isDueSoon(b.borrowRecord.dueDate))
)

const isBookDueSoon = (book: BookWithBorrow) => {
  if (!book.borrowRecord) return false
  return isDueSoon(book.borrowRecord.dueDate)
}

const getDueStatusText = (dueDate: string) => {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`
  if (days === 0) return '今天到期'
  if (days <= 3) return `还剩 ${days} 天`
  return `还剩 ${days} 天`
}

const getDueStatusClass = (dueDate: string) => {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return 'text-accent-red'
  if (days <= 3) return 'text-accent-red'
  return 'text-primary-500'
}
</script>

<template>
  <div class="space-y-8">
    <section class="bg-white dark:bg-[#1b2720] rounded-2xl shadow-card dark:shadow-none dark:border dark:border-primary-900 p-6 md:p-8 transition-colors duration-300">
      <div class="flex flex-col md:flex-row md:items-center gap-6">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
            <img :src="store.currentUser.avatar" :alt="store.currentUser.name" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-2xl font-serif font-bold text-primary-700 dark:text-primary-200">{{ store.currentUser.name }}</h1>
            <p class="text-primary-500 dark:text-primary-400 text-sm mt-1">欢迎回来，继续你的阅读之旅</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto md:pl-8 md:border-l md:border-cream-200 dark:md:border-primary-900">
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl mx-auto mb-2">
              <BookCheck class="w-5 h-5 text-primary-600 dark:text-primary-300" />
            </div>
            <p class="text-2xl font-bold text-primary-700 dark:text-primary-100">{{ stats.borrowed }}</p>
            <p class="text-xs text-primary-400 dark:text-primary-500">正在借阅</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-cream-200 dark:bg-[#2a2519] rounded-xl mx-auto mb-2">
              <History class="w-5 h-5 text-accent-brown dark:text-[#e0c38a]" />
            </div>
            <p class="text-2xl font-bold text-primary-700 dark:text-primary-100">{{ stats.returned }}</p>
            <p class="text-xs text-primary-400 dark:text-primary-500">已归还</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-2" :class="stats.dueSoon > 0 ? 'bg-red-100 dark:bg-red-950/60' : 'bg-primary-100 dark:bg-primary-900'">
              <AlertTriangle class="w-5 h-5" :class="stats.dueSoon > 0 ? 'text-accent-red dark:text-[#ff7a6b]' : 'text-primary-600 dark:text-primary-300'" />
            </div>
            <p class="text-2xl font-bold" :class="stats.dueSoon > 0 ? 'text-accent-red dark:text-[#ff7a6b]' : 'text-primary-700 dark:text-primary-100'">{{ stats.dueSoon }}</p>
            <p class="text-xs text-primary-400 dark:text-primary-500">即将到期</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl mx-auto mb-2">
              <User class="w-5 h-5 text-primary-600 dark:text-primary-300" />
            </div>
            <p class="text-2xl font-bold text-primary-700 dark:text-primary-100">{{ stats.total }}</p>
            <p class="text-xs text-primary-400 dark:text-primary-500">累计借阅</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="dueSoonBooks.length > 0" class="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-6 transition-colors duration-300">
      <div class="flex items-center space-x-2 mb-4">
        <AlertTriangle class="w-5 h-5 text-accent-red dark:text-[#ff7a6b]" />
        <h2 class="text-lg font-serif font-bold text-accent-red dark:text-[#ff7a6b]">到期提醒</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="book in dueSoonBooks"
          :key="book.id"
          class="bg-white dark:bg-[#1b2720] rounded-xl p-4 border-2 border-accent-red dark:border-[#ff6355] animate-pulse-soft dark:animate-[pulse-soft-dark_2s_ease-in-out_infinite] transition-colors duration-300"
        >
          <div class="flex items-start space-x-3">
            <img :src="book.cover" :alt="book.title" class="w-16 h-20 object-cover rounded-lg shadow-sm" />
            <div class="flex-1 min-w-0">
              <h3 class="font-serif font-semibold text-primary-800 dark:text-primary-100 line-clamp-1">{{ book.title }}</h3>
              <p class="text-sm text-primary-500 dark:text-primary-400 line-clamp-1">{{ book.author }}</p>
              <div class="mt-2 flex items-center space-x-1 text-sm" :class="getDueStatusClass(book.borrowRecord!.dueDate).replace('text-accent-red', 'text-accent-red dark:text-[#ff7a6b]')">
                <Calendar class="w-4 h-4" />
                <span>{{ getDueStatusText(book.borrowRecord!.dueDate) }}</span>
              </div>
              <p class="text-xs text-primary-400 dark:text-primary-500 mt-1">
                到期日：{{ formatDate(book.borrowRecord!.dueDate) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <BookCheck class="w-5 h-5 text-white" />
        </div>
        <h2 class="section-title !mb-0 !border-0 !pb-0">正在借阅</h2>
        <span class="tag tag-borrowed">{{ borrowedBooks.length }} 本</span>
      </div>
      
      <div v-if="borrowedBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <BookCard
          v-for="book in borrowedBooks"
          :key="book.id"
          :book="book"
          :show-due-date="true"
        />
      </div>
      <div v-else class="bg-white dark:bg-[#1b2720] dark:border dark:border-primary-900 rounded-xl p-8 text-center transition-colors duration-300">
        <Clock class="w-12 h-12 text-primary-300 dark:text-primary-700 mx-auto mb-3" />
        <p class="text-primary-500 dark:text-primary-400">暂无正在借阅的书籍</p>
      </div>
    </section>

    <section>
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-cream-200 dark:bg-[#2a2519] rounded-xl flex items-center justify-center">
          <History class="w-5 h-5 text-accent-brown dark:text-[#e0c38a]" />
        </div>
        <h2 class="section-title !mb-0 !border-0 !pb-0">借阅历史</h2>
        <span class="tag tag-available">{{ returnedBooks.length }} 本</span>
      </div>
      
      <div v-if="returnedBooks.length > 0" class="bg-white dark:bg-[#1b2720] dark:border dark:border-primary-900 rounded-xl shadow-card dark:shadow-none overflow-hidden transition-colors duration-300">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-cream-100 dark:bg-primary-900/60">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wider">书籍</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wider hidden md:table-cell">作者</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wider">借阅日期</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wider hidden sm:table-cell">归还日期</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cream-100 dark:divide-primary-900">
              <tr v-for="book in returnedBooks" :key="book.id" class="hover:bg-cream-50 dark:hover:bg-primary-900/40 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img :src="book.cover" :alt="book.title" class="w-10 h-14 object-cover rounded shadow-sm" />
                    <div>
                      <p class="font-medium text-primary-800 dark:text-primary-100 line-clamp-1">{{ book.title }}</p>
                      <p class="text-sm text-primary-400 dark:text-primary-500 md:hidden">{{ book.author }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-primary-600 dark:text-primary-200 hidden md:table-cell">{{ book.author }}</td>
                <td class="px-6 py-4 text-primary-600 dark:text-primary-200">{{ book.borrowRecord ? formatDate(book.borrowRecord.borrowDate) : '-' }}</td>
                <td class="px-6 py-4 text-primary-600 dark:text-primary-200 hidden sm:table-cell">{{ book.borrowRecord?.returnDate ? formatDate(book.borrowRecord.returnDate) : '-' }}</td>
                <td class="px-6 py-4">
                  <span class="tag tag-available">已归还</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="bg-white dark:bg-[#1b2720] dark:border dark:border-primary-900 rounded-xl p-8 text-center transition-colors duration-300">
        <History class="w-12 h-12 text-primary-300 dark:text-primary-700 mx-auto mb-3" />
        <p class="text-primary-500 dark:text-primary-400">暂无借阅历史</p>
      </div>
    </section>
  </div>
</template>
