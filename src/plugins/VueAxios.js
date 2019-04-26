import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.timeout = 5000// 在超时前，所有请求都会等待 5 秒
axios.defaults.baseURL = 'http://localhost:3333'// 配置接口地址
axios.defaults.withCredentials = false
Vue.use(VueAxios, axios)
