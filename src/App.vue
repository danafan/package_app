<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
  </div>
</template>
<script>
  import resource from './api/resource.js'
  export default {
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
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
    methods:{
      //单独页面刷新
      reload () {
        this.isRouterAlive = false
        this.$nextTick( () => {
          this.isRouterAlive = true
        })
      }
    }
  };
</script>
<style lang="less" scoped>

</style>