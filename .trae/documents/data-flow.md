# 数据流手册

本文档描述数据从 `src/data/` 下的静态 JSON 文件一路流到页面组件的完整链路，包括每个 JSON 文件的角色、Pinia store 的加工逻辑、composable 的筛选管道、以及组件之间的 props/emit 通信。

---

## 1. 三个 JSON 数据源

| 文件 | 路径 | 类型定义 | 角色 |
|---|---|---|---|
| [books.json](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/data/books.json) | `src/data/books.json` | `Book[]` | 图书主表，每条记录代表一本书的静态属性（标题、作者、封面、简介、分类 ID、馆藏位置、借阅次数、当前状态） |
| [borrowRecords.json](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/data/borrowRecords.json) | `src/data/borrowRecords.json` | `BorrowRecord[]` | 借阅流水表，每条记录是一次借阅行为（谁借的、哪本书、借出日期、到期日期、归还日期、状态） |
| [categories.json](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/data/categories.json) | `src/data/categories.json` | `Category[]` | 分类字典表，6 个分类（文学小说、科技编程、历史人文、生活艺术、儿童读物、经济管理），提供分类名和图标名 |

**为什么分三个文件**：books 是核心实体，borrowRecords 是行为流水（会随用户操作增长），categories 是静态字典。拆开后每个文件职责单一，未来接后端 API 时可以独立替换。

---

## 2. JSON → Pinia Store：数据进口

```
books.json ──────────┐
                     ▼
borrowRecords.json ──→ borrowStore.ts (Pinia)
```

[borrowStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/stores/borrowStore.ts) 是唯一 import 两个数据文件的地方：

```ts
import booksData from '../data/books.json';
import recordsData from '../data/borrowRecords.json';
```

进入 store 后：

- `books` → `ref<Book[]>([...booksData])` — 用展开运算符拷贝，保证原 JSON 不可变
- `borrowRecords` → `ref<BorrowRecord[]>([...recordsData])` — 同理
- `reservedBookIds` → `ref<string[]>([])` — 纯前端状态，记录哪些书被当前用户点了"预约"
- `currentUser` → 硬编码 `user-001`，模拟已登录用户

> **categories.json 不进 store**：分类数据是只读字典，直接由需要的组件 import。目前只有 BrowsePage 和 BookDetailModal 两处使用。

---

## 3. Store 内部的 computed 加工链

Store 通过一系列 `computed` 把原始数据加工成页面可以直接消费的形态：

### 3.1 availableBooks

```
books ─── filter(status === 'available' && !reserved) ──→ availableBooks
```

- 过滤条件：`status === 'available'` **且** 不在 `reservedBookIds` 中
- 用途：HomePage 的"可借书籍"区块、BrowsePage 的全量数据源

**为什么排除 reserved**：用户点击"预约"后书还是 available 状态（因为还没真正借出），但前端需要把它从可借列表中隐藏，避免重复预约。

### 3.2 borrowedBooks

```
books ─── filter(status === 'borrowed') ──→ borrowedBooks
```

- 用途：HomePage 的"正在借阅"区块

### 3.3 myBorrowedBooks

```
borrowRecords ─── filter(userId === 'user-001' && status === 'borrowed')
       │
       ▼ join on bookId
books ─── find by id ──→ { ...book, borrowRecord, isReserved }
       │
       ▼ sort by dueDate asc
myBorrowedBooks: BookWithBorrow[]
```

这是最复杂的一条链路：

1. 从 `borrowRecords` 中筛出当前用户、状态为 `borrowed` 的记录
2. 对每条 record，去 `books` 中 find 对应的书
3. 把 book 展开后拼上 `borrowRecord` 和 `isReserved` 两个衍生字段，形成 `BookWithBorrow` 类型
4. 按到期日升序排列（最急迫的排最前面）

**用途**：MyPage 的"正在借阅"卡片列表、以及计算"到期提醒"的基础数据。

