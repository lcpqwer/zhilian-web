<template>
    <div id="home">
		<!-- 轮播 -->
		<!-- <div class="banner">
			<ul>
				<li>
					<a href="javascript:;">
						<img src="../assets/images/首页banner.png" alt="banner">
					</a>
				</li>
				<li>
					<a href="javascript:;">
						<img src="../assets/images/首页banner.png" alt="banner">
					</a>
				</li>
			</ul>
			<div class="btn-box">
				<span class="on"></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div> -->
		<!-- 货源展示 -->
        <HomeFirstSectionComponent></HomeFirstSectionComponent>
		<!-- 急购专区 -->
		<HomeBuyComponent></HomeBuyComponent>
		<!-- 低价抛售区 -->
		<HomeLowPriceComponent></HomeLowPriceComponent>
		<!-- 封神榜 -->
		<HomeRankComponent></HomeRankComponent>
		<!-- 开放项目 -->
		<HomeProjectComponent></HomeProjectComponent>
    </div>
</template>

<script>
	import HomeFirstSectionComponent from './home-first-section.vue'
	import HomeBuyComponent from './home-buy.vue'
	const HomeLowPriceComponent=()=>import('./home-low-price.vue')
	const HomeRankComponent=()=>import('./home-rank.vue')
	const HomeProjectComponent=()=>import('./home-project.vue')

	export default {
		name: 'home',
		components: {
			HomeFirstSectionComponent,
			HomeBuyComponent,
			HomeLowPriceComponent,
			HomeRankComponent,
			HomeProjectComponent
		},
		created(){
			
		}
	}
</script>

<style scoped>
	#home>div:not([class='banner']){
		padding:80px 0;
	}
	#home{
		padding-top:170px;
	}
	/* 轮播 */
	/* .banner{
		position: relative;
		padding-top:56.25%;
	}
	.banner li{
		position: absolute;
		top:0;
		left:0;
		width: 100%;
	}
	.banner li a{
		display: block;
		width: 100%;
		height: 100%;	
	}
	.banner li a img{
		width: 100%;
	} */
	/* .btn-box{
		position: absolute;
		bottom:50px;
		left:0;
		width: 100%;
		height: 18px;
		text-align: center;
		z-index: 1;
	}
	.btn-box>span{
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 1px solid #fff;
		border-radius: 50%;
		cursor: pointer;
	}
	.btn-box>span.on{
		background-color: #fff;
	}
	.btn-box>span+span{
		margin-left:15px;
	} */
</style>