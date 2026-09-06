<template>
	<div class="zwdzjs">
		<pickPlants v-if="!started" />
		<div class="top-bar" v-if="started">
			<div class="sun-box">
				<div class="sun-counter">
					<img src="/images/interface/Sun.gif" alt="" />
					<span>{{ sun }}</span>
				</div>
				<div class="auto-sun" :class="{ on: autoSun }" @click="autoSun = !autoSun">
					<span>自动收集 {{ autoSun ? '开' : '关' }}</span>
				</div>
			</div>
			<cardBar :cards="cards" :sun="sun" :selected="dragging && dragging.name" @drag="onDrag" @dragend="onDragEnd" />
			<div class="shovel" :class="{ on: shoveling }" title="铲除植物" @click="toggleShovel">
				<img src="/images/interface/Shovel/0.gif" alt="铲子" />
			</div>
		</div>
		<div class="stage-wrap" v-if="started" ref="refStageWrap">
			<div class="stage" :class="{ shoveling }" :style="stageStyle">
				<div
					class="cell"
					v-for="cell in cells"
					:key="cell.key"
					:style="cellStyle(cell)"
					:class="{ hover: canDrop(cell), dig: shoveling && isTaken(cell), taken: isTaken(cell) }"
					@dragover.prevent
					@dragenter.prevent="hoverKey = cell.key"
					@dragleave="onLeave(cell)"
					@drop.prevent="onDrop(cell)"
					@click="onCellClick(cell)"
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
					<img class="zombies-won" src="/images/interface/ZombiesWon.png" alt="Zombies Won" />
					<div class="over-btns">
						<button @click="resetGame">重新开始</button>
						<button @click="backToPick">重新选植物</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import cardBar from './components/cardBar.vue'
import plantView from './components/plant.vue'
import zombieView from './components/zombie.vue'
import sunView from './components/sun.vue'
import pickPlants from './components/pickPlants.vue'
import { STAGE_W, STAGE_H, LAWN } from './config'
import { sun, cards, planted, zombies, bullets, suns, booms, gameOver, started, autoSun, plantAt, tryPlant, shovelPlant, collectSun, stopGame, resetGame, backToPick } from './utils'

let refStageWrap = ref()
let scale = ref(1)
let dragging = ref(null)
let hoverKey = ref('')
let shoveling = ref(false)

function toggleShovel() {
	shoveling.value = !shoveling.value
	if (shoveling.value) onDragEnd()
}

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
		top: bm.y + 'px',
		width: (bm.w || 170) + 'px'
	}
}

function isTaken(cell) {
	return !!plantAt(cell.row, cell.col)
}
function canDrop(cell) {
	return !!dragging.value && !shoveling.value && hoverKey.value === cell.key && !isTaken(cell) && sun.value >= dragging.value.cost
}
/** 格子点击：铲子模式下铲除，否则种下已选植物 */
function onCellClick(cell) {
	if (shoveling.value) {
		shovelPlant(cell.row, cell.col)
		shoveling.value = false
		return
	}
	onDrop(cell)
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
	window.addEventListener('resize', resize)
})
onUnmounted(() => {
	window.removeEventListener('resize', resize)
	stopGame()
})
// 选完植物进入游戏后，舞台才挂载，需要重新算一次缩放
watch(started, val => {
	if (val) nextTick(resize)
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
	.sun-box {
		flex: none;
		width: 160px;
		display: flex;
		flex-direction: column;
		background: #4a2c10;
		border-right: 4px solid #3a2008;
	}
	.sun-counter {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 0 12px;
		color: #ffe08a;
		font-size: 20px;
		font-weight: bold;
		text-shadow: 1px 1px 2px #000;
		img {
			width: 32px;
			height: 32px;
		}
	}
	.auto-sun {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		color: #b9a88a;
		background: #3a2008;
		border-top: 2px solid #2a1a08;
		cursor: pointer;
		user-select: none;
		&:hover {
			color: #e6d3a3;
			background: #5f3814;
		}
		&.on {
			color: #ffe08a;
			background: #6b4a12;
		}
	}
	.shovel {
		flex: none;
		width: 92px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #4a2c10;
		border-left: 4px solid #3a2008;
		cursor: pointer;
		user-select: none;
		img {
			width: 64px;
			height: 40px;
			object-fit: contain;
		}
		&:hover {
			background: #5f3814;
		}
		&.on {
			background: #8a5326;
			box-shadow: inset 0 0 0 3px #ffd76a;
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
	padding: 24px 60px 36px;
	text-align: center;
	background: rgba(0, 0, 0, 0.6);
	border: 3px solid #8a5326;
	border-radius: 12px;
	.zombies-won {
		display: block;
		max-width: 500px;
	}
	.over-btns {
		margin-top: 24px;
		display: flex;
		justify-content: center;
		gap: 16px;
	}
	button {
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
