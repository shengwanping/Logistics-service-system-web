/***********
 * vue、element、mainRoutes.js（路由）的引入
 * 简单的说，在vue中我们使用模板HTML语法组建页面的，使用render函数我们可以用js语言来构建DOM因为vue是虚拟DOM，所以在拿到template模板时也要转译成VNode的函数，而用render函数构建DOM，vue就免去了转译的过程。当使用render函数描述虚拟DOM时，vue提供一个函数，这个函数是就构建虚拟DOM所需要的工具。官网上给他起了个名字叫createElement。还有约定的简写叫h,vm中有一个方法_c,也是这个函数的别名
 ***********/
import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/mainRoutes.js'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(Element)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
/**************
 * axios引入及跨域处理
 ***************/
import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'  //这里的/api指的是vue.config.js里面的'http://localhost:8080'
Vue.config.productionTip = false
Vue.use(VueAxios,axios);


