<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import resource from './api/resource.js'
  export default {
    created() {
      resource.getUserInfo().then(res => {
        if(res.data.code == 1){   //已登录
          this.$router.replace('/index');
          this.$store.commit('setUserInfo',res.data.data);
        }else if(res.data.code == 10000){   //登录已过期
          this.$router.replace('/login');
        }else{
          this.$toast(res.data.msg);
        }
      })
      
    },
    watch:{
      $route:function(n,o){
        document.title = n.name;
      }
    },
    methods: {

    }
  };
</script>
<style lang="less" scoped>

</style>