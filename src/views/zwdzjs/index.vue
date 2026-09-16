<template>
	<div class="zwdzjs">
		<audio ref="refBgm" src="/zw/bg.mp3" loop></audio>
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
			<div class="music" :class="{ on: musicOn }" title="背景音乐" @click="toggleMusic">
				{{ musicOn ? '音乐开' : '音乐关' }}
			</div>
		</div>
		<div class="stage-wrap" v-if="started" ref="refStageWrap">
			<div class="stage" :class="{ shoveling }" :style="stageStyle" ref="refStage" @mousemove="onStageMove" @mouseleave="shovelPos.show = false">
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

				<!-- 家门口安全线 -->
				<div class="safe-line" :style="safeLineStyle">
					<span>家门口</span>
				</div>

				<plantView v-for="p in planted" :key="p.uid" :plant="p" />
				<mowerView v-for="m in aliveMowers" :key="m.uid" :mower="m" />
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

				<!-- 铲除模式下跟随光标的铲子 -->
				<img
					v-if="shoveling && shovelPos.show"
					class="shovel-cursor"
					src="/images/interface/Shovel/0.gif"
					alt=""
					:style="{ left: shovelPos.x + 'px', top: shovelPos.y + 'px' }"
				/>

				<!-- 大波/BOSS 提示 -->
				<img v-if="waveBanner === 'large'" class="wave-banner" src="/images/interface/LargeWave.gif" alt="一大波僵尸正在接近" />
				<img v-if="waveBanner === 'final'" class="wave-banner final" src="/images/interface/FinalWave.gif" alt="最后一波" />

				<!-- 关卡进度条 -->
				<progressMeter :progress="progress" :level-index="levelIndex" :total="levels.length" :level-name="currentLevel.name" />

				<!-- 失败 -->
				<div class="game-over" v-if="gameOver">
					<img class="zombies-won" src="/images/interface/ZombiesWon.png" alt="Zombies Won" />
					<div class="over-btns">
						<button @click="onResetGame">重打本关</button>
						<button @click="onBackToPick">重新选植物</button>
					</div>
				</div>

				<!-- 过关 / 通关 -->
				<div class="game-over win" v-if="levelClear">
					<img class="trophy" v-if="allClear" src="/images/interface/trophy.png" alt="通关" />
					<h2>{{ allClear ? '恭喜！全部关卡通关' : `第 ${levelIndex + 1} 关通过` }}</h2>
					<div class="over-btns">
						<button v-if="!allClear" class="primary" @click="nextLevel">进入下一关</button>
						<button v-if="!allClear" @click="onResetGame">重打本关</button>
						<button v-if="allClear" @click="onBackToPick">再玩一次</button>
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
import mowerView from './components/mower.vue'
import progressMeter from './components/progressMeter.vue'
import pickPlants from './components/pickPlants.vue'
import { STAGE_W, STAGE_H, LAWN, levels, SAFE_COLS } from './config'
import { sun, cards, planted, zombies, bullets, suns, booms, mowers, gameOver, started, autoSun, levelIndex, levelClear, allClear, progress, waveBanner, currentLevel, plantAt, tryPlant, shovelPlant, collectSun, stopGame, resetGame, nextLevel, backToPick } from './utils'

let refStageWrap = ref()
let refBgm = ref()
let scale = ref(1)
let dragging = ref(null)
let hoverKey = ref('')
let shoveling = ref(false)
let shovelPos = ref({ x: 0, y: 0, show: false })
let musicOn = ref(true)
let refStage = ref()

function toggleShovel() {
	shoveling.value = !shoveling.value
	shovelPos.value.show = false
	// 铲除模式和种植模式互斥
	if (shoveling.value) onDragEnd()
}
/** 光标在舞台内的坐标（舞台被 scale 缩放过，需要换算） */
function onStageMove(e) {
	if (!shoveling.value || !refStage.value) return
	let rect = refStage.value.getBoundingClientRect()
	shovelPos.value = {
		x: (e.clientX - rect.left) / scale.value,
		y: (e.clientY - rect.top) / scale.value,
		show: true
	}
}

