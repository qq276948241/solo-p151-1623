import { ref, computed, type Ref } from 'vue'
import type { Book, SortType } from '@/types'

export interface UseBookFilterReturn {
  searchQuery: Ref<string>
  selectedCategory: Ref<string>
  sortBy: Ref<SortType>
  filteredBooks: Ref<Book[]>
  sortOptions: { value: SortType; label: string }[]
  clearSearch: () => void
  setCategory: (categoryId: string) => void
  setSortBy: (sort: SortType) => void
  resetFilters: () => void
}

export function useBookFilter(books: Ref<Book[]> | Book[]): UseBookFilterReturn {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('all')
  const sortBy = ref<SortType>('borrowCount')

  const sortOptions = [
    { value: 'borrowCount' as SortType, label: '借阅次数' },
    { value: 'title' as SortType, label: '书名' },
    { value: 'newest' as SortType, label: '最新上架' }
  ]

  const sourceBooks = computed(() => 
    Array.isArray(books) ? books : books.value
  )

  const filteredBooks = computed(() => {
    let result = [...sourceBooks.value]

    if (selectedCategory.value !== 'all') {
      result = result.filter(b => b.categoryId === selectedCategory.value)
    }

    const trimmedQuery = searchQuery.value.trim()
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase()
      result = result.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
      )
    }

    if (sortBy.value === 'borrowCount') {
      result.sort((a, b) => b.borrowCount - a.borrowCount)
    } else if (sortBy.value === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
    }

    return result
  })

  function clearSearch() {
    searchQuery.value = ''
  }

  function setCategory(categoryId: string) {
    selectedCategory.value = categoryId
  }

  function setSortBy(sort: SortType) {
    sortBy.value = sort
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    sortBy.value = 'borrowCount'
  }

  return {
    searchQuery,
    selectedCategory,
    sortBy,
    filteredBooks,
    sortOptions,
    clearSearch,
    setCategory,
    setSortBy,
    resetFilters
  }
}
