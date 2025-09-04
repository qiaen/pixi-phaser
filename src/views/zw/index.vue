<template>
	<audio autoplay="true" loop ref="refBgAudio">
		<source src="/zw/bg.mp3" type="audio/mpeg" />
	</audio>
	<audio autoplay="true" id="refBombAudio" volume="0.4">
		<source src="/zw/bz.mp3" type="audio/mpeg" />
	</audio>
	<div class="game-box" :class="{ isFail }">
		<div class="top-info">
			<div class="card">
				<img @drag="dragCard" draggable :src="`/zw/lv-${waitPlant.level}.gif`" />
				<div>{{ Math.pow(2, waitPlant.level - 1) }}</div>
			</div>
			<div class="score-box">
				<scrollNumber :number="score" color="#fff"></scrollNumber>
			</div>
		</div>
		<div class="ground">
			<Plant @fire="shot" :data="item" v-for="item in plants" :key="item.uid" />
			<Bullet :data="item" v-for="item in bullets" :key="item.uid" />
			<Zombie :data="item" v-for="item in zombies" :key="item.uid" />
		</div>
	</div>

	<img v-if="isFail" class="zombies-won" src="./images/interface/ZombiesWon.png" alt="" />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Plant from './plant.vue'
import Bullet from './bullet.vue'
import Zombie from './zombie.vue'
import scrollNumber from './components/scrollNumber.vue'
import { isFail, score, plants, waitPlant, dragging, zombies, bullets, uid, aniBullet, action, level, aniZoombies, randomInt, genZombie } from './utils'

function shot() {
	action.value += 1
	for (let i = 0; i < 5; i++) {
		let rowPlants = plants.value.filter(item => item.row === i && item.show)
		if (rowPlants.length) {
			let fp = rowPlants[0]?.level
			let lp = rowPlants[1]?.level
			let power = 0
			if (fp) {
				power += Math.pow(2, fp - 1)
			}
			if (lp) {
				power += Math.pow(2, lp - 1)
			}
			bullets.value.push({
				row: rowPlants[0]?.row || rowPlants[1]?.row || 0,
				x: 330,
				power: power,
				uid: uid()
			})
		}
	}
	aniZoombies({
		row: 0,
		col: 0,
		level: 3,
		uid: uid()
	})
	aniBullet()
	waitPlant.value.level = randomInt(level.value) + 1
	waitPlant.value.uid = uid()
	genZombie()
}
let zLeft = ref(360)
function zombieRun() {
	zLeft.value = zLeft.value - 20
	setTimeout(() => {
		if (zLeft.value > 270) {
			zombieRun()
		}
	}, 500)
}
function dragCard() {
	dragging.value = {
		level: waitPlant.value.level,
		uid: uid()
	}
}
let isPlayBg = false
let refBgAudio = ref()
onMounted(() => {
	document.addEventListener('click', () => {
		if (!isPlayBg) {
			refBgAudio.value.play()
		}
	})
})
// zombieRun()
</script>
<style lang="scss">
.top-info {
	background-color: #8d4018;
	display: flex;
	.score-box {
		width: 200px;
		display: flex;
		align-items: center;
		padding-left: 20px;
	}
}
#app,
.game-box {
	width: 100%;
	height: 100%;
	background-color: #000;
}
.card {
	flex: 1;
	background: #8d4018 url(/zw/card-big.jpg) no-repeat;
	background-size: 200px;
	background-position: center;
	height: 139.09px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		display: block;
	}
}
.ground {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: url(./images/interface/background1.jpg) no-repeat;
}
.zombies-won {
	width: 498px;
	height: 439px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
