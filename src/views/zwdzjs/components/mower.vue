<template>
	<div
		class="zw-mower"
		:style="{ left: mower.x + 'px', top: mower.y + 'px', zIndex: 100 + mower.row * 10 + 7 }"
	>
		<img class="body" :src="mower.running ? '/images/interface/LawnCleaner1.png' : '/images/interface/LawnCleaner.png'" alt="小推车" />
	</div>
</template>
<script setup>
defineProps({
	mower: { type: Object, required: true }
})
</script>
<style lang="scss">
.zw-mower {
	position: absolute;
	transform: translate(-50%, -80%);
	pointer-events: none;
	.body {
		display: block;
		width: 68px;
		object-fit: contain;
		filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.45));
	}
}
</style>
