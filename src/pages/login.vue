<template>
	<div class="container back flex fc ac jc">
		<div id="qrcode_img"></div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		created(){
			//获取app_key
			this.getAppKey();
		},
		methods:{
			//获取app_key
			getAppKey() {
				resource.getAppKey().then((res) => {
					if (res.data.code == "1") {
						let appKey = res.data.data.appkey;
						this.ddLoginInit(appKey);
					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			ddLoginInit(appKey) {
				let url = `${location.origin}/client/callback`;
				// let url = "http://selectiontest.92nu.com/api/scancodes/ewmlogin";
				const goto = encodeURIComponent(
					`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`
					);
				window.DDLogin({
					id: "qrcode_img",
					goto: goto,
					style: "border:none;background-color:#FFFFFF;margin:0 auto;",
        			width: "100%", //官方参数 365
        			height: "300", //官方参数 400
        		});
				let handleMessage = (event) => {
					let origin = event.origin;
					if (origin == "https://login.dingtalk.com") {
						const loginTmpCode = event.data;
						window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
					}
				};
				if (typeof window.addEventListener != "undefined") {
					window.addEventListener("message", handleMessage, false);
				} else if (typeof window.attachEvent != "undefined") {
					window.attachEvent("onmessage", handleMessage);
				}
			}


		}
	}
</script>
<style lang="less" scoped>
.back{
	background-color: #ffffff;
}
</style>