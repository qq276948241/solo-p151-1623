## 1. 架构设计

```mermaid
graph TD
    A["前端应用（Vue 3）"] --> B["路由层（Vue Router）"]
    A --> C["状态管理（Pinia）"]
    A --> D["组件层"]
    D --> D1["页面组件"]
    D --> D2["通用组件"]
    A --> E["数据层（Mock JSON）"]
    E --> E1["books.json"]
    E --> E2["categories.json"]
    E --> E3["borrowRecords.json"]
    A --> F["工具层"]
    F --> F1["日期处理"]
    F --> F2["格式化工具"]
```

## 2. 技术描述

- **前端框架**：Vue 3 + TypeScript + Vite
- **路由**：Vue Router 4
- **状态管理**：Pinia
- **样式方案**：Tailwind CSS 3
- **字体**：思源宋体、思源黑体（Google Fonts）
- **数据**：本地 JSON 模拟数据，分模块存储
- **包管理器**：npm

## 3. 路由定义

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 首页书架，展示在借/可借分区 |
| `/browse` | BrowsePage | 选书页，分类筛选和排序 |
| `/browse/:id` | BookDetailPage | 图书详情页（可选，或弹窗形式） |
| `/my` | MyPage | 我的页面，借阅记录和到期提醒 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    BOOK {
        string id "图书ID"
        string title "书名"
        string author "作者"
        string cover "封面图片URL"
        string description "简介"
        string categoryId "分类ID"
        string location "馆藏位置"
        number borrowCount "借阅次数"
        string status "available/borrowed"
    }
    
    CATEGORY {
        string id "分类ID"
        string name "分类名称"
        string icon "图标标识"
    }
    
    BORROW_RECORD {
        string id "记录ID"
        string bookId "图书ID"
        string userId "用户ID"
        string borrowDate "借阅日期"
        string dueDate "到期日期"
        string returnDate "归还日期"
        string status "borrowed/returned/reserved"
    }
    
    CATEGORY ||--o{ BOOK : "包含"
    BOOK ||--o{ BORROW_RECORD : "借阅记录"
```

### 4.2 类型定义

```typescript
// Book - 图书
interface Book {
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

// Category - 分类
interface Category {
  id: string;
  name: string;
  icon: string;
}

// BorrowRecord - 借阅记录
interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'reserved';
}
```

## 5. 项目目录结构

```
src/
├── assets/           # 静态资源（图片、字体）
├── components/       # 通用组件
│   ├── BookCard.vue
│   ├── NavBar.vue
│   └── BookDetailModal.vue
├── composables/      # 组合式函数
│   └── useBorrow.ts
├── data/             # 模拟数据
│   ├── books.json
│   ├── categories.json
│   └── borrowRecords.json
├── pages/            # 页面组件
│   ├── HomePage.vue
│   ├── BrowsePage.vue
│   └── MyPage.vue
├── router/           # 路由配置
│   └── index.ts
├── stores/           # Pinia 状态管理
│   └── borrowStore.ts
├── types/            # TypeScript 类型定义
│   └── index.ts
├── utils/            # 工具函数
│   └── date.ts
├── App.vue
├── main.ts
└── style.css         # 全局样式和 Tailwind 配置
```
