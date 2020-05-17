import Vue from 'vue'

import Cookies from 'js-cookie'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './style/element-variables.scss'

import '@/style/index.scss' // global css

import App from './App.vue'
import store from './store'
import router from './router'

import './icon' // icon
import './permission' //permission control

import * as filters from './filter' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
