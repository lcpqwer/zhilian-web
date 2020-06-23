<template>
	<div class="first-section">
		<div class="center-box clearfix">
			<div class="left f-l">
				<button @click="toBuy()">发布求购</button>
				<button @click="toMineInventory()">上传库存</button>
			</div>
			<div class="right f-r">
				<ul class="r-nav clearfix">
					<li class="f-l" @click="changeState(1)" :class="{'on': state===1}">品牌货源展示</li>
					<li class="f-l" @click="changeState(2)" :class="{'on': state===2}">优质贸易商展示</li>
				</ul>
				<ul class="list d-f" v-if="state===1">
					<li class="te-box">
						<div class="te">
							<i class="icon"></i>
							<input type="text" placeholder="输入想要搜索的型号" v-model="keywords" />
							<button class="te-search" @click="teSearch()">TE搜索</button>
						</div>
					</li>
					<li v-for="item of rankList" :key="item.Id">
						<a :href="item.url">
							<img :src="item.img" alt="图片加载失败">
						</a>
					</li>
					<!-- <li>
						<a href="http://www.amphenol-icc.com/">
							<img src="../assets/images/FCI.png" alt="FCI">
						</a>
					</li>
					<li>
						<a href="https://www.ittcannon.com/">
							<img src="../assets/images/ITT.png" alt="ITT">
						</a>
					</li>
					<li>
						<a href="http://www.jst.com/">
							<img src="../assets/images/JST.png" alt="JST">
						</a>
					</li>
					<li>
						<a href="http://www.ket.com/kr/main.ket">
							<img src="../assets/images/KEI.png" alt="KEI">
						</a>
					</li>
					<li>
						<a href="https://www.hirschmann-automotive.com/">
							<img src="../assets/images/HIRSCHMANN.png" alt="HIRSCHMANN">
						</a>
					</li>
					<li>
						<a href="https://www.te.com.cn">
							<img src="../assets/images/TE.png" alt="TE">
						</a>
					</li>
					<li>
						<a href="https://www.infineon.com/">
							<img src="../assets/images/INFINEON.png" alt="INFINEON">
						</a>
					</li>
					<li>
						<a href="https://www.arrow.com/">
							<img src="../assets/images/ARROW ELECTRONICS,INC..png" alt="ARROW ELECTRONICS,INC">
						</a>
					</li> -->
				</ul>
				<ul class="list d-f" v-if="state===2">
					<li v-for="item of brandList" :key="item.Id">
						<a :href="item.url">
							<img :src="item.img" alt="图片加载失败">
						</a>
					</li>
				</ul>
			</div>
		</div>
		<BuyAlertComponent ref="buyalert" @addbuyevent="addBuy"></BuyAlertComponent>
		<AppAlertComponent ref="appalert"></AppAlertComponent>
	</div>
</template>

<script>
	import service from '../services/service.js'
	import BuyAlertComponent from './buy-alert'
	import AppAlertComponent from './app-alert'
	export default {
		components:{
			BuyAlertComponent,
			AppAlertComponent
		},
		data(){
			return {
				state:1,
				rankList:[],
				brandList:[],
				keywords: ''
			}
		},
		methods:{
			teSearch(){
				if (this.keywords !== ''){
					let url = 'https://www.te.com.cn/chn-zh/search.html?q='+this.keywords+'&source=header'
					window.open(url, '_blank', 'width=600,height=600,top=300,left=1000,menubar=no,toolbar=no,status=no,scrollbars=yes')
				}
				
			},
			toBuy(){
				if(sessionStorage.getItem("USER")){
					this.$refs.buyalert.show(0)
				}else{
					this.$router.push({path:'/login'})
				}
			},
			toMineInventory(){
				this.$router.push({path:'/main/mine',query:{state:7}})
			},
			addBuy(params){
				let formdata = new FormData()
				let user = JSON.parse(sessionStorage.getItem("USER"))
				let jwt = sessionStorage.getItem("JWT")
				formdata.append('uid',user.Id)
				formdata.append('jwt',jwt)
				formdata.append('model',params.model)
				formdata.append('untaxedprice',params.untaxedprice)
				formdata.append('number',params.number)
				formdata.append('type',params.state===0?2:1)	
				service.addBuy(formdata).then((res)=>{
					if(res.data.code===200){
						this.$refs.appalert.show("发布成功")
					}else{
						this.$refs.appalert.show("发布失败",true)
					}
				})
			},
			getBrandList(state){
				let formdata=new FormData()
				formdata.append('type',state)
				service.getBrandList(formdata).then(res=>{
					if(res.data.code===200){
						if(state===1){
							this.rankList=res.data.data
						}
						if(state===2){
							this.brandList=res.data.data
						}
					}
				})
			},
			changeState(state){
				this.state=state;
			}
		},
		created(){
			this.getBrandList(1)
			this.getBrandList(2)
		}
	}
</script>

<style scoped>
	.first-section{
		background-color: #e7e4e3;
	}
	/* 左边按钮区 */
	.first-section .left{
		width: 406px;
	}
	.left button{
		width: 100%;
		height: 248px;
		border-radius: 10px;
		color:#fff;
		font-size: 42px;
	}
	.left button:nth-child(1){
		background-color: #f6b243;
	}
	.left button:nth-child(2){
		background-color: #f17f3a;
	}
	.left button+button{
		margin-top:20px;
	}
	/* 右边内容展示区 */
	.right {
		width: 766px;
	}
	.right .r-nav{
		margin-bottom:20px;
		font-size: 20px;
		color:#8f8f91;
		border-bottom:1px solid #8F8F91;
	}
	.right .r-nav li{
		position: relative;
		padding:5px 8px 28px;
		cursor: pointer;
	}
	.right .r-nav li.on{
		color:#F6B243;
	}
	.right .r-nav li.on:after{
		content:'';
		position: absolute;
		display: block;
		bottom:-1px;
		left:0;
		width: 100%;
		height: 3px;
		background-color: #F6B243;
		
	}
	.list{
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.right .list li{
		overflow: hidden;
		margin-bottom:10px;
		background-color: #fff;
		border-radius: 10px;
	}
	.right .list li img{
		width: 248px;
		height: 140px;
	}
	.right .list li a{
		display: block;
		width: 100%;
	}
	
	.te-box {
		width: 100%;
		height: 58px;
		background-color: #E7E4E3 !important;
	}
	.te {
		height: 58px;
		background-color: #b9b7b6 !important;
		border-radius: 5px !important;
		width: 463px;
		margin: 0 auto;
		display: flex;
	}
	.icon{
		width: 43px;
		height: 40px;
		background-image: url(../assets/images/搜索.png);
		margin: auto 10px;
	}
	.te input {
		font-size: 24px;
		background-color: #b9b7b6 !important;
	}
	
	.te-search{
		height: 58px;
		/* background-color: #b9b7b6; */
		border-radius: 5px;
		justify-content: space-between;
		width: 116px;
		background-color: #f6b243;
		border-radius: 5px;
		font-size: 20px;
		color: #fff;
		margin-left: 20px;
	}
</style>
