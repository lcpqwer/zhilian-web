<template>
	<div>
		<AppHeadComponen></AppHeadComponen>
		<router-view></router-view>
		<AppFootComponen></AppFootComponen>
	</div>
</template>

<script>
	import AppHeadComponen from './app-head.vue'
	import AppFootComponen from './app-foot.vue'
	export default {
		name: 'app',
		components: {
			AppHeadComponen,
			AppFootComponen
		},
	}
</script>

<style scoped>

</style>
