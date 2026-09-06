<template>
	<div
		class="zw-zombie"
		:class="{ slowed: zombie.slowTimer > 0 }"
		:style="{ left: zombie.x + 'px', top: zombie.y + 'px', zIndex: 100 + zombie.row * 10 + 5 }"
	>
		<img class="body" :src="gif" alt="" />
		<div class="hp" v-if="!zombie.dead && zombie.hp < zombie.maxHp">
			<div class="hp-inner" :style="{ width: Math.max(0, (zombie.hp / zombie.maxHp) * 100) + '%' }"></div>
		</div>
	</div>
</template>
<script setup>
import { computed } from 'vue'
let props = defineProps({
	zombie: { type: Object, required: true }
})
let gif = computed(() => {
	let z = props.zombie
	if (z.dead) return z.dieSrc
	if (z.eating) return z.attackSrc
	return z.src
})
</script>
<style lang="scss">
.zw-zombie {
	position: absolute;
	transform: translate(-50%, -95%);
	pointer-events: none;
	&.slowed .body {
		filter: hue-rotate(160deg) brightness(1.15);
	}
	.body {
		display: block;
		max-width: 90px;
		max-height: 115px;
		object-fit: contain;
	}
	.hp {
		position: absolute;
		left: 50%;
		top: -6px;
		transform: translateX(-50%);
		width: 56px;
		height: 6px;
		border: 1px solid #2a1a08;
		background: #422105;
		.hp-inner {
			height: 100%;
			background: #d84c2a;
			transition: width 0.1s linear;
		}
	}
}
</style>
