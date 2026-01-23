import { ref, computed } from 'vue'
import { ListPlants, ListZombies } from './config'
export function uid() {
	let u = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 10; i++) {
		u += characters.charAt(Math.floor(Math.random() * 62))
	}
	return u
}
/** 当前进度，是生成植物和僵尸的准则，生成的植物和僵尸，围绕着，process上下2级别浮动 */
export let process = 0
/** 植物和僵尸的最大等级 */
let spriteLev = {
	zombie: ListPlants.length,
	plant: ListZombies.length
}
/** 该函数会根据传入的数字生成一个在其 ±2 范围内的随机整数，同时确保结果在 1 到 top 之间 */
function floatLevel(num, top) {
	let min = num - 2
	let max = num + 2
	min = Math.max(min, 0)
	max = Math.min(max, top)
	return Math.floor(Math.random() * (max - min + 1)) + min
}
export let score = ref(0)
export let isFail = ref(false)
export let waitPlant = ref(genPlant())



export let dragging = ref({})
export let action = ref(0)
let maxZombieLevel = 17

export let level = computed(() => {
	return Math.min(7, action.value)
})

export function randomInt(n) {
	return Math.floor(Math.random() * n)
}
export let zombies = ref([])
genZombie()
export function genPlant() {
	let index = floatLevel(process, spriteLev.plant)
	return {
		...ListPlants[index]
	}
}
/** 生成僵尸 */
export function genZombie() {
	if (zombies.value.some(item => item.level >= spriteLev.zombie)) {
		return console.log('已经到最大了，不再生成')
	}
	let zs = Array.from(new Set([randomInt(5), randomInt(5), randomInt(5)]))
	for (let i = 0; i < zs.length; i++) {
		let lv = floatLevel(process, spriteLev.zombie)
		let z = ListZombies[lv]
		zombies.value.push({
			row: zs[i],
			col: 7,
			dead: false,
			level: lv,
			...z,
			uid: uid()
		},)
	}
}
export let bullets = ref([])
export function aniBullet(bombAudio) {
	window.requestAnimationFrame(() => {
		bullets.value.forEach((item, bulletIndex) => {
			item.x = item.x += 4
			if (item.x > 900) {
				bullets.value = bullets.value.filter((_, index) => index !== bulletIndex)
			}
			collision(item, bulletIndex)
		})
		if (bullets.value.length) {
			aniBullet()
		}
	})
}
function collision(bullet, bulletIndex) {
	let { x, power } = bullet
	let thisScore = 0
	zombies.value.forEach((zombie, zombieIndex) => {
		let { col, blood } = zombie
		let left = 380 + col * 74
		if (x > left + 20 && bullet.row === zombie.row) {
			// 发生碰撞
			if (blood > power) {
				// 血量有剩余
				if (!zombie.action || zombie.action < action.value) {
					zombie.action = action.value
					zombie.blood -= power
					bullets.value = bullets.value.filter((_, index) => index != bulletIndex)
				}
			} else if (blood == power) {
				removeZombie(zombie)
				thisScore += blood
				bullets.value = bullets.value.filter((_, index) => index != bulletIndex)
			} else {
				thisScore += zombie.blood
				// 子弹能量有剩余
				removeZombie(zombie)
				bullet.power = bullet.power - zombie.blood
			}
		}
	})
	score.value += thisScore
}

function removeZombie(zombie) {

	zombie.dead = true
	document.querySelector('#refBombAudio').play()
	setTimeout(() => {
		zombies.value = zombies.value.filter(item => item.uid != zombie.uid)
	}, 2000)

}
let fail = ref(false)
/** 僵尸往前一步 */
export function aniZoombies() {
	for (let zombie of zombies.value) {
		if (zombie.col <= -3) {
			// alert('🧟‍♂️吃掉了你的🧠！')
			isFail.value = true
			// location.reload()
			break
		} else {
			zombie.col--
		}
	}
}
