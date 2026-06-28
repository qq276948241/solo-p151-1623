<script setup lang="ts">
import { computed } from 'vue'
import type { Book, BookWithBorrow } from '@/types'
import { getStatusText, getStatusClass, isDueSoon, formatDate, getDaysUntilDue } from '@/utils/date'
import { MapPin, Calendar, AlertCircle } from 'lucide-vue-next'

interface Props {
  book: Book | BookWithBorrow
  showDueDate?: boolean
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  showDueDate: false
})

const emit = defineEmits<{
  click: []
}>()

const borrowRecord = computed(() => {
  return 'borrowRecord' in props.book ? props.book.borrowRecord : undefined
})

const isReserved = computed(() => {
  return 'isReserved' in props.book ? props.book.isReserved : false
})

const showDueSoonWarning = computed(() => {
  if (!props.showDueDate || !borrowRecord.value) return false
  return isDueSoon(borrowRecord.value.dueDate)
})

const daysUntilDue = computed(() => {
  if (!borrowRecord.value) return null
  return getDaysUntilDue(borrowRecord.value.dueDate)
})

const displayStatus = computed(() => {
  if (isReserved.value) return '已预约'
  return getStatusText(props.book.status)
})

const displayStatusClass = computed(() => {
  if (isReserved.value) return 'tag-borrowed'
  return getStatusClass(props.book.status)
})

function handleClick() {
  emit('click')
  if (props.onClick) props.onClick()
}
</script>

<template>
  <div
    class="book-card relative group"
    :class="{ 'card-due-soon': showDueSoonWarning }"
    v-tooltip="book.description"
    @click="handleClick"
  >
    <div class="aspect-[3/4] relative overflow-hidden bg-cream-200">
      <img
        :src="book.cover"
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div
        class="absolute top-3 right-3 z-10"
      >
        <span class="tag" :class="displayStatusClass">
          {{ displayStatus }}
        </span>
      </div>

      <div
        v-if="showDueDate && borrowRecord"
        class="absolute top-3 left-3 z-10"
      >
        <span
          class="tag flex items-center space-x-1"
          :class="showDueSoonWarning ? 'tag-due-soon' : 'tag-borrowed'"
        >
          <Calendar class="w-3 h-3" />
          <span v-if="daysUntilDue !== null && daysUntilDue >= 0">
            还剩 {{ daysUntilDue }} 天
          </span>
          <span v-else class="text-accent-red">
            已逾期
          </span>
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-serif font-semibold text-primary-800 text-base mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
        {{ book.title }}
      </h3>
      <p class="text-sm text-primary-500 mb-2 line-clamp-1">
        {{ book.author }}
      </p>
      
      <div class="flex items-center text-xs text-primary-400 space-x-3">
        <span v-if="showDueDate && borrowRecord" class="flex items-center space-x-1">
          <Calendar class="w-3 h-3" />
          <span>{{ formatDate(borrowRecord.dueDate) }}</span>
        </span>
        <span v-else class="flex items-center space-x-1">
          <MapPin class="w-3 h-3" />
          <span>{{ book.location }}</span>
        </span>
      </div>

      <div
        v-if="showDueSoonWarning"
        class="mt-3 flex items-center text-xs text-accent-red bg-red-50 px-2 py-1.5 rounded-lg"
      >
        <AlertCircle class="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>请尽快归还，避免逾期</span>
      </div>
    </div>
  </div>
</template>
