import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {      
    is_bsl:false,
    //用户信息
    userInfo:{},
    //打印机
    printer:null,
  },
  mutations: {
    //设置用户信息
    setIsBsl(state, bool) {  
      state.is_bsl = bool;
    },
    //设置用户信息
    setUserInfo(state, info) {  
      state.userInfo = info;
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