/** 浏览器要求用户交互后才能播放，点"开始游戏"正好是交互 */
function playMusic() {
	let audio = refBgm.value
	if (!audio || !musicOn.value) return
	audio.volume = 0.4
	audio.play().catch(() => {})
}
function toggleMusic() {
	musicOn.value = !musicOn.value
	if (musicOn.value) playMusic()
	else refBgm.value && refBgm.value.pause()
}

/** 还没被用掉的小推车 */
let aliveMowers = computed(() => mowers.value.filter(m => !m.used))

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
/** 安全区（家门口）右边界，超出这条线的植物有变异风险 */
let safeLineStyle = computed(() => {
	return {
		left: LAWN.left + SAFE_COLS * LAWN.cellW + 'px',
		top: LAWN.top + 'px',
		height: LAWN.rows * LAWN.cellH + 'px'
	}
})

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
	// 选卡种植时自动收起铲子
	shoveling.value = false
	shovelPos.value.show = false
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
/** 退出铲除模式（Esc 或重开时用） */
function cancelShovel() {
	shoveling.value = false
	shovelPos.value.show = false
}
function onResetGame() {
	cancelShovel()
	onDragEnd()
	resetGame()
}
function onBackToPick() {
	cancelShovel()
	onDragEnd()
	backToPick()
}
function onKeydown(e) {
	if (e.key === 'Escape') cancelShovel()
}
onMounted(() => {
	window.addEventListener('resize', resize)
	window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
	window.removeEventListener('resize', resize)
	window.removeEventListener('keydown', onKeydown)
	stopGame()
	refBgm.value && refBgm.value.pause()
})
// 选完植物进入游戏后，舞台才挂载，需要重新算一次缩放；同时开始播放背景音乐
watch(started, val => {
	if (val) {
		nextTick(() => {
			resize()
			playMusic()
		})
	} else {
		refBgm.value && refBgm.value.pause()
	}
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
	.music {
		flex: none;
		width: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		color: #b9a88a;
		background: #3a2008;
		border-left: 2px solid #2a1a08;
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
	&.shoveling {
		cursor: none;
	}
}
.safe-line {
	position: absolute;
	border-right: 2px dashed rgba(255, 255, 255, 0.45);
	pointer-events: none;
	z-index: 90;
	span {
		position: absolute;
		left: 6px;
		bottom: 2px;
		font-size: 12px;
		font-weight: bold;
		color: rgba(255, 255, 255, 0.65);
		text-shadow: 1px 1px 2px #000;
		white-space: nowrap;
	}
}
.cell {
	position: absolute;
	&.hover {
		background: rgba(255, 255, 255, 0.22);
		box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
	}
	&.dig {
		background: rgba(255, 80, 60, 0.25);
		box-shadow: inset 0 0 0 2px rgba(255, 120, 90, 0.85);
	}
}
.shovel-cursor {
	position: absolute;
	width: 76px;
	height: 34px;
	object-fit: contain;
	transform: translate(-14px, -6px);
	pointer-events: none;
	z-index: 700;
	filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
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
.wave-banner {
	position: absolute;
	left: 50%;
	top: 42%;
	transform: translate(-50%, -50%);
	width: 320px;
	z-index: 550;
	pointer-events: none;
	&.final {
		width: 300px;
	}
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
	&.win {
		border-color: #6fd12b;
		h2 {
			font-size: 30px;
			color: #ffe08a;
			text-shadow: 2px 2px 4px #000;
		}
		.trophy {
			display: block;
			width: 260px;
			margin: 0 auto 10px;
		}
		button.primary {
			font-weight: bold;
			color: #173d06;
			background: linear-gradient(#b6e86a, #6fd12b);
			border-color: #4a2c10;
			&:hover {
				background: linear-gradient(#c9f284, #7de036);
			}
		}
	}
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
