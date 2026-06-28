export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  categoryId: string;
  location: string;
  borrowCount: number;
  status: 'available' | 'borrowed';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'reserved';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export type SortType = 'borrowCount' | 'title' | 'newest';

export type BookWithBorrow = Book & {
  borrowRecord?: BorrowRecord;
  isReserved?: boolean;
};
