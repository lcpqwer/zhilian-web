<template>
	<div id="login">
		<LoginHeadComponent></LoginHeadComponent>
		<div class="login-content">
			<div class="login-box" v-if="!isBand">
				<h4>密码登录</h4>
				<form @submit="login($event)" action="">
					<div class="d-f">
						<label for="username"><i class="icon"></i></label>
						<input type="text" name="username" id="username" placeholder="请输入手机号" v-model="loginForm.username" required>
					</div>
					<div class="d-f">
						<label for="password"><i class="icon"></i></label>
						<input type="password" name="password" id="password" placeholder="请输入密码" v-model="loginForm.password" required>
					</div>
					<button class="btn-login">立即登录</button>
				</form>
				<p class="wx">其他登录方式：<a href="http://login.asap-get.com/lianzhi/index/login/wxlogin"><i class="icon icon-vx"></i></a></p>
				<ul class="bottom-list d-f">
					<li>
						<router-link :to="{name:'forget'}">忘记密码</router-link>
					</li>
					<li>
						<router-link :to="{name:'register'}">免费注册</router-link>
					</li>
				</ul>
			</div>
			<div class="login-box" v-if="isBand">
				<h4>扫码成功，请绑定账号</h4>
				<form @submit="login($event)">
					<div class="d-f">
						<label for="username"><i class="icon"></i></label>
						<input type="text" name="username" id="username" placeholder="请输入手机号" v-model="loginForm.username" required>
					</div>
					<div class="d-f">
						<label for="password"><i class="icon"></i></label>
						<input type="password" name="password" id="password" placeholder="请输入密码" v-model="loginForm.password" required>
					</div>
					<button class="btn-login">立即登录</button>
				</form>
				<ul class="bottom-list d-f">
					<li>
						<router-link :to="{name:'forget'}">忘记密码</router-link>
					</li>
					<li>
						<router-link :to="{name:'register'}">免费注册</router-link>
					</li>
				</ul>
			</div>
		</div>
		<AppAlertComponent ref="appAlert"></AppAlertComponent>
		<AppFootComponent></AppFootComponent>
	</div>
</template>

<script>
	import LoginHeadComponent from './login-head.vue'
	import AppFootComponent from './app-foot.vue'
	import AppAlertComponent from './app-alert.vue'

	import service from '../services/service.js'

	export default{
		name:'login',
		components:{
			LoginHeadComponent,
			AppFootComponent,
			AppAlertComponent,
		},
		data(){
			return {
				loginForm:{
					username:'',
					password:'',
				},
				isBand:false
			}
		},
		methods:{
			login(event){
				event.preventDefault()
				if(sessionStorage.getItem("JWT")){
					this.$refs.appAlert.show("您已登录")
					setTimeout(()=>{
						this.$router.push({path:'/main'})
					},1500)
				}else{
					let formdata=new FormData()
					formdata.append('phone',this.loginForm.username)
					formdata.append('password',this.loginForm.password)
					service.userLogin(formdata).then((res)=>{
						window.console.log(res)
						if(res.data.code===200){
							this.$refs.appAlert.show('登录成功')
							sessionStorage.setItem("USER",JSON.stringify(res.data.user))
							sessionStorage.setItem("JWT",res.data.jwt)
							sessionStorage.setItem("TOKEN", res.data.user.token)
							setTimeout(() => {
								this.$router.push({path:'/main'})
							}, 1500);
						}else if(res.data.code===402){
							this.$refs.appAlert.show('账号或密码不正确',true)
						}
					})
				}
			}
		},
		created(){
			if(this.$route.query.openid){
				this.isBand=true
			}
		}
	}
	
</script>

<style scoped>
	.login-content{
		position: relative;
		height: 964px;
		background-image: url(../assets/images/loginbanner.png);
		background-size: cover;
	}
	.login-box{
		position: absolute;
		top:50%;
		bottom:50%;
		right:20%;
		width: 410px;
		height: 410px;
		padding:34px;
		background-color: #fff;
		color:#d8d8d8;
		transform: translateY(-50%);
	}
	.login-box h4{
		margin-bottom:50px;
		font-size: 18px;
		color:#f6b243;
		font-weight: normal;
	}
	.login-box form>div{
		width: 335px;
		margin:0 auto;
		align-items: center;
	}
	.login-box form>div+div{
		margin-top:20px;
	}
	.login-box form>div input{
		width: 278px;
		height: 40px;
		border:1px solid #d8d8d8;
		border-radius: 5px;
		text-indent: 10px;
	}
	.login-box form>div label{
		display: inline-block;
	}
	.login-box form>div label>i{
		width: 26px;
		height: 26px;
		margin-right:10px;
	}
	.login-box form>div:nth-child(1) label>i{
		background-image: url(../assets/images/username.png);
	}
	.login-box form>div:nth-child(2) label>i{
		background-image: url(../assets/images/password.png);
	}
	.login-box a{
		color:#d8d8d8;
	}
	.btn-login{
		display: block;
		width: 335px;
		height: 40px;
		margin:30px auto 0;
		background-color: #f6b243;
		border-radius: 5px;
		color:#fff;
		font-size: 18px;
	}
	.bottom-list{
		width: 335px;
		margin:70px auto 0;
		justify-content: space-between;
	}
	.icon-vx{
		vertical-align: middle;
		width: 29px;
		height: 23px;
		background-image: url(../assets/images/微信.png);
		cursor: pointer;
	}
	.login-box p{
		width: 335px;
		margin:20px auto 0; 
	}
	p.wx a{
		display: inline-block;
	}
</style>
