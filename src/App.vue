<template>
  <div id="app">
    <router-view></router-view>
    <van-overlay :show="is_loading">
      <div class="wrapper">
        <van-loading type="spinner" color="#1989fa" />
      </div>
    </van-overlay>
  </div>
</template>
<script>
  // import * as dd from 'dingtalk-jsapi';
  export default {
    computed:{
      //加载中
      is_loading(){
        return this.$store.state.is_loading;
      }
    },
    created() {
      this.$router.replace('/package_page');
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
.wrapper{
 display: flex;
 align-items: center;
 justify-content: center;
 height: 100%;
}
</style>