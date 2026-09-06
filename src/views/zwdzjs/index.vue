<template>
	<div class="zwdzjs">
		<div class="top-bar">
			<div class="sun-counter">
				<img src="/images/interface/Sun.gif" alt="" />
				<span>{{ sun }}</span>
			</div>
			<cardBar :cards="cards" :sun="sun" :selected="dragging && dragging.name" @drag="onDrag" @dragend="onDragEnd" />
		</div>
		<div class="stage-wrap" ref="refStageWrap">
			<div class="stage" :style="stageStyle">
				<div
					class="cell"
					v-for="cell in cells"
					:key="cell.key"
					:style="cellStyle(cell)"
					:class="{ hover: hoverKey === cell.key && dragging, taken: isTaken(cell) }"
					@dragover.prevent
					@dragenter.prevent="hoverKey = cell.key"
					@dragleave="onLeave(cell)"
					@drop.prevent="onDrop(cell)"
					@click="onDrop(cell)"
				>
					<img v-if="canDrop(cell)" class="ghost" :src="dragging.gif" alt="" />
				</div>

				<plantView v-for="p in planted" :key="p.uid" :plant="p" />
				<zombieView v-for="z in zombies" :key="z.uid" :zombie="z" />
				<img
					class="zw-bullet"
					v-for="b in bullets"
					:key="b.uid"
					:src="b.src"
					:style="bulletStyle(b)"
					alt=""
				/>
				<img
					class="zw-boom"
					v-for="bm in booms"
					:key="bm.uid"
					:src="bm.src"
					:style="boomStyle(bm)"
					alt=""
				/>
				<sunView v-for="s in suns" :key="s.uid" :sun="s" @collect="collectSun" />

				<div class="game-over" v-if="gameOver">
					<p>僵尸吃掉了你的脑子！</p>
					<button @click="resetGame">重新开始</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import cardBar from './components/cardBar.vue'
import plantView from './components/plant.vue'
import zombieView from './components/zombie.vue'
import sunView from './components/sun.vue'
import { STAGE_W, STAGE_H, LAWN } from './config'
import { sun, cards, planted, zombies, bullets, suns, booms, gameOver, plantAt, tryPlant, collectSun, startGame, stopGame, resetGame } from './utils'

let refStageWrap = ref()
let scale = ref(1)
let dragging = ref(null)
let hoverKey = ref('')

let cells = computed(() => {
	let list = []
	for (let row = 0; row < LAWN.rows; row++) {
		for (let col = 0; col < LAWN.cols; col++) {
			list.push({ row, col, key: `${row}-${col}` })
		}
	}
	return list
})

let stageStyle = computed(() => {
	return {
		width: STAGE_W + 'px',
		height: STAGE_H + 'px',
		transform: `translate(-50%, -50%) scale(${scale.value})`
	}
})

function cellStyle(cell) {
	return {
		width: LAWN.cellW + 'px',
		height: LAWN.cellH + 'px',
		left: LAWN.left + cell.col * LAWN.cellW + 'px',
		top: LAWN.top + cell.row * LAWN.cellH + 'px'
	}
}
function bulletStyle(b) {
	return {
		left: b.x + 'px',
		top: b.y + 'px',
		zIndex: 100 + b.row * 10 + 8
	}
}
function boomStyle(bm) {
	return {
		left: bm.x + 'px',
		top: bm.y + 'px'
	}
}

function isTaken(cell) {
	return !!plantAt(cell.row, cell.col)
}
function canDrop(cell) {
	return dragging.value && hoverKey.value === cell.key && !isTaken(cell) && sun.value >= dragging.value.cost
}

function onDrag(card) {
	dragging.value = card
}
function onDragEnd() {
	dragging.value = null
	hoverKey.value = ''
}
function onLeave(cell) {
	if (hoverKey.value === cell.key) hoverKey.value = ''
}
function onDrop(cell) {
	if (!dragging.value) return
	tryPlant(dragging.value, cell.row, cell.col)
	onDragEnd()
}

function resize() {
	let el = refStageWrap.value
	if (!el) return
	scale.value = Math.min(el.clientWidth / STAGE_W, el.clientHeight / STAGE_H)
}
onMounted(() => {
	resize()
	window.addEventListener('resize', resize)
	startGame()
})
onUnmounted(() => {
	window.removeEventListener('resize', resize)
	stopGame()
})
</script>
<style lang="scss">
#app,
.zwdzjs {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.zwdzjs {
	background-color: #000;
	display: flex;
	flex-direction: column;
}
.top-bar {
	flex: none;
	display: flex;
	align-items: stretch;
	.sun-counter {
		flex: none;
		width: 130px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		background: #4a2c10;
		border-right: 4px solid #3a2008;
		color: #ffe08a;
		font-size: 20px;
		font-weight: bold;
		text-shadow: 1px 1px 2px #000;
		img {
			width: 32px;
			height: 32px;
		}
	}
}
.stage-wrap {
	flex: 1;
	position: relative;
	overflow: hidden;
}
.stage {
	position: absolute;
	left: 50%;
	top: 50%;
	transform-origin: center center;
	background: #000 url(/images/interface/background1.jpg) no-repeat;
	background-size: 100% 100%;
}
.cell {
	position: absolute;
	&.hover {
		background: rgba(255, 255, 255, 0.22);
		box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
	}
}
.ghost {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	max-width: 70px;
	max-height: 80px;
	opacity: 0.55;
	pointer-events: none;
}
.zw-bullet {
	position: absolute;
	width: 30px;
	transform: translate(-50%, -50%);
	pointer-events: none;
}
.zw-boom {
	position: absolute;
	width: 170px;
	transform: translate(-50%, -75%);
	pointer-events: none;
	z-index: 400;
}
.game-over {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 600;
	padding: 40px 60px;
	text-align: center;
	background: rgba(0, 0, 0, 0.75);
	border: 3px solid #8a5326;
	border-radius: 12px;
	p {
		font-size: 34px;
		font-weight: bold;
		color: #ff5f4a;
		text-shadow: 2px 2px 4px #000;
	}
	button {
		margin-top: 24px;
		padding: 10px 28px;
		font-size: 18px;
		color: #fff;
		background: #8a5326;
		border: 2px solid #e6d3a3;
		border-radius: 8px;
		cursor: pointer;
		&:hover {
			background: #a3652f;
		}
	}
}
</style>
