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
    <section class="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-center gap-6">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            <img :src="store.currentUser.avatar" :alt="store.currentUser.name" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-2xl font-serif font-bold text-primary-700">{{ store.currentUser.name }}</h1>
            <p class="text-primary-500 text-sm mt-1">欢迎回来，继续你的阅读之旅</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto md:pl-8 md:border-l md:border-cream-200">
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-xl mx-auto mb-2">
              <BookCheck class="w-5 h-5 text-primary-600" />
            </div>
            <p class="text-2xl font-bold text-primary-700">{{ stats.borrowed }}</p>
            <p class="text-xs text-primary-400">正在借阅</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-cream-200 rounded-xl mx-auto mb-2">
              <History class="w-5 h-5 text-accent-brown" />
            </div>
            <p class="text-2xl font-bold text-primary-700">{{ stats.returned }}</p>
            <p class="text-xs text-primary-400">已归还</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-2" :class="stats.dueSoon > 0 ? 'bg-red-100' : 'bg-primary-100'">
              <AlertTriangle class="w-5 h-5" :class="stats.dueSoon > 0 ? 'text-accent-red' : 'text-primary-600'" />
            </div>
            <p class="text-2xl font-bold" :class="stats.dueSoon > 0 ? 'text-accent-red' : 'text-primary-700'">{{ stats.dueSoon }}</p>
            <p class="text-xs text-primary-400">即将到期</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-xl mx-auto mb-2">
              <User class="w-5 h-5 text-primary-600" />
            </div>
            <p class="text-2xl font-bold text-primary-700">{{ stats.total }}</p>
            <p class="text-xs text-primary-400">累计借阅</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="dueSoonBooks.length > 0" class="bg-red-50 border border-red-100 rounded-2xl p-6">
      <div class="flex items-center space-x-2 mb-4">
        <AlertTriangle class="w-5 h-5 text-accent-red" />
        <h2 class="text-lg font-serif font-bold text-accent-red">到期提醒</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="book in dueSoonBooks"
          :key="book.id"
          class="bg-white rounded-xl p-4 border-2 border-accent-red animate-pulse-soft"
        >
          <div class="flex items-start space-x-3">
            <img :src="book.cover" :alt="book.title" class="w-16 h-20 object-cover rounded-lg shadow-sm" />
            <div class="flex-1 min-w-0">
              <h3 class="font-serif font-semibold text-primary-800 line-clamp-1">{{ book.title }}</h3>
              <p class="text-sm text-primary-500 line-clamp-1">{{ book.author }}</p>
              <div class="mt-2 flex items-center space-x-1 text-sm" :class="getDueStatusClass(book.borrowRecord!.dueDate)">
                <Calendar class="w-4 h-4" />
                <span>{{ getDueStatusText(book.borrowRecord!.dueDate) }}</span>
              </div>
              <p class="text-xs text-primary-400 mt-1">
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
      <div v-else class="bg-white rounded-xl p-8 text-center">
        <Clock class="w-12 h-12 text-primary-300 mx-auto mb-3" />
        <p class="text-primary-500">暂无正在借阅的书籍</p>
      </div>
    </section>

    <section>
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-cream-200 rounded-xl flex items-center justify-center">
          <History class="w-5 h-5 text-accent-brown" />
        </div>
        <h2 class="section-title !mb-0 !border-0 !pb-0">借阅历史</h2>
        <span class="tag tag-available">{{ returnedBooks.length }} 本</span>
      </div>
      
      <div v-if="returnedBooks.length > 0" class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-cream-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">书籍</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider hidden md:table-cell">作者</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">借阅日期</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider hidden sm:table-cell">归还日期</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cream-100">
              <tr v-for="book in returnedBooks" :key="book.id" class="hover:bg-cream-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img :src="book.cover" :alt="book.title" class="w-10 h-14 object-cover rounded shadow-sm" />
                    <div>
                      <p class="font-medium text-primary-800 line-clamp-1">{{ book.title }}</p>
                      <p class="text-sm text-primary-400 md:hidden">{{ book.author }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-primary-600 hidden md:table-cell">{{ book.author }}</td>
                <td class="px-6 py-4 text-primary-600">{{ book.borrowRecord ? formatDate(book.borrowRecord.borrowDate) : '-' }}</td>
                <td class="px-6 py-4 text-primary-600 hidden sm:table-cell">{{ book.borrowRecord?.returnDate ? formatDate(book.borrowRecord.returnDate) : '-' }}</td>
                <td class="px-6 py-4">
                  <span class="tag tag-available">已归还</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="bg-white rounded-xl p-8 text-center">
        <History class="w-12 h-12 text-primary-300 mx-auto mb-3" />
        <p class="text-primary-500">暂无借阅历史</p>
      </div>
    </section>
  </div>
</template>
