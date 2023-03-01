<template>
	<div class="container flex fc">
		<header-bar title="批量打包"/>
		<div class="top_input flex ac pl-12 pr-12 mb-6">
			<div class="flex-1 flex ac code_input pl-22 pr-22">
				<input ref="codeInput" class="width-100 f12" placeholder="请输入商品编码" @keyup.enter="keyupEnter" v-model="code">
			</div>
			<img class="scan_icon ml-12" src="../static/scan_icon.png">
		</div>
		<div class="flex-1 flex fc">
			<div class="white_back pt-10 pl-20 pb-10 f16 fw-500">商品列表</div>
			<div class="flex-1 scroll-y">
				<div class="white_back flex ac jsb pt-10 pl-20 pb-10 pr-20" v-for="(item,index) in goodsList">
					<div class="f14">{{item.sku_id}}</div>
					<div class="flex ac">
						<div class="flex ac dark_color mr-8">{{item.num}}件</div>
						<img class="delete_icon" src="../static/delete_icon.png" @click="deleteGoods(index)">
					</div>
				</div>
			</div>
		</div>
		<div class="bottom_content width-100 flex ac jse pl-20 pr-10">
			<div class="botton f14 over white_color" @click="overPackage">完成打包</div>
		</div>
		<!-- 输入数量 -->
		<van-dialog v-model:show="package_num_dialog" :show-confirm-button="false">
			<div class="relative flex ac jc pt-20 pb-20 f15 fw-600">
				<div>{{code}}</div>
				<img class="close_icon absolute" src="../static/close_icon.png">
			</div>
			<div class="pl-15 pr-15">
				<div class="flex ac f14 mb-15">
					<div>数量：</div>
					<input class="number flex-1" type="number" v-model="number" placeholder="请输入数量"></input>
				</div>
				<div class="confirm white_color f14 mb-15" @click="confirmNumber">确认</div>
			</div>
		</van-dialog>
		<!-- 确认包裹信息弹窗 -->
		<van-dialog v-model:show="package_info_dialog" :show-confirm-button="false">
			<div class="relative flex ac jc pt-20 pb-20 f15 fw-600">
				<div>确认包裹信息</div>
				<img class="close_icon absolute" src="../static/close_icon.png" @click="package_info_dialog = false">
			</div>
			<div class="pl-15 pr-15">
				<div class="flex ac f14 mb-15">
					<div>供应商：</div>
					<div class="flex ac" @click="actionSheet('1')">
						<div>{{supplier_id == ''?'请选择':supplier_name}}</div>
						<img class="r_arrow" src="../static/r_arrow.png">
					</div>
				</div>
				<div class="flex ac f14 mb-15">
					<div>仓库：</div>
					<div class="flex ac" @click="actionSheet('2')">
						<div>{{wms_id == ''?'请选择':wms_name}}</div>
						<img class="r_arrow" src="../static/r_arrow.png">
					</div>
				</div>
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
					<img class="close_icon ml-15" src="../static/close_icon.png" @click="action_sheet = false">
				</div>
				<!-- 仓库选择 -->
				<div class="sheet_title relative flex ac jc" v-if="sheet_type == '2'">
					<div class="f16 fw-500">{{sheet_title}}</div>
					<img class="close_icon absolute" src="../static/close_icon.png" @click="action_sheet = false">
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

	import HeaderBar from '../components/header_bar.vue'
	export default{
		inject: ["reload"],
		data(){
			return{
				code:"",							//输入框的唯一码
				package_num_dialog:false,			//输入数量弹窗
				number: 1,           				//添加商品的默认数量
				goodsList:[],						//已添加的商品列表
				package_info_dialog:false,			//确认包裹信息弹窗
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
			}
		},
		beforeRouteLeave(to,from,next){
			if(to.path == '/printer'){	//选择打印机(缓存)
				from.meta.isUseCache = true;
			}else{
				from.meta.isUseCache = false;
			}
			next();
		},
		activated(){
			this.$refs.codeInput.focus();
			//页面来源
			this.page_type = this.$route.query.page_type;
			if(!this.$route.meta.isUseCache){
				//获取所有仓库
				this.ajaxWms();
				this.code = "";							//输入框的唯一码
				this.package_num_dialog = false;			//输入数量弹窗
				this.number = 1;           				//添加商品的默认数量
				this.goodsList = [];						//已添加的商品列表
				this.package_info_dialog = false;			//确认包裹信息弹窗
				this.action_sheet = false;					//选择供应商/仓库
				this.sheet_type = '1';						//1:供应商;2:仓库
				this.sheet_title = "";						//选择供应商/仓库弹窗标题
				this.wms_list = [];					//仓库列表
				this.wms_id = "";							//当前选中的仓库ID
				this.wms_name = "";						//当前选中的仓库name
				this.wms_index = -1;						//当前选中的仓库下标
				this.supplier_list = [];					//供应商列表
				this.search_supplier = "";					//输入的供应商名称
				this.supplier_id = "";						//当前选中的供应商ID
				this.supplier_name = "";					//当前选中的供应商name
				this.supplier_index = -1;					//当前选中的供应商下标
				this.remark = "";							//备注
			}
			this.$route.meta.isUseCache = false;
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
			//回车时触发
			keyupEnter(){
				if(this.code == ''){
					this.$toast('请扫描商品编码！');
				}else{
					var arg = {
						sku_id: this.code
					}
					resource.addAllGoods(arg).then(res => {
						if (res.data.code == 1) {
							let has_arr = this.goodsList.filter(item => {
								return item.sku_id == this.code;
							});
							if (has_arr.length > 0) {
								this.$toast('该商品已存在，请删除后重新录入！')
								this.code = "";
							} else {
								this.package_num_dialog = true;
							}
						} else {
							this.$dialog.alert({
								title:'提示',
								message: res.data.msg,
								confirmButtonText:'我知道了'
							}).then(() => {
								this.code = "";
							});
						}
					})
				}
			},
			//删除商品
			deleteGoods(index) {
				this.goodsList.splice(index,1);
			},
			//确认数量
			confirmNumber(){
				if (this.number == '' || this.number < 1) {
					this.$toast('数量至少1件！')
				} else {
					let goodsItem = {
						sku_id: this.code,
						num: this.number
					}
					this.goodsList.push(goodsItem);
					this.code = "";
					this.number = 1;
					this.package_num_dialog = false;
					this.$refs.codeInput.focus();
				}
			},
			//完成打包
			overPackage(){
				if (this.goodsList.length == 0) {
					this.$toast('还没有商品哦～')
				}else if(!this.printer){
					this.$dialog.alert({
						title:'提示',
						message: '请先选择打印机',
						confirmButtonText:'去选择'
					}).then(() => {
						this.$router.push('/printer');
					});
				}else {
					this.package_info_dialog = true;
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
				this.action_sheet = false;
			},
			//确认打包
			confirmPackage(){
				if(this.supplier_id == ''){
					this.$toast('请选择供应商!');
				}else{
					let arg = {
						data: JSON.stringify(this.goodsList),
						supplier_id: this.supplier_id,
						remark: this.remark,
						printer: this.printer,
						wms_id: this.wms_id
					}
					resource.batchPack(arg).then(res => {
						if (res.data.code == 1) {
							this.package_info_dialog = false;
							this.$toast(res.data.msg);
							this.reload();
						} else if (data.code == 100) {
							this.$dialog.alert({
								message: '当前打印机已掉线，请重新选择'
							}).then(() => {
								this.$router.push('/printer');
							});
						} else if (data.code == 0) {
							this.$dialog.confirm({
								title:'提示',
								message: res.data.msg,
							}).then(() => {
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
		},
		components:{
			HeaderBar
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
.delete_icon{
	width:12px;
	height: 12px;
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
.number{
	padding: 0 25px;
	outline: none;
	height: 38px;
	background: #F8F8F8;
	border-radius: 21px;
	border: 1px solid #F1F1F1;
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