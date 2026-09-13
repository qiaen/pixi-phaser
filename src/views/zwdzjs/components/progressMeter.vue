<template>
	<div class="zw-meter">
		<div class="meter-label">
			<span class="level">第 {{ levelIndex + 1 }} / {{ total }} 关</span>
			<span class="name">{{ levelName }}</span>
		</div>
		<div class="meter-body">
			<img class="track" src="/images/interface/FlagMeterEmpty.png" alt="" />
			<div class="fill-wrap" :style="{ width: pct }">
				<img class="fill" src="/images/interface/FlagMeterFull.png" alt="" />
			</div>
			<img class="head" src="/images/interface/FlagMeterParts1.png" alt="" :style="{ left: pct }" />
			<img class="tip" src="/images/interface/FlagMeterParts2.png" alt="" :style="{ left: pct }" />
		</div>
	</div>
</template>
<script setup>
import { computed } from 'vue'
let props = defineProps({
	progress: { type: Number, default: 0 },
	levelIndex: { type: Number, default: 0 },
	total: { type: Number, default: 1 },
	levelName: { type: String, default: '' }
})
let pct = computed(() => Math.round(Math.min(1, Math.max(0, props.progress)) * 100) + '%')
</script>
<style lang="scss">
.zw-meter {
	position: absolute;
	right: 26px;
	bottom: 18px;
	width: 212px;
	user-select: none;
	pointer-events: none;
	.meter-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 2px;
		font-size: 13px;
		font-weight: bold;
		color: #fff;
		text-shadow: 1px 1px 2px #000, 0 0 4px #000;
		.name {
			font-size: 12px;
			color: #ffe08a;
		}
	}
	.meter-body {
		position: relative;
		width: 100%;
		height: 30px;
	}
	.track {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
	.fill-wrap {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		overflow: hidden;
		.fill {
			display: block;
			width: 212px;
			height: 30px;
			object-fit: fill;
		}
	}
	.head {
		position: absolute;
		top: 50%;
		width: 26px;
		height: 26px;
		transform: translate(-50%, -50%);
	}
	.tip {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 18px;
		transform: translate(-50%, -130%);
	}
}
</style>
