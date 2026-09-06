<template>
	<div class="zw-plant" :style="{ left: plant.x + 'px', top: plant.y + 'px', zIndex: 100 + plant.row * 10 }">
		<img class="body" :src="gif" alt="" />
		<div class="hp" v-if="plant.hp < plant.maxHp">
			<div class="hp-inner" :style="{ width: Math.max(0, (plant.hp / plant.maxHp) * 100) + '%' }"></div>
		</div>
	</div>
</template>
<script setup>
import { computed } from 'vue'
let props = defineProps({
	plant: { type: Object, required: true }
})
let gif = computed(() => {
	let p = props.plant
	// 土豆雷未就绪 / 大嘴花咀嚼中
	if (p.name === 'PotatoMine' && p.state !== 'armed') return '/images/Plants/PotatoMine/PotatoMineNotReady.gif'
	if (p.name === 'Chomper' && p.state === 'chew') return '/images/Plants/Chomper/ChomperDigest.gif'
	return p.gif
})
</script>
<style lang="scss">
.zw-plant {
	position: absolute;
	transform: translate(-50%, -85%);
	pointer-events: none;
	.body {
		display: block;
		max-width: 76px;
		max-height: 92px;
		object-fit: contain;
	}
	.hp {
		position: absolute;
		left: 50%;
		bottom: -8px;
		transform: translateX(-50%);
		width: 52px;
		height: 5px;
		border: 1px solid #2a1a08;
		background: #422105;
		.hp-inner {
			height: 100%;
			background: #4cae2b;
			transition: width 0.1s linear;
		}
	}
}
</style>
