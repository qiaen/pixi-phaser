<template>
	<div class="zombie" :style="style">
		<div class="num" :style="{ opacity: data.dead ? 0 : 1 }">{{ data.blood }}</div>
		<img :src="src" />
	</div>
</template>
<script setup>
import { defineProps, computed, defineEmits } from 'vue'

let props = defineProps(['data'])
let emits = defineEmits(['fire'])
let data = computed(() => props.data || { row: 0, col: 0, level: 0 })
let src = computed(() => {
	let { level, dead } = data.value
	return dead ? `/js/bz.gif` :`/js/lv-${level}.gif`
})
let style = computed(() => {
	let { col, row } = data.value
	return {
		left: `${300 + col * 100}px`,
		top: `${72 + row * 100}px`
	}
})
</script>
<style lang="scss">
.zombie {
	position: absolute;
	width: 74px;
	height: 98px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	z-index: 1;
	.num {
		font-weight: bolder;
	}
	img {
		width: 100%;
	}
}
</style>
