<template>
	<div class="card-bar">
		<div
			class="slot"
			v-for="card in cards"
			:key="card.name"
			:class="{ disabled: !usable(card) }"
			@click="quickPlant(card)"
		>
			<img
				class="card-img"
				:src="card.card"
				:alt="card.cname"
				:draggable="usable(card)"
				@dragstart="onDragStart(card, $event)"
				@dragend="onDragEnd"
			/>
			<div class="cost">
				<img class="sun" src="/images/interface/Sun.gif" alt="" />
				<span>{{ card.cost }}</span>
			</div>
			<div class="cd-mask" v-if="card.cd > 0" :style="{ height: (card.cd / card.cdMax) * 100 + '%' }"></div>
		</div>
	</div>
</template>
<script setup>
let props = defineProps({
	cards: { type: Array, default: () => [] },
	sun: { type: Number, default: 0 },
	selected: { type: String, default: '' }
})
const emit = defineEmits(['drag', 'dragend'])

function usable(card) {
	return props.sun >= card.cost && card.cd <= 0
}
function onDragStart(card, e) {
	if (!usable(card)) return
	e.dataTransfer.setData('text/plain', card.name)
	e.dataTransfer.effectAllowed = 'copy'
	emit('drag', card)
}
function onDragEnd() {
	emit('dragend')
}
/** 点击卡片：选中后再点草坪种下，再次点击取消选中 */
function quickPlant(card) {
	if (!usable(card)) return
	if (props.selected === card.name) return emit('dragend')
	emit('drag', card)
}
</script>
<style lang="scss">
.card-bar {
	flex: 1;
	height: 130px;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 20px;
	user-select: none;
	background: linear-gradient(#8a5326, #5b3416);
	border-bottom: 4px solid #3a2008;
	.slot {
		width: 86px;
		height: 108px;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #3a2008;
		border-radius: 6px;
		background: linear-gradient(#e6d3a3, #c8a165);
		box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
		&.disabled {
			.card-img {
				filter: grayscale(1) brightness(0.65);
				cursor: not-allowed;
			}
			.cost {
				color: #b1342a;
			}
		}
	}
	.card-img {
		width: 72px;
		height: 88px;
		margin-bottom: 12px;
		object-fit: contain;
		cursor: grab;
		&:active {
			cursor: grabbing;
		}
	}
	.cost {
		position: absolute;
		left: 0;
		bottom: 3px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		font-size: 13px;
		font-weight: bold;
		color: #4a2c10;
	}
	.sun {
		width: 16px;
		height: 16px;
	}
	.cd-mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.55);
		pointer-events: none;
	}
}
</style>
