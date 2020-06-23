<template>
	<div id="rank">
		<div class="center-box">
			<h3>优质经销商推荐</h3>
			<p>极速易购为贸易商搭建连接器资源共享的平台，在这里，贸易商说了算!</p>
			<ol class="list">
				<li v-for="item of rankList" :key="item.Id">
					<i class="icon num"></i>
					<div class="d-f">
						<div class="r-pic">
							<img :src="`http://${item.deify_img}`" alt="te">
						</div>
						<p class="text">{{item.deify_main}}</p>
						<!-- <button>询价</button> -->
					</div>
				</li>
			</ol>
		</div>
	</div>
</template>

<script>
	import service from '../services/service.js'

	export default{
		name:'page-rank',
		data(){
			return {
				rankList:[]
			}
		},
		methods:{
			getRankList(){
				service.getRankList().then((res)=>{
					window.console.log(res)
					if(res.data.code===200){
						this.rankList=res.data.data
					}
				})
			}
		},
		created(){
			this.getRankList()
		}
	}
</script>

<style scoped>
	#rank{
		padding:260px 0 92px;
		background-color: #e7e4e3;
	}
	.center-box>h3{
		font-size: 44px;
		color:#f6b243;
		text-align: center;
	}
	.center-box>p{	
		margin:20px 0 40px;
		text-align: center;
	}
	/* 列表 */
	ol.list li{
		cursor: pointer;
	}
	ol.list li>div{
		overflow: hidden;
        height: 136px;
        background-color: #fff;
        justify-content: space-around;
        align-items: center;
	}
    ol.list li+li{
        margin-top:38px;
    }
    ol.list li .r-pic{
        width:200px;
    }
    ol.list li .text{
        overflow: hidden;
        display: -webkit-box;
        width: 766px;
        color:#a4a4a4;
        line-height: 30px;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
	ol.list li i.num{
		width: 145px;
		height: 45px;
		margin-bottom:20px;
		background-repeat: no-repeat;
	}
	ol.list li:nth-child(1) i.num{
		background-image: url(../assets/images/NO.1.png);
	}
	ol.list li:nth-child(2) i.num{
		background-image: url(../assets/images/NO.2.png);
	}
	ol.list li:nth-child(3) i.num{
		background-image: url(../assets/images/NO.3.png);
	}
	ol.list li:nth-child(4) i.num{
		background-image: url(../assets/images/NO.4.png);
	}
	ol.list li:nth-child(5) i.num{
		background-image: url(../assets/images/NO.5.png);
	}
	ol.list li:nth-child(6) i.num{
		background-image: url(../assets/images/NO.6.png);
	}
	ol.list li:nth-child(7) i.num{
		background-image: url(../assets/images/NO.7.png);
	}
	ol.list li:nth-child(8) i.num{
		background-image: url(../assets/images/NO.8.png);
	}
	ol.list li button{
		width: 70px;
		height: 32px;
		background-color: #f6b243;
		border-radius: 10px;
		color:#fff;
	}
</style>
