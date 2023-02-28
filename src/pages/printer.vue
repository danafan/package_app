<template>
	<div class="container flex fc">
		<div class="top_toast flex ac jc f16 fw-500">您可以选择指定的打印机！</div>
		<div class="flex-1 scroll-y" v-if="printer_list.length > 0">
			<div class="printer_item white_back flex ac jsb pl-20 pr-15" v-for="(item,index) in printer_list" @click="changePrinter(index)">
				<div class="f16">{{item}}</div>
				<img class="radio_icon" src="../static/radio_active.png" v-if="active_index == index">
				<img class="radio_icon" src="../static/radio_icon.png" v-else>
			</div>
		</div>
		<div class="flex-1 flex fc ac jc" v-else>当前没有打印机在线</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js' 
	export default{
		data(){
			return{
				printer_list:[],			//打印机列表
				active_index:-1,			//当前选中的打印机下标
			}
		},
		created(){
			//获取所有打印机
			this.printerList();
		},
		methods:{
			//获取所有打印机
			printerList(){
				resource.printerList().then(res => {
					var data = res.data;
					if (!data) {
						this.printer_list = res;
					} else {
						this.printer_list = data;
					}
				})
			},
			//切换打印机
			changePrinter(index){
				this.active_index = index;
				this.$dialog.confirm({
					title:'提示',
					message: `确认选择【${this.printer_list[index]}】？`,
				}).then(() => {
					this.$store.commit('setPrinter',this.printer_list[index]);
					this.$router.go(-1);
				}).catch(() => {
					this.$toast('请重新选择');
				});
			}
		}
	}
</script>
<style lang="less" scoped>
.top_toast{
	height: 40px;
}
.printer_item{
	margin-bottom: 2px;
	height: 55px;
	.radio_icon{
		width: 20px;
		height: 20px;
	}
}
</style>