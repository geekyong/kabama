import Vue from 'vue'
import './plugins/VueHighlight'

import './plugins/vuetify'
import './plugins/p5.component'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
