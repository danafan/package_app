<template>
	<div class="container flex fc">
		<div class="top_input flex ac pl-12 pr-12 mb-6">
			<div class="flex-1 flex ac code_input pl-22 pr-22">
				<input ref="codeInput" class="width-100 f12" placeholder="请输入唯一码" @keyup.enter="keyupEnter" v-model="code">
			</div>
			<img class="scan_icon ml-12" src="../static/scan_icon.png">
		</div>
		<div class="flex-1 flex fc">
			<div class="white_back pt-10 pl-20 pb-10 f16 fw-500">商品列表</div>
			<div class="flex-1 scroll-y">
				<div class="white_back flex ac jsb pt-10 pl-20 pb-10 pr-20" v-for="item in goodsList">
					<div class="f14">{{item.sku_id}}</div>
					<div class="flex ac dark_color">{{item.num}}件</div>
				</div>
			</div>
		</div>
		<div class="bottom_content width-100 flex ac jsb pl-20 pr-10">
			<div class="black_color f14">共6件商品</div>
			<div class="flex">
				<div class="botton f14 reset mr-8" @click="resetFn">重置</div>
				<div class="botton f14 over white_color" @click="overPackage">完成打包</div>
			</div>
		</div>
		<!-- 确认包裹信息弹窗 -->
		<van-dialog v-model:show="package_info_dialog" :show-confirm-button="false">
			<div class="relative flex ac jc pt-20 pb-20 f15 fw-600">
				<div>确认包裹信息</div>
				<img class="close_icon absolute" src="../static/close_icon.png">
			</div>
			<div class="pl-15 pr-15">
				<div class="flex ac f14 mb-15">
					<div>供应商：</div>
					<div class="flex ac" @click="actionSheet('1')" v-if="supplier_id == ''">
						<div>请选择</div>
						<img class="r_arrow" src="../static/r_arrow.png">
					</div>
					<div v-else @click="actionSheet('1')">{{supplier_name}}</div>
				</div>
				<div class="flex ac f14 mb-15">
					<div>仓库：</div>
					<div class="flex ac" @click="actionSheet('2')" v-if="wms_id == ''">
						<div>请选择</div>
						<img class="r_arrow" src="../static/r_arrow.png">
					</div>
					<div v-else @click="actionSheet('2')">{{wms_name}}</div>
				</div>
				<div class="flex ac f14 mb-15">包裹号码：{{packageObj.packageId}}</div>
				<div class="flex ac f14 mb-15">商品件数：{{packageObj.goodsNum}}</div>
				<div class="flex ac f14 mb-15">打包日期：{{packageObj.time}}</div>
				<div class="flex ac f14 mb-15">打包人：{{packageObj.operator}}</div>
				<div class="flex f14 mb-15">
					<div>备注：</div>
					<textarea class="remark flex-1" :rows="3" v-model="remark" placeholder="请输入备注"></textarea>
				</div>
				<div class="confirm white_color f14 mb-15" @click="confirmPackage">确认打包</div>
			</div>
		</van-dialog>
		<!-- 选择供应商/仓库 -->
		<div class="action_sheet flex fc" v-if="action_sheet">
			<div class="sheet_content white_back flex fc">
				<!-- 供应商选择 -->
				<div class="sheet_title flex ac jsb pl-15 pr-15" v-if="sheet_type == '1'">
					<input class="search_supplier flex-1 pl-10 pr-10" v-model="search_supplier" placeholder="请输入供应商名称">
					<img class="close_icon ml-15" src="../static/close_icon.png" @click="closeSheet">
				</div>
				<!-- 仓库选择 -->
				<div class="sheet_title relative flex ac jc" v-if="sheet_type == '2'">
					<div class="f16 fw-500">{{sheet_title}}</div>
					<img class="close_icon absolute" src="../static/close_icon.png" @click="closeSheet">
				</div>
				<!-- 供应商 -->
				<div class="flex-1 scroll-y" v-if="sheet_type == '1'">
					<div class="sheet_item flex ac jsb pl-20 pr-20" v-for="(item,index) in supplier_list" @click="changeSheet(index,item.supplier_id,item.supplier_name)">
						<div class="f16">{{item.supplier_name}}</div>
						<img class="radio_icon" src="../static/radio_active.png" v-if="supplier_index == index">
						<img class="radio_icon" src="../static/radio_icon.png" v-else>
					</div>
				</div>
				<!-- 仓库 -->
				<div class="flex-1 scroll-y" v-if="sheet_type == '2'">
					<div class="sheet_item flex ac jsb pl-20 pr-20" v-for="(item,index) in wms_list" @click="changeSheet(index,item.wms_co_id,item.name)">
						<div class="f16">{{item.name}}</div>
						<img class="radio_icon" src="../static/radio_active.png" v-if="wms_index == index">
						<img class="radio_icon" src="../static/radio_icon.png" v-else>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				code:"",							//输入框的唯一码
				dataObj: null,           			//添加商品返回的供应商信息
				goodsList:[],						//已添加的商品列表
				package_info_dialog:false,			//确认包裹信息弹窗
				packageObj:{},						//确认包裹信息
				action_sheet:false,					//选择供应商/仓库
				sheet_type:'1',						//1:供应商;2:仓库
				sheet_title:"",						//选择供应商/仓库弹窗标题
				wms_list:[],						//仓库列表
				wms_id:"",							//当前选中的仓库ID
				wms_name:"",						//当前选中的仓库name
				wms_index:-1,						//当前选中的仓库下标
				supplier_list:[],					//供应商列表
				search_supplier:"",					//输入的供应商名称
				supplier_id:"",						//当前选中的供应商ID
				supplier_name:"",					//当前选中的供应商name
				supplier_index:-1,					//当前选中的供应商下标
				remark:"",							//备注
				package_type:1,					//1:第一次打包；0:商家不一致确认之后第二次打包
			}
		},
		created(){
			//判断是否有未完成的包裹
			this.unFinishedPackage();
			//获取所有仓库
			this.ajaxWms();
		},
		mounted(){
			this.$refs.codeInput.focus();
		},
		computed:{
			//打印机
			printer(){
				return this.$store.state.printer;
			}
		},
		watch:{
			search_supplier:function(n,o){
				//获取所有供应商
				this.ajaxSupplier(n)
			}
		},
		methods:{
			//判断是否有未完成的包裹
			unFinishedPackage(){
				resource.unFinishedPackage().then(res => {
					if(res.data.code == 0){			//有未完成的包裹
						let data = res.data;
						this.dataObj = data.data;
						this.goodsList = data.goods;
					}else {
						let data = res.data;
						this.dataObj = null;
						this.goodsList = [];
					}
				})
			},
			//回车时触发
			keyupEnter(){
				if(this.code == ''){
					this.$toast('请扫描商品唯一码！');
				}else{
					var arg = {
						uniqNum: this.code,
						type: 1
					}
					if (this.dataObj) {
						arg.package_id = this.dataObj.package_id
					}
					this.$store.commit('setLoading',true);
					resource.addGoods(arg).then(res => {
						this.$store.commit('setLoading',false);
						this.code = "";
						if (res.data.code == 1) {
							this.dataObj = res.data.data;
							this.goodsList = res.data.goods;
							this.$toast('添加成功');
							this.$refs.codeInput.focus();
						} else {
							this.$dialog.alert({
								message: res.data.msg,
								confirmButtonText:'我知道了'
							}).then(() => {
								this.$refs.codeInput.focus();
							});
						}
					})
				}
			},
			//重置
			resetFn(){
				if(this.goodsList.length == 0){
					this.$toast('还没有商品哦～');
					return;
				}
				this.$dialog.confirm({
					title:'提示',
					message: '确定重置并删除包裹内所有商品吗？',
				}).then(() => {
					this.$store.commit('setLoading',true);
					resource.packageReset({package_id:this.dataObj.package_id}).then(res => {
						this.$store.commit('setLoading',false);
						if(res.data.code == 1){
							this.$toast(res.data.msg);
							//判断是否有未完成的包裹
							this.unFinishedPackage();
						}else{
							this.$toast(res.data.msg);
						}
					})
					this.$refs.codeInput.focus();
				}).catch(() => {
					this.$toast('取消重置');
					this.$refs.codeInput.focus();
				});
			},
			//完成打包
			overPackage(){
				if (this.goodsList.length == 0) {
					this.$toast('还没有商品哦～')
				} else {
					let arg = {
						packageId:this.dataObj.package_id
					}
					resource.packageInfo(arg).then(res => {
						if(res.data.code == 1){
							this.packageObj = res.data.data;
							this.package_info_dialog = true;
						}else{
							this.$toast(res.data.msg);
						}
					})
				}
			},
			//获取所有供应商
			ajaxSupplier(v){
				resource.ajaxSupplier({name:v}).then(res => {
					if(res.data.code == 1){
						this.supplier_list = res.data.data;
					}else{
						this.$toast(res.data.msg);
					}
				})
			},
			//获取所有仓库列表
			ajaxWms(){
				resource.ajaxWms().then(res => {
					if(res.data.code == 1){
						this.wms_list = res.data.data;
						let default_index = this.wms_list.findIndex(item => {
							return item.is_default === 1;
						})
						this.wms_id = this.wms_list[default_index].wms_co_id;
						this.wms_name = this.wms_list[default_index].name;
						this.wms_index = default_index;
					}else{
						this.$toast(res.data.msg);
					}
				})
			},
			//点击选择供应商/仓库
			actionSheet(type){	//1:供应商;2:仓库
				this.sheet_type = type;
				this.sheet_title = this.sheet_type == '1'?'选择供应商':'选择仓库';
				this.action_sheet = true;
			},
			//切换选中的底部弹出框
			changeSheet(index,id,name){
				this.active_index = index;
				switch(this.sheet_type){
					case '1': 		//供应商
					this.supplier_index = index;
					this.supplier_id = id;
					this.supplier_name = name;
					break;
					case '2': 		//仓库
					this.wms_index = index;
					this.wms_id = id;
					this.wms_name = name;
					break;
					default:
					return;
				}
			},
			//关闭底部弹出框
			closeSheet(){
				this.action_sheet = false;
				this.$refs.codeInput.focus();
			},
			//确认打包
			confirmPackage(){
				if(!this.printer){
					this.$dialog.alert({
						message: '请选择打印机'
					}).then(() => {
						this.$router.push('/printer');
					});
				}else if(this.supplier_id == ''){
					this.$toast('请选择供应商!');
				}else{
					let arg = {
						packageId: this.dataObj.package_id,
						supplier_id: this.supplier_id,
						wms_id: this.wms_id,
						time: this.packageObj.time,
						operator: this.packageObj.operator,
						choose: '222',
						remark: this.remark,
						type: this.package_type
					}
					this.$store.commit('setLoading',true);
					resource.confirmPackage(arg).then(res => {
						this.$store.commit('setLoading',false);
						if (res.data.code == 1) {
							this.package_info_dialog = false;
							this.$toast(res.data.msg);
							this.$router.go(-1);
						} else if (res.data.code == 100) {
							this.$dialog.alert({
								message: '当前打印机已掉线，请重新选择'
							}).then(() => {
								this.$router.push('/printer');
							});
						} else if (res.data.code == 0) {
							this.$dialog.confirm({
								title:'提示',
								message: res.data.msg,
							}).then(() => {
								this.package_type = 0;
								this.confirmPackage();
							}).catch(() => {
								this.package_info_dialog = false;
								this.$toast('取消打包');
								this.$refs.codeInput.focus();
							});
						} else {
							this.$toast(res.data.msg)
						}
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.top_input{
	background-color: #ffffff;
	height: 46px;
	.code_input{
		border-radius: 15px;
		background-color: #EDEDED;
		height: 30px;
		line-height: 30px;
		input{
			background-color: #EDEDED;
			height: 25px;
			line-height: 25px;
			outline: none;
			border: none;
		}
	}
	.scan_icon{
		width: 20px;
		height: 20px;
	}
}
.bottom_content{
	height: 53px;
	background: #FFFFFF;
	border-top: 1px solid #DBDBDB;
	.botton{
		border-radius: 16px;
		border:1px solid #0389FF;
		width:94px;
		text-align: center;
		height: 32px;
		line-height: 30px;
	}
	.reset{
		color: #0389FF;
	}
	.over{
		background-color: #0389FF;
	}
}
.close_icon{
	width:12px;
	height: 12px;
	right: 15px;
	top: 15px;
}
.r_arrow{
	margin-left: 5px;
	width:6px;
	height: 10.8px;
}
.remark{
	padding: 5px;
	outline: none;
	background-color: #F8F8F8;
	border:1px solid #F1F1F1;
}
.confirm{
	margin: 0 auto 15px;
	width: 110px;
	text-align: center;
	height: 30px;
	line-height: 31px;
	background: #0389FF;
	border-radius: 20px;
}
.action_sheet{
	justify-content: flex-end;
	background-color: rgba(0,0,0,0.8);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999999;
	.sheet_content{
		border-radius: 12px 12px 0 0;
		height: 200px;
		.sheet_title{
			height: 50px;
			.search_supplier{
				border:1px solid #F1F1F1;
				outline: none;
				background-color: #F8F8F8;
				height: 30px;
			}
			.close_icon{
				right: 15px;
				top:50%;
				transform: translate(0,-50%);
			}
		}
		.sheet_item{
			height: 55px;
			border-bottom: 1px solid #F7F7F7;
			.radio_icon{
				width:20px;
				height: 20px;
			}
		}
	}
}
</style>