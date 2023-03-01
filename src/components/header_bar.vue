<template>
	<div class="header_bar white_back relative flex ac jc">
		<img class="goback_icon absolute" src="../static/goback_icon.png" v-if="is_back" @click="$router.go(-1)">
		<div class="f16 fw-500">{{title}}</div>
	</div>
</template>
<script>
	export default{
		props:{
			//标题
			title:{
				type:String,
				default:""
			},
			//是否有返回按钮
			is_back:{
				type:Boolean,
				default:true
			}
		}
		
	}
</script>
<style lang="less" scoped>
.header_bar{
	height: 46px;
	.goback_icon{
		left: 18px;
		top: 50%;
		transform: translate(0,-50%);
		width: 10px;
		height: 18px;
	}
}
</style>