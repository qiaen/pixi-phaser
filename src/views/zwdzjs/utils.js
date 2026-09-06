import { ref } from 'vue'
import { LAWN, STAGE_W, MAX_PICK, allPlants, defaultPick, bulletSrc, boomSrc, zombieTypes } from './config'

let uid = 0
export function nextUid() {
	return ++uid
}
export function randomInt(n) {
	return Math.floor(Math.random() * n)
}

// ---------------- 全局状态 ----------------
export let sun = ref(50)
export let planted = ref([])
export let zombies = ref([])
export let bullets = ref([])
export let suns = ref([])
export let booms = ref([])
export let gameOver = ref(false)
/** 是否已选完植物开始游戏 */
export let started = ref(false)
/** 玩家选中的植物（按顺序即卡槽顺序） */
export let picked = ref([...defaultPick])
/** 卡槽（带冷却状态），开局时根据 picked 生成 */
export let cards = ref([])

export function togglePlant(name) {
	let index = picked.value.indexOf(name)
	if (index >= 0) {
		picked.value.splice(index, 1)
	} else if (picked.value.length < MAX_PICK) {
		picked.value.push(name)
	}
}

// ---------------- 坐标工具 ----------------
export function cellCenter(col) {
	return LAWN.left + col * LAWN.cellW + LAWN.cellW / 2
}
export function cellBottom(row) {
	return LAWN.top + (row + 1) * LAWN.cellH
}
export function plantAt(row, col) {
	return planted.value.find(item => item.row === row && item.col === col)
}

// ---------------- 种植 ----------------
export function tryPlant(card, row, col) {
	if (gameOver.value || sun.value < card.cost || card.cd > 0) return false
	if (plantAt(row, col)) return false
	sun.value -= card.cost
	card.cd = card.cdMax
	planted.value.push({
		uid: nextUid(),
		name: card.name,
		cname: card.cname,
		row,
		col,
		x: cellCenter(col),
		y: cellBottom(row),
		timer: 0,
		state: '',
		dead: false,
		...card,
		maxHp: card.hp
	})
	return true
}
function removePlant(p) {
	planted.value = planted.value.filter(item => item !== p)
}

// ---------------- 僵尸 ----------------
function hurtZombie(z, dmg) {
	if (z.dead) return
	z.hp -= dmg
	if (z.hp <= 0) {
		z.dead = true
		z.deadTimer = 0
	}
}
function spawnZombie() {
	// 40 秒后开始混入路障僵尸
	let type = gameTime > 40 && Math.random() < 0.35 ? zombieTypes[1] : zombieTypes[0]
	let row = randomInt(LAWN.rows)
	zombies.value.push({
		uid: nextUid(),
		...type,
		maxHp: type.hp,
		row,
		x: STAGE_W + 40,
		y: cellBottom(row),
		eating: null,
		slowTimer: 0,
		freezeTimer: 0,
		deadTimer: 0,
		dead: false
	})
}

// ---------------- 阳光 ----------------
function genSun(x, y, targetY, value = 25) {
	suns.value.push({ uid: nextUid(), x, y, targetY, value, life: 10 })
}
export function collectSun(s) {
	sun.value += s.value
	suns.value = suns.value.filter(item => item !== s)
}

// ---------------- 爆炸 / 范围伤害 ----------------
function explode(x, y, row, colRadius, rowRadius, damage, src, w = 170) {
	booms.value.push({ uid: nextUid(), x, y, src, w, life: 0.9 })
	let col = Math.round((x - LAWN.left - LAWN.cellW / 2) / LAWN.cellW)
	for (let z of [...zombies.value]) {
		if (z.dead) continue
		let zCol = Math.round((z.x - LAWN.left - LAWN.cellW / 2) / LAWN.cellW)
		if (Math.abs(zCol - col) <= colRadius && Math.abs(z.row - row) <= rowRadius) {
			hurtZombie(z, damage)
		}
	}
}

// ---------------- 各系统 tick ----------------
function tickCards(dt) {
	for (let card of cards.value) {
		if (card.cd > 0) card.cd = Math.max(0, card.cd - dt)
	}
}

function tickBooms(dt) {
	for (let b of [...booms.value]) {
		b.life -= dt
		if (b.life <= 0) booms.value = booms.value.filter(item => item !== b)
	}
}

function tickSuns(dt) {
	for (let s of [...suns.value]) {
		if (s.y < s.targetY) {
			s.y = Math.min(s.targetY, s.y + 45 * dt)
		}
		s.life -= dt
		if (s.life <= 0) suns.value = suns.value.filter(item => item !== s)
	}
}

function fireBullet(plant, type, row = plant.row) {
	bullets.value.push({
		uid: nextUid(),
		row,
		x: plant.x + 20,
		y: cellBottom(row) - 55,
		speed: 330,
		attack: plant.attack,
		type,
		src: bulletSrc[type]
	})
}

/** 这一行（或这些行）右侧有没有僵尸 */
function hasZombieAt(rows, x) {
	return zombies.value.some(z => !z.dead && rows.includes(z.row) && z.x > x - 20 && z.x < STAGE_W + 60)
}

function tickPlants(dt) {
	for (let p of [...planted.value]) {
		switch (p.name) {
			case 'SunFlower': {
				p.timer += dt
				if (p.timer >= p.produce) {
					p.timer = 0
					genSun(p.x + 15 + randomInt(30), p.y - 130, p.y - 20, p.sunValue)
				}
				break
			}
			case 'Peashooter':
			case 'SnowPea':
			case 'Repeater':
			case 'Threepeater': {
				let rows = p.three ? [p.row - 1, p.row, p.row + 1].filter(r => r >= 0 && r < LAWN.rows) : [p.row]
				if (!hasZombieAt(rows, p.x)) break
				p.timer += dt
				if (p.timer >= p.interval) {
					p.timer = 0
					for (let r of rows) fireBullet(p, p.slow ? 'snow' : 'pea', r)
					if (p.shots === 2) {
						setTimeout(() => {
							if (planted.value.includes(p)) fireBullet(p, 'pea')
						}, 150)
					}
				}
				break
			}
			case 'PotatoMine':
			case 'Squash': {
				if (p.state !== 'armed') {
					p.timer += dt
					if (p.timer >= p.armTime) p.state = 'armed'
				} else {
					let z = zombies.value.find(z => !z.dead && z.row === p.row && Math.abs(z.x - p.x) < 50)
					if (z) {
						explode(p.x, p.y, p.row, 0, 0, p.attack, p.name === 'Squash' ? boomSrc.squash : boomSrc.mine, 220)
						removePlant(p)
					}
				}
				break
			}
			case 'CherryBomb': {
				p.timer += dt
				if (p.timer >= p.boomDelay) {
					explode(p.x, p.y, p.row, 1, 1, p.attack, boomSrc.cherry)
					removePlant(p)
				}
				break
			}
			case 'Jalapeno': {
				p.timer += dt
				if (p.timer >= p.boomDelay) {
					// 整行灼烧
					explode(LAWN.left + (LAWN.cols * LAWN.cellW) / 2, p.y, p.row, LAWN.cols, 0, p.attack, boomSrc.jalapeno, 1000)
					removePlant(p)
				}
				break
			}
			case 'IceShroom': {
				p.timer += dt
				if (p.timer >= p.boomDelay) {
					booms.value.push({
						uid: nextUid(),
						x: LAWN.left + (LAWN.cols * LAWN.cellW) / 2,
						y: LAWN.top + (LAWN.rows * LAWN.cellH) / 2,
						src: boomSrc.ice,
						w: 1300,
						life: 1.2
					})
					for (let z of zombies.value) {
						if (z.dead) continue
						hurtZombie(z, p.attack)
						z.freezeTimer = p.freeze
					}
					removePlant(p)
				}
				break
			}
			case 'Chomper': {
				if (p.state === 'chew') {
					p.timer += dt
					if (p.timer >= p.chewTime) {
						p.state = ''
						p.timer = 0
					}
				} else {
					let z = zombies.value.find(z => !z.dead && z.row === p.row && z.x > p.x - 10 && z.x < p.x + 130)
					if (z) {
						hurtZombie(z, 9999)
						p.state = 'chew'
						p.timer = 0
					}
				}
				break
			}
			case 'Spikeweed': {
				for (let z of zombies.value) {
					if (z.dead || z.row !== p.row) continue
					if (Math.abs(z.x - p.x) < 45) hurtZombie(z, p.spikeDps * dt)
				}
				break
			}
		}
	}
}

function tickBullets(dt) {
	for (let b of [...bullets.value]) {
		b.x += b.speed * dt
		// 经过火炬树桩强化为火豆，伤害翻倍
		if (b.type !== 'fire') {
			let tw = planted.value.find(p => !p.dead && p.name === 'Torchwood' && p.row === b.row && Math.abs(b.x - p.x) < 40)
			if (tw) {
				b.type = 'fire'
				b.attack *= 2
				b.src = bulletSrc.fire
			}
		}
		for (let z of zombies.value) {
			if (z.dead || z.row !== b.row) continue
			if (b.x > z.x - 25 && b.x < z.x + 35) {
				hurtZombie(z, b.attack)
				if (b.type === 'snow') z.slowTimer = 5
				bullets.value = bullets.value.filter(item => item !== b)
				break
			}
		}
	}
	bullets.value = bullets.value.filter(item => item.x < STAGE_W + 60)
}

const EAT_DPS = 100
function tickZombies(dt) {
	for (let z of [...zombies.value]) {
		if (z.dead) {
			z.deadTimer += dt
			if (z.deadTimer > 1.8) zombies.value = zombies.value.filter(item => item !== z)
			continue
		}
		if (z.freezeTimer > 0) {
			// 被寒冰菇冻住：不动也不吃
			z.freezeTimer -= dt
			continue
		}
		if (z.slowTimer > 0) z.slowTimer -= dt
		let col = Math.floor((z.x - LAWN.left) / LAWN.cellW)
		let p = plantAt(z.row, col)
		// 走到植物身边就开始啃
		if (p && z.x - p.x <= 32 && z.x > p.x) {
			z.eating = p
			p.hp -= EAT_DPS * dt
			if (p.hp <= 0) removePlant(p)
		} else {
			z.eating = null
			z.x -= z.speed * (z.slowTimer > 0 ? 0.5 : 1) * dt
		}
		if (z.x < LAWN.left - 60) gameOver.value = true
	}
}

function tickSpawn(dt) {
	// 天降阳光
	skySunTimer -= dt
	if (skySunTimer <= 0) {
		skySunTimer = 10
		genSun(LAWN.left + 60 + randomInt(LAWN.cols * LAWN.cellW - 120), -40, LAWN.top + 40 + randomInt(LAWN.rows * LAWN.cellH - 80))
	}
	// 僵尸：越到后面刷得越快
	spawnTimer -= dt
	if (spawnTimer <= 0) {
		spawnTimer = Math.max(4, 12 - gameTime / 20)
		spawnZombie()
	}
}

// ---------------- 主循环 ----------------
let lastTime = 0
let rafId = 0
let gameTime = 0
let skySunTimer = 4
let spawnTimer = 8

function loop(t) {
	if (!lastTime) lastTime = t
	let dt = Math.min((t - lastTime) / 1000, 0.1)
	lastTime = t
	gameTime += dt
	if (!gameOver.value) {
		tickCards(dt)
		tickBooms(dt)
		tickSuns(dt)
		tickPlants(dt)
		tickBullets(dt)
		tickZombies(dt)
		tickSpawn(dt)
	}
	rafId = requestAnimationFrame(loop)
}

function resetState() {
	sun.value = 50
	planted.value = []
	zombies.value = []
	bullets.value = []
	suns.value = []
	booms.value = []
	gameOver.value = false
	cards.value.forEach(card => (card.cd = 0))
	gameTime = 0
	skySunTimer = 4
	spawnTimer = 8
}

/** 选完植物后开始游戏 */
export function startGame() {
	cards.value = picked.value.map(name => {
		let plant = allPlants.find(item => item.name === name)
		return { ...plant, cd: 0, cdMax: plant.cd }
	})
	resetState()
	started.value = true
	lastTime = 0
	rafId = requestAnimationFrame(loop)
}

/** 重新开始当前这局（沿用已选植物） */
export function resetGame() {
	resetState()
}

/** 回到选植物界面 */
export function backToPick() {
	cancelAnimationFrame(rafId)
	resetState()
	started.value = false
}

export function stopGame() {
	cancelAnimationFrame(rafId)
}
