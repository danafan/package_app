<template>
	<div class="pl-12 pr-12">
		<header-bar title="打包系统" :is_back="false"/>
		<div class="page_top flex ac jsb">
			<div class="f16 fw-500 text-overflow">杭州电子商务有限公司（{{userInfo.user_name}}）</div>
			<div class="quit f12 white_color" @click="quit">退出</div>
		</div>
		<div class="menu_item width-100 flex ac jsb pl-10 pr-20 mb-15" @click="$router.push('/package_page')">
			<div class="flex ac">
				<img class="menu_icon mr-15" src="../static/package_icon.png">
				<div class="f16 fw-500">打包</div>
			</div>
			<img class="r_arrow" src="../static/r_arrow.png">
		</div>
		<div class="menu_item width-100 flex ac jsb pl-10 pr-20" @click="$router.push('/package_all')">
			<div class="flex ac">
				<img class="menu_icon mr-15" src="../static/all_package.png">
				<div class="f16 fw-500">批量打包</div>
			</div>
			<img class="r_arrow" src="../static/r_arrow.png">
		</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'

	import HeaderBar from '../components/header_bar.vue'
	export default{
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		created(){
			BSL.Vibrator();
			this.$store.commit('setIsBsl',true);
		},
		methods:{
			quit(){
				this.$dialog.confirm({
					title:'提示',
					message: '确认退出？',
				}).then(() => {
					resource.quit().then(res => {
						if(res.data.code == 1){
							this.$toast(res.data.msg);
							this.$router.replace('/login');
						}else{
							this.$toast(res.data.msg);
						}
					})
				}).catch(() => {
					this.$toast('取消退出！');
				});
			}
		},
		components:{
			HeaderBar
		}
	}
</script>
<style lang="less">
.page_top{
	height: 62px;
	.quit{
		border-radius: 10px;
		background-color: rgba(0,137,255,0.5);
		width: 44px;
		text-align: center;
		height: 20px;
		line-height: 20px;
	}
}
.menu_item{
	height: 78px;
	background: #FFFFFF;
	box-shadow: 0px 0px 8px 2px #F2F7FF;
	border-radius: 8px;
	.menu_icon{
		width: 39px;
		height: 39px;
	}
	.r_arrow{
		width: 10px;
		height: 18px;
	}
}
</style>
