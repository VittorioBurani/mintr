import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/marketplace',
      name: 'marketplace-view',
      component: () => import('@/views/MarketplaceView.vue')
    },
    {
      path: '/owned',
      name: 'owned-view',
      component: () => import('@/views/OwnedView.vue')
    },
    {
      path: '/mint',
      name: 'mint-view',
      component: () => import('@/views/MintView.vue')
    }
  ]
})

export default router
