import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { parseTime, resetForm } from '@/utils/common'
import Pagination from '@/components/Pagination'
import request from '@/utils/request'
import './assets/styles/index.scss'
import plugins from '@/plugins'
// 头部标签插件
import VueMeta from 'vue-meta'
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'
ElementUI.Dialog.props.closeOnClickModal.default = false

Vue.config.productionTip = false
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.$axios = request

Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(ElementUI, {
  size: localStorage.getItem('size') || 'medium' // set element-ui default size
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