### 3.4 myReturnedBooks

逻辑与 `myBorrowedBooks` 对称，只是筛选 `status === 'returned'`，并按归还日期降序排。

**用途**：MyPage 底部的借阅历史表格。

### 3.5 borrowStats

```
myBorrowedBooks ──→ borrowed (length)
myReturnedBooks ──→ returned (length)
myBorrowedBooks ──→ filter(isDueSoon) ──→ dueSoon
                          ──→ total (borrowed + returned)
```

四个数字：

| 字段 | 含义 | 使用者 |
|---|---|---|
| `borrowed` | 当前在借数量 | MyPage 用户统计卡片 |
| `returned` | 已归还数量 | MyPage 用户统计卡片 |
| `dueSoon` | 三天内到期数量 | MyPage 统计卡片 + NavBar 角标 |
| `total` | 累计借阅 | MyPage 统计卡片 |

---

## 4. 三天内到期阈值：isDueSoon 的计算逻辑

[borrowStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/stores/borrowStore.ts) 和 [date.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/utils/date.ts) 都有相关逻辑：

```
dueDate (string, e.g. "2026-06-29")
    │
    ▼ new Date(dueDate) → setHours(0,0,0,0)
    │
    ▼ today = new Date() → setHours(0,0,0,0)
    │
    ▼ diff = Math.ceil((due - today) / (1000*60*60*24))
    │
    ▼ isDueSoon = (diff >= 0 && diff <= 3)
```

关键细节：

- **日期归零**：`setHours(0,0,0,0)` 确保只比较天粒度，不受时分秒影响
- **Math.ceil**：哪怕今天 23:59 到明天 00:01 也算 1 天，而不是 0.001 天
- **diff >= 0**：已逾期的书不算"即将到期"（逾期有独立的 `isOverdue` 判断）
- **阈值 3**：`isDueSoon(dueDateStr, days = 3)` 默认参数，可配置

**为什么 diff >= 0 而不是 diff > 0**：到期当天（diff = 0）属于"今天到期"，是最紧急的情况，必须纳入提醒。

---

## 5. Store → 页面：各页面的数据消费方式

### 5.1 HomePage

```
borrowStore
    ├── .borrowedBooks ────→ "正在借阅"卡片列表
    └── .availableBooks ────→ .slice(0, 8) ──→ "可借书籍"卡片列表
```

HomePage 最简单，直接消费 store 的两个 computed：

- `borrowedBooks`：全部在借书籍，直接展示
- `availableBooks.slice(0, 8)`：只取前 8 本，"查看更多"跳转 BrowsePage

**为什么不自己排序**：store 的 `availableBooks` 没有排序保证（取决于 books.json 原始顺序），但首页只需要展示"有哪些可借"，不需要排序语义。

### 5.2 BrowsePage

```
borrowStore.books (toRef)
    │
    ▼ useBookFilter(booksRef)
    │   ├── selectedCategory ────→ 分类过滤
    │   ├── searchQuery ─────────→ 关键词过滤（书名 / 作者）
    │   └── sortBy ──────────────→ 排序（借阅次数 / 书名 / 最新）
    │
    ▼ filteredBooks (computed)
    │
    ▼ v-for → BookCard
```

BrowsePage 通过 `toRef(store, 'books')` 把 store 的 books 变成响应式引用，传给 [useBookFilter](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/composables/useBookFilter.ts) composable。三级管道：

1. **分类过滤**：`categoryId === selectedCategory`（'all' 时不过滤）
2. **关键词过滤**：`title.includes(query) || author.includes(query)`（大小写不敏感）
3. **排序**：`borrowCount` 降序 / `title` 中文拼音序 / `newest`（当前未实现特殊逻辑）

**为什么用 toRef 而不是直接传 books.value**：`useBookFilter` 内部用 `computed(() => Array.isArray(books) ? books : books.value)` 读取源数据，传 Ref 才能保持响应性——当 store.books 变化时（比如预约新书后 borrowRecords 增长），filteredBooks 会自动重算。

