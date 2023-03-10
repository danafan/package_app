import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import './plugin.js'

new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')
