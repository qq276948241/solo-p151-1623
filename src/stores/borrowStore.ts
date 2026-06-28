import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Book, BorrowRecord, BookWithBorrow, User } from '../types';
import booksData from '../data/books.json';
import recordsData from '../data/borrowRecords.json';

export const useBorrowStore = defineStore('borrow', () => {
  const books = ref<Book[]>([...booksData] as Book[]);
  const borrowRecords = ref<BorrowRecord[]>([...recordsData] as BorrowRecord[]);
  const reservedBookIds = ref<string[]>([]);
  
  const currentUser = ref<User>({
    id: 'user-001',
    name: '小区居民',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Reader&backgroundColor=2D5A3D'
  });

  const availableBooks = computed(() => 
    books.value.filter(b => b.status === 'available' && !reservedBookIds.value.includes(b.id))
  );

  const borrowedBooks = computed(() => 
    books.value.filter(b => b.status === 'borrowed')
  );

  const myBorrowedBooks = computed((): BookWithBorrow[] => {
    const myRecords = borrowRecords.value.filter(
      r => r.userId === currentUser.value.id && r.status === 'borrowed'
    );
    return myRecords.map(record => {
      const book = books.value.find(b => b.id === record.bookId);
      return {
        ...book!,
        borrowRecord: record,
        isReserved: reservedBookIds.value.includes(book!.id)
      };
    }).sort((a, b) => {
      const dateA = new Date(a.borrowRecord!.dueDate).getTime();
      const dateB = new Date(b.borrowRecord!.dueDate).getTime();
      return dateA - dateB;
    });
  });

  const myReturnedBooks = computed((): BookWithBorrow[] => {
    const myRecords = borrowRecords.value.filter(
      r => r.userId === currentUser.value.id && r.status === 'returned'
    );
    return myRecords.map(record => {
      const book = books.value.find(b => b.id === record.bookId);
      return {
        ...book!,
        borrowRecord: record
      };
    }).sort((a, b) => {
      const dateA = new Date(a.borrowRecord!.returnDate!).getTime();
      const dateB = new Date(b.borrowRecord!.returnDate!).getTime();
      return dateB - dateA;
    });
  });

  const borrowStats = computed(() => {
    const borrowed = myBorrowedBooks.value.length;
    const returned = myReturnedBooks.value.length;
    const dueSoon = myBorrowedBooks.value.filter(b => {
      const due = new Date(b.borrowRecord!.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    }).length;
    return { borrowed, returned, dueSoon, total: borrowed + returned };
  });

  function reserveBook(bookId: string): boolean {
    if (reservedBookIds.value.includes(bookId)) {
      return false;
    }
    const book = books.value.find(b => b.id === bookId);
    if (!book || book.status !== 'available') {
      return false;
    }
    reservedBookIds.value.push(bookId);
    
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);
    
    const newRecord: BorrowRecord = {
      id: `record-${Date.now()}`,
      bookId,
      userId: currentUser.value.id,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'reserved'
    };
    borrowRecords.value.push(newRecord);
    return true;
  }

  function isBookReserved(bookId: string): boolean {
    return reservedBookIds.value.includes(bookId);
  }

  function getBookById(bookId: string): Book | undefined {
    return books.value.find(b => b.id === bookId);
  }

  return {
    books,
    borrowRecords,
    reservedBookIds,
    currentUser,
    availableBooks,
    borrowedBooks,
    myBorrowedBooks,
    myReturnedBooks,
    borrowStats,
    reserveBook,
    isBookReserved,
    getBookById
  };
});
