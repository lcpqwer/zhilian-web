import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

import './assets/lib/font_1558176_gx4e94es73q/iconfont.css'

Vue.config.productionTip = false

// 跳转后返回顶部
router.afterEach(() => {
  window.scrollTo(0,0);
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
