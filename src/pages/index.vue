<template>
	<div class="pl-12 pr-12">
		<div class="page_top flex ac jsb">
			<div class="f16 fw-500 text-overflow">杭州电子商务有限公司（彪子）</div>
			<div class="quit f12 white_color">退出</div>
		</div>
		<div class="menu_item width-100 flex ac jsb pl-10 pr-20 mb-15" @click="$router.push('/package_page')">
			<div class="flex ac">
				<img class="menu_icon mr-15" src="../static/package_icon.png">
				<div class="f16 fw-500">打包</div>
			</div>
			<img class="r_arrow" src="../static/r_arrow.png">
		</div>
		<div class="menu_item width-100 flex ac jsb pl-10 pr-20">
			<div class="flex ac">
				<img class="menu_icon mr-15" src="../static/all_package.png">
				<div class="f16 fw-500">批量打包</div>
			</div>
			<img class="r_arrow" src="../static/r_arrow.png">
		</div>
	</div>
</template>
<script>
	export default{
		
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