### 5.3 MyPage

```
borrowStore
    ├── .currentUser ────────────→ 用户信息（头像 + 名字）
    ├── .borrowStats ────────────→ 四格统计数字
    ├── .myBorrowedBooks ────────┬→ "正在借阅"卡片（传 showDueDate=true）
    │                            └→ .filter(isDueSoon) ──→ "到期提醒"专属区块
    └── .myReturnedBooks ────────→ 借阅历史表格
```

MyPage 的数据消费最密集：

- `borrowStats.dueSoon` → 决定 NavBar 角标数字、用户统计卡片"即将到期"的数字和配色
- `dueSoonBooks` → 单独 computed，从 `myBorrowedBooks` 中再 filter `isDueSoon`，生成"到期提醒"区块
- `myBorrowedBooks` → 传给 BookCard 时带 `:show-due-date="true"`，让卡片显示到期倒计时
- `myReturnedBooks` → 遍历渲染表格行

---

## 6. 组件通信：Props 与 Emit 流向

```
App.vue
  ├── NavBar.vue
  │     props: (none)
  │     读 store: borrowStats.dueSoon → 角标
  │     读 useTheme: isDark, toggleTheme → 主题切换按钮
  │
  └── <router-view>
        ├── HomePage.vue
        │     读 store: borrowedBooks, availableBooks
        │     local state: selectedBook, showModal
        │     │
        │     ├── BookCard × N
        │     │     props: book (Book | BookWithBorrow), showDueDate? (boolean)
        │     │     emit: click → HomePage.handleBookClick
        │     │     directive: v-tooltip="book.description"
        │     │
        │     └── BookDetailModal
        │           props: book (Book | null), visible (boolean)
        │           emit: close → HomePage.handleCloseModal
        │           读 store: isBookReserved(), reserveBook()
        │
        ├── BrowsePage.vue
        │     读 store: books (via toRef → useBookFilter)
        │     读 data: categories.json (直接 import)
        │     local state: selectedBook, showModal
        │     composable: useBookFilter → searchQuery, selectedCategory, sortBy, filteredBooks
        │     │
        │     ├── BookCard × N (同上)
        │     └── BookDetailModal (同上)
        │
        └── MyPage.vue
              读 store: currentUser, borrowStats, myBorrowedBooks, myReturnedBooks
              读 utils: isDueSoon, getDaysUntilDue, formatDate
              │
              └── BookCard × N
                    props: book (BookWithBorrow), showDueDate=true
                    emit: click (MyPage 未监听，卡片不可点进详情)
```

### Props 说明

| 组件 | Prop | 类型 | 语义 | 谁传的 |
|---|---|---|---|---|
| BookCard | `book` | `Book \| BookWithBorrow` | 一本书的完整数据 | HomePage / BrowsePage / MyPage |
| BookCard | `showDueDate` | `boolean` (默认 false) | 是否显示到期信息 | 仅 MyPage 传 true |
| BookDetailModal | `book` | `Book \| null` | 当前选中查看详情的书 | HomePage / BrowsePage |
| BookDetailModal | `visible` | `boolean` | 弹窗是否显示 | HomePage / BrowsePage |

### Emit 说明

| 组件 | Event | Payload | 谁监听 | 做什么 |
|---|---|---|---|---|
| BookCard | `click` | 无 | HomePage / BrowsePage | 设 selectedBook + 打开 modal |
| BookDetailModal | `close` | 无 | HomePage / BrowsePage | 关闭 modal，300ms 后清 selectedBook |

### BookCard 内部的衍生计算

BookCard 拿到 `book` prop 后，在组件内部还会做几层计算：

```
book prop
  ├── 'borrowRecord' in book? ──→ borrowRecord (computed)
  ├── 'isReserved' in book? ────→ isReserved (computed)
  ├── isDueSoon(borrowRecord.dueDate) ──→ showDueSoonWarning (computed)
  ├── getDaysUntilDue(borrowRecord.dueDate) ──→ daysUntilDue (computed)
  ├── getStatusText(book.status) ──→ displayStatus (computed)
  └── getStatusClass(book.status) ──→ displayStatusClass (computed)
```

这些计算驱动卡片的视觉状态：标签文案、标签颜色、是否显示红色警告条、是否加 `card-due-soon` 红框动画。

---

## 7. 写操作：reserveBook 的数据回流

用户在 BookDetailModal 点"立即借阅预约"时：

```
BookDetailModal.handleReserve()
    │
    ▼ store.reserveBook(bookId)
    │   ├── 检查 reservedBookIds 是否已包含 → 防重复
    │   ├── 检查 book.status === 'available' → 防借出书再预约
    │   ├── reservedBookIds.push(bookId) → 从可借列表移除
    │   └── borrowRecords.push(newRecord) → 新增一条 status='reserved' 的记录
    │
    ▼ 响应式触发
        ├── availableBooks 重算（排除该 bookId）
        ├── isBookReserved(bookId) → true → 按钮变灰"已加入预约"
        └── borrowStats.total +1
```

**为什么改 reservedBookIds 而不是改 book.status**：预约是前端临时状态，书还没真正借出。保持 `book.status = 'available'` 不变，通过 `reservedBookIds` 旁路标记，方便未来清空预约状态。

---

## 8. categories.json 的两条消费路径

```
categories.json
    │
    ├── BrowsePage.vue (直接 import)
    │     └── v-for 渲染分类按钮组
    │
    └── BookDetailModal.vue (直接 import)
          └── categoriesData.find(c => c.id === book.categoryId)
                → 显示分类名称
```

categories 不进 store 的原因：它是纯只读字典，没有任何写操作，也不参与计算。直接 import 更轻量，避免 store 膨胀。

---

## 9. 完整数据流总览图

```
┌─────────────────────────────────────────────────────────────────┐
│                        src/data/                                 │
│   books.json    borrowRecords.json    categories.json            │
│       │                │                    │                    │
└───────┼────────────────┼────────────────────┼────────────────────┘
        │                │                    │
        ▼                ▼                    │ direct import
┌───────────────────────────────────┐         │
│        borrowStore (Pinia)         │         │
│  books ◄──── booksData            │         │
│  borrowRecords ◄── recordsData    │         │
│  reservedBookIds ◄── []           │         │
│  currentUser ◄── hardcode         │         │
│                                   │         │
│  computed:                        │         │
│  ├─ availableBooks                │         │
│  ├─ borrowedBooks                 │         │
│  ├─ myBorrowedBooks (join+sort)   │         │
│  ├─ myReturnedBooks (join+sort)   │         │
│  └─ borrowStats                   │         │
└───────────┬───────────────────────┘         │
            │                                  │
     ┌──────┴──────────────┬───────────────────┤
     │                     │                   │
     ▼                     ▼                   ▼
 HomePage             BrowsePage          BookDetailModal
 ├─ borrowedBooks     ├─ toRef(store,books)  └─ find category
 ├─ availableBooks    │       │
 └─ [selectedBook]    ▼       │
     │             useBookFilter
     │             ├─ selectedCategory
     │             ├─ searchQuery
     │             ├─ sortBy
     │             └─ filteredBooks
     │                    │
     ▼                    ▼
  BookCard ←───────────────────── categories.json (BrowsePage 渲染按钮)
     │
     ├─ props: book, showDueDate
     ├─ emit: click → open modal
     └─ v-tooltip → directives/tooltip.ts

  MyPage
  ├─ currentUser
  ├─ borrowStats ──→ NavBar 角标
  ├─ myBorrowedBooks ──→ BookCard(showDueDate=true)
  ├─ dueSoonBooks ──→ 到期提醒区块
  └─ myReturnedBooks ──→ 历史表格
```
