<template>
	<div class="home-buy">
		<HomeTitleComponent msg="急购专区"></HomeTitleComponent>
		<div class="center-box clearfix">
			<div class="left f-l">
				<h4>最新求购</h4>
				<table class="l-table">
					<thead>
						<tr>
							<th>求购时间</th>
							<th>型号</th>
							<th>数量</th>
							<th>求购/买单</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item of list" :key="item.Id">
							<td>{{item.time|time}}</td>
							<td>{{item.model}}</td>
							<td>{{item.number}}</td>
							<td><button :class="{'on':item.type==='1'}" @click="toBuy()">{{item.type|listType}}</button></td>
						</tr>
					</tbody>
				</table>
				<p class="more">
					<router-link :to="{path:'/main/buy'}" class="f-r">查看更多</router-link>
				</p>
			</div>
			<div class="right f-r">
				<div class="r-title">
					<h4>求购货源展示</h4>
				</div>
				<div class="th">
					<span>求购时间</span>
					<span>型号</span>
					<span>数量</span>
				</div>
				<div class="r-table-box" ref="box" @mouseenter="scrollList" @mouseleave="scrollList">
					<ul class="r-table" ref="list1">
						<li v-for="(item,index) of list2" :key="item.Id" :class="'list'+(index+1)"> 
							<span>{{item.time|time}}</span>
							<span>{{item.model}}</span>
							<span>{{item.number}}</span>
						</li>
					</ul>
					<ul class="r-table" ref="list2">
						<li v-for="item of list2" :key="item.Id">
							<span>{{item.time|time}}</span>
							<span>{{item.model}}</span>
							<span>{{item.number}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import HomeTitleComponent from './home-title.vue'
	import service from '../services/service.js'
	
	export default {
		name:'home-buy',
		components:{
			HomeTitleComponent
		},
		data(){
			return {
				list:[],
				list2:[],
				timer:null,
				pos:0
			}
		},
		methods:{
			getList(){
				let formdata=new FormData()
				formdata.append('page',1)
				service.showBuyList(formdata).then((res)=>{
					let max1 = res.data.data.length>4?4:res.data.data.length
					let max2 = res.data.data.length>5?5:res.data.data.length
					for(let i = 0;i<max1;i++){
						this.list.push(res.data.data[i])
					}
					for(let i = 0;i<max2;i++){
						this.list2.push(res.data.data[i])
					}
				})
			},
			toBuy(){
				this.$router.push({path:'/main/buy'})
			},
			scrollList(){
				if(!this.timer){
					this.timer=setInterval(() => {
						if(this.pos>-235){
							this.pos--
							this.$refs.list1.style.transform=`translateY(${this.pos}px)`
							this.$refs.list2.style.transform=`translateY(${this.pos}px)`
						}else{
							this.pos=0
						}
					}, 1000/60);
				}else{
					clearInterval(this.timer)
					this.timer=null
				}
			}
		},
		created(){
			this.getList()
		},
		mounted(){
			this.scrollList()
		},
		destroyed(){
			clearInterval(this.timer)
		},
		filters:{
			listType(value){
				return value==='1'?"实单":"询价"
			},
			time(value){
				return value.substring(0,10)
			}
		},
	}
</script>

<style scoped>
	.home-buy{
		background-color: #f4f2ee;
	}
	.home-buy .left{
		width: 714px;
		height: 342px;
		padding:20px;
		background-color: #fff;
	}
	.home-buy .left h4{
		font-size: 18px;
		line-height: 30px;
		font-weight: normal;
	}
	table{
		width: 100%;
		border-collapse: collapse;
		text-align: center;	
	}
	th{
		font-weight: normal;
	}
	.l-table td>button{
		width: 60px;
		height: 30px;
		background-color: #F6B243;
		border-radius: 5px;
		color:#fff;
	}
	.l-table td,th{
		height: 50px;
	}
	.more{
		line-height:40px;
	}
	.more a{
		margin-top:15px;
		padding-right:58px;
	}
	/* 右边求购货源展示 */
	.right{
		width: 382px;
		height: 382px;
	}
	.right .r-title{
		margin-bottom:20px;
		border-bottom: 1px solid #8F8F91;
	}
	.right h4{
		position: relative;
		width: 130px;
		padding:4px 10px 28px;
		font-size: 20px;
		color:#F6B243;
		font-weight: normal;
	}
	.right h4::after{
		content:'';
		position: absolute;
		display: block;
		bottom:-1px;
		left:0;
		width: 100%;
		height: 3px;
		background-color: #F6B243;
	}
	.th{
		height: 60px;
		background-color: #d8d8d8;
	}
	.th>span{
		display: inline-block;
		width: 33%;
		text-align: center;
		line-height: 60px;
	}
	.r-table li>span{
		overflow: hidden;
		display: inline-block;
		width: 33%;
		line-height: 45px;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap
	}
	
	.r-table-box{
		overflow: hidden;
		height: 235px;
	}
	.r-table li{
		background-color: #fff;
	}
	.r-table li:nth-child(1){
		padding-top:10px;
	}
	.home-buy .l-table button.on{
		background-color: #f17f3a;
	}
</style>
