<template>
	<img
		class="zw-sun"
		src="/images/interface/Sun.gif"
		:style="{ left: sun.x + 'px', top: sun.y + 'px' }"
		alt=""
		@click.stop="emit('collect', sun)"
	/>
</template>
<script setup>
let props = defineProps({
	sun: { type: Object, required: true }
})
const emit = defineEmits(['collect'])
</script>
<style lang="scss">
.zw-sun {
	position: absolute;
	z-index: 500;
	width: 54px;
	height: 54px;
	transform: translate(-50%, -50%);
	cursor: pointer;
	pointer-events: auto;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	&:hover {
		filter: drop-shadow(0 0 8px #fff) brightness(1.15);
	}
}
</style>
