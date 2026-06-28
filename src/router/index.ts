import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BrowsePage from '@/pages/BrowsePage.vue'
import MyPage from '@/pages/MyPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: '首页' }
  },
  {
    path: '/browse',
    name: 'browse',
    component: BrowsePage,
    meta: { title: '选书' }
  },
  {
    path: '/my',
    name: 'my',
    component: MyPage,
    meta: { title: '我的' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '小区图书角'} - 小区图书角`
  next()
})

export default router
