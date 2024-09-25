import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/tenant',
    name: 'tenant',
    component: () => import(/* webpackChunkName: "about" */ '../views/ccb/tenantManager/index.vue')
  },
  {
    path: '/input',
    name: 'input',
    component: () => import(/* webpackChunkName: "about" */ '../views/ccb/inputManager/index.vue')
  },
  {
    path: '/market',
    name: 'market',
    component: () => import(/* webpackChunkName: "about" */ '@/views/ccb/marketManager/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_APP_NAME ? process.env.VUE_APP_APP_NAME : '/',
  routes
})

export default router
