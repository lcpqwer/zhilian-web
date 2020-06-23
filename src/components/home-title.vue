<template>
		<h3 class="home-title">
			<span></span>
			{{msg}}
			<span></span>
		</h3>
</template>

<script>
	export default {
		name:'home-title',
		props:{
			msg:{
				type:String,
				default:'默认标题'
			}
		}
	}
</script>

<style scoped>
	.home-title{
		margin-bottom:50px;
		font-size: 22px;
		color:#F17f3a;
		text-align: center;
		font-weight: normal;
	}
	.home-title span{
		display: inline-block;
		width: 200px;
		height: 22px;
		background-image: url(../assets/images/标题装饰-左.png);
		background-size: cover;
	}
	.home-title span:nth-child(2){
		background-image: url(../assets/images/标题装饰-右.png);
	}
</style>
