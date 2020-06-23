<template>
	<div id="header">
		<div class="h-box" ref="box">
			<div class="center-box">
				<!-- 头部导航 -->
				<div class="h-nav clearfix">
					<div class="nav-left f-l">
						<p class="welcome">您好，欢迎光临联置科技！<button class="btn-login" v-if="!isLogin" @click="login()">请先登录</button><button class="btn-login" v-if="isLogin" @click="logout()">退出登录</button></p>
					</div>
					<div class="nav-right f-r">
						<ul class="clearfix">
							<li class="f-l">
								<router-link :to="{name:'home'}" active-class="on">首页</router-link>
							</li>
							<li class="f-l">
								<router-link :to="{path:'/main/buy'}" active-class="on">急购区</router-link>
							</li>
							<li class="f-l">
								<router-link :to="{path:'/main/low-price'}" active-class="on">库存市场</router-link>
							</li>
							<li class="f-l">
								<router-link :to="{name:'rank'}" active-class="on">封神榜</router-link>
							</li>
							<li class="f-l">
								<router-link :to="{name:'project'}" active-class="on">开放项目</router-link>
							</li>
						</ul>
					</div>
				</div>
				<!-- 头部logo及搜索 -->
				<div class="h-bottom d-f">
					<div class="hb-logo">
						<router-link :to="{name:'home'}">
							<img src="../assets/images/logo.png" alt="联置科技">
						</router-link>
					</div>
					<div class="hb-search d-f">
						<div class="input-box">
							<div class="input d-f">
								<i class="icon"></i>
								<input type="text" placeholder="输入想要搜索的型号" v-model="keywords">
							</div>
							<button @click="search()">本站搜索</button>
						</div>
						
						<!-- <button class="te-search" @click="teSearch()">TE搜索</button> -->
					</div>
					<div class="hb-icon">
						<router-link :to="{path:'/main/mine'}"><i class="icon" title="个人中心"></i></router-link>
						<router-link :to="{name:'register'}"><i class="icon" title="注册"></i></router-link>
						<router-link :to="{name:'low-price-shoppingcar'}"><i class="icon" title="购物车"></i></router-link>
						<!-- <i class="icon"></i>
						<i class="icon"></i> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import service from '../services/service.js'
	
	export default{
		name:'app-head',
		data(){
			return{
				isLogin:false,
				keywords:'',
			}
		},
		methods:{
			login(){
				this.$router.push({path:'/login'})
			},
			logout(){
				sessionStorage.removeItem("USER")
				sessionStorage.removeItem("JWT")
				sessionStorage.removeItem("TOKEN")
				sessionStorage.removeItem("ORDERS")
				this.$router.push({path:'/login'})
			},
			search(){
				if(this.$route.path==='/main/low-price/low-price-home'){
					this.$router.push({path:'/main/low-price',query:{keywords:this.keywords}})
					location.reload()
					return
				}
				this.$router.push({path:'/main/low-price',query:{keywords:this.keywords}})
			},
			teSearch(){
				if (this.keywords !== ''){
					let url = 'https://www.te.com.cn/chn-zh/search.html?q='+this.keywords+'&source=header'
					window.open(url, '_blank', 'width=600,height=600,top=300,left=1000,menubar=no,toolbar=no,status=no,scrollbars=yes')
				}
				
			}
		},
		created(){
			if(this.$route.query.keywords){
				this.keywords=this.$route.query.keywords
			}
			if(this.$route.query.openid){
				let formdata=new FormData()
				formdata.append('openid',this.$route.query.openid)
				service.getWxJwt(formdata).then((res)=>{
					if(res.data.code===200){
						sessionStorage.setItem("USER",JSON.stringify(res.data.user))
						sessionStorage.setItem("JWT",res.data.jwt)
						sessionStorage.setItem("TOKEN", res.data.user.token)
						this.isLogin=true
					}
				})
			}
			if(sessionStorage.getItem("JWT")){
				this.isLogin=true
			}else{
				this.isLogin=false
			}
		},
		mounted(){
			window.onscroll=()=>{
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if(scrollTop>0){
					this.$refs.box.style.backgroundColor="#3f3f3f"
				}else if(scrollTop===0){
					this.$refs.box.style.backgroundColor="rgba(0,0,0,.6)"
				}
			}
		},
		destroyed(){
			window.onscroll=()=>{return false}
		}
	}
</script>

<style scoped>
	#header {
		min-width: 1200px;
		position: relative;
		/* top:0;
		left:0;
		width: 100%;
		min-width: 1200px; */
	}
	.h-box{
		position: fixed;
		top:0;
		width: 100%;
		height: 166px;
		background-color: rgba(0,0,0,.6);
		z-index: 99
	}
	/* 头部导航 */
	.h-nav {
		height: 72px;
		line-height: 72px;
		color: #fff;
		font-size: 20px;
	}

	.nav-right li {
		position: relative;
	}

	.nav-right li a {
		padding: 0 10px;
		color: #fff;
	}
	
	.nav-right li +li{
		margin-left:32px;
	}

	.nav-right li a.on {
		color: #f6b243;
	}

	.nav-right li a.on:before {
		content: '';
		position: absolute;
		display: block;
		width: 100%;
		height: 5px;
		top: 0;
		left: 0;
		background-color: #f6b243;
	}

	/* 头部logo */
	.hb-logo {
		width: 284px;
	}

	.hb-logo a {
		display: block;
		width: 100%;
	}
	
	/* 搜索框 */
	.h-bottom{
		justify-content: space-between;
		align-items: center;
	}
	.hb-search{
		height: 58px;
		/* background-color: #b9b7b6; */
		border-radius: 5px;
		justify-content: space-between;
	}
	.input-box {
		background-color: #b9b7b6;
		display: flex;
		border-radius:  0 25px 25px 0;
	}
	.hb-search input{
		background-color: transparent;
		
		font-size: 24px;
		text-indent: 10px;
	}
	.input{
		margin-left:16px;
		align-items: center;
	}
	.hb-search button{
		width: 116px;
		background-color: #f6b243;
		border-radius: 5px;
		font-size: 20px;
		color:#fff;
		margin-left: 20px;
	}
	.te-search{
		background-color: #f17f3a !important;
	}
	.hb-search .icon{
		width: 40px;
		height: 40px;
		background-image: url(../assets/images/搜索.png);
	}
	/* 左侧icon */
	.hb-icon{
		width: 140px;
	}
	.hb-icon .icon{
		width: 24px;
		cursor: pointer;
	}
	.hb-icon a+a{
		margin-left:28px;
	}
	.hb-icon a:nth-child(1) .icon{
		height: 24px;
		background-image: url(../assets/images/个人中心（登陆）.png);
	}
	.hb-icon a:nth-child(2) .icon{
		height: 22px;
		background-image: url(../assets/images/注册.png);
	}
	.hb-icon a:nth-child(3) .icon{
		height: 23px;
		background-image: url(../assets/images/购物车.png);
	}
	button.btn-login{
		background-color: transparent;
		font-size: 12px;
		color:#fff;
		
	}
</style>
