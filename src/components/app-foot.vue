<template>
	<div id="footer">
		<div class="center-box">
			<div class="link d-f">
				<ul>
					<li>{{contact.name}}</li>
					<li>
						<i class="icon phone"></i>
						<span>{{contact.phone}}</span>
					</li>
					<li>
						<i class="icon address"></i>
						<span>{{contact.adress}}</span>
					</li>
					<li>
						<i class="icon email"></i>
						<span>{{contact.email}}</span>
					</li>
				</ul>
				<ul class="helplist d-f">
					<li v-for="item of helpList" :key="item.Id">
						<router-link :to="{path:'/help-center',query:{item:JSON.stringify(item)}}">{{item.name}}</router-link>
					</li>
				</ul>
			</div>
			<p class="copyright">Copyright © 2019. 联置电子科技（上海）有限公司 .All rights reserved. 备案号：沪ICP备16027880号-2</p>
		</div>
	</div>
</template>

<script>
import service from '../services/service'
	export default{
		name:'app-footer',
		data(){
			return {
				contact:[],
				helpList:[]
			}
		},
		methods:{
			getContactInformation(){
				service.getContactInformation().then(res=>{
					if(res.data.code===200){
						this.contact=res.data.user
					}
				})
			},
			getHelpCenterList(){
				service.getHelpCenterList().then(res=>{
					if(res.data.code===200){
						this.helpList=res.data.data
					}
				})
			}
		},
		created(){
			this.getContactInformation()
			this.getHelpCenterList()
		}
	}
</script>

<style scoped>
	/* 底部样式 */
	#footer{
		min-height: 400px;
		padding-top:65px;
		background-color: #1c1a18;
		color:#888;
	}
	a{
		color:#888
	}
	.link ul:nth-child(1){
		margin-right:30px;
	}
	.link li{
		margin-right:20px;
		line-height: 44px;
		font-size: 14px;
	}
	.link li a{
		transition-duration: .3s;
	}
	.link li:hover a{
		color:#fff
	}
	.link ul:nth-child(1) li:nth-child(1){
		line-height: 48px;
		font-size: 18px;
		font-weight: bold;
		color:#fff;
	}
	.icon{
		vertical-align: middle;
		width: 20px;
		height: 20px;
		margin-right:30px
	}
	.phone{
		background-image: url(../assets/images/电话icon.png);
	}
	.address{
		width: 18px;
		background-image: url(../assets/images/地址.png);
	}
	.email{
		height: 14px;
		background-image: url(../assets/images/邮箱icon.png);
	}
	
	.copyright{
		margin-top:60px;
		font-size: 12px;
		text-align:center;
	}
	.helplist{
		max-width: 800px;
		flex-wrap: wrap;
		justify-content: center;
	}
	@media screen and (max-width: 768px){
		#footer{
			display: none
		}
	}
</style>
