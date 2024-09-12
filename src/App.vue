<template>
	<router-view v-slot="{ Component }">
		<component :is="Component" />
	</router-view>
</template>
<script setup>
</script>
<style lang="scss">
* {
	padding: 0;
	margin: 0;
}
html, body {
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
