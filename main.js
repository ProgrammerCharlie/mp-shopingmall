import Vue from 'vue'
import App from './App'

// 发网络请求的api
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = "https://api-hmugo-web.itheima.net"

// 挂载拦截器
$http.beforeRequest = function(opitons){
	uni.showLoading({
		title:"数据响应中"
	})
}
$http.afterRequest = function(options){
	uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()