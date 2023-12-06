import { createRouter, createWebHashHistory, RouteRecordRaw ,createMemoryHistory} from 'vue-router'
const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../views/master.vue') },
  { path: '/slave', component: () => import('../views/slave.vue') },
]
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
export default router
