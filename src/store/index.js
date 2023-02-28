import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    //加载中
    is_loading:false,       
    //打印机
    printer:null,
  },
  mutations: {
    //设置加载状态
    setLoading(state, bool) {  
      state.is_loading = bool;
    },
    //设置打印机
    setPrinter(state, id) {  
      state.printer = id;
    },
  },
  actions: {
    
  }

})
export default store;

