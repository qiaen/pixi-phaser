import { ref, computed } from 'vue'
import { LAWN, STAGE_W, MAX_PICK, START_SUN, ENABLE_CD, SAFE_COLS, TURN_ZOMBIE_RATE, allPlants, defaultPick, bulletSrc, boomSrc, zombieTypes, levels, boss } from './config'

let uid = 0
export function nextUid() {
	return ++uid
}
export function randomInt(n) {
	return Math.floor(Math.random() * n)
}

// ---------------- 全局状态 ----------------
export let sun = ref(START_SUN)
export let planted = ref([])
export let zombies = ref([])
export let bullets = ref([])
export let suns = ref([])
export let booms = ref([])
/** 每行一辆小推车 */
export let mowers = ref([])
export let gameOver = ref(false)
/** 当前关卡序号（从 0 开始） */
export let levelIndex = ref(0)
/** 本关是否已通关 */
export let levelClear = ref(false)
/** 全部关卡是否都通关了 */
export let allClear = ref(false)
/** 游戏进度 0~1，用于进度条 */
export let progress = ref(0)
/** 大波提示：'' | 'large' | 'final' */
export let waveBanner = ref('')

export let currentLevel = computed(() => levels[levelIndex.value])
/** 是否已选完植物开始游戏 */
export let started = ref(false)
/** 自动收集阳光开关 */
export let autoSun = ref(false)
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
/** 铲掉某个格子上的植物 */
export function shovelPlant(row, col) {
	let p = plantAt(row, col)
	if (!p) return false
	removePlant(p)
	return true
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
/** 僵尸只从当前关卡允许的种类里随机 */
function spawnZombie(x = STAGE_W + 40, row = randomInt(LAWN.rows)) {
	let pool = zombieTypes.filter(item => currentLevel.value.types.includes(item.name))
	let type = pool[randomInt(pool.length)]
	zombies.value.push({
		uid: nextUid(),
		...type,
		maxHp: type.hp,
		row,
		x,
		y: cellBottom(row),
		eating: null,
		slowTimer: 0,
		freezeTimer: 0,
		deadTimer: 0,
		dead: false
	})
}

/** 僵王登场：血厚、走得慢，会定期放出小僵尸，直接碾碎挡路的植物 */
function spawnBoss() {
	zombies.value.push({
		uid: nextUid(),
		...boss,
		name: boss.name,
		isBoss: true,
		row: boss.row,
		x: STAGE_W + 160,
		y: cellBottom(boss.row),
		hp: currentLevel.value.boss.hp,
		maxHp: currentLevel.value.boss.hp,
		speed: currentLevel.value.boss.speed,
		eating: null,
		slowTimer: 0,
		freezeTimer: 0,
		deadTimer: 0,
		dead: false,
		minionTimer: 6
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
		} else if (autoSun.value) {
			// 落地后自动收集
			collectSun(s)
			continue
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
	// BOSS 视作在所有行，任何一列的植物都会朝它开火
	return zombies.value.some(z => !z.dead && (z.isBoss || rows.includes(z.row)) && z.x > x - 20 && z.x < STAGE_W + 60)
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
					// 一轮连发，每发间隔 150ms
					let shots = p.shots || 1
					for (let i = 0; i < shots; i++) {
						let volley = () => {
							if (!planted.value.includes(p)) return
							for (let r of rows) fireBullet(p, p.slow ? 'snow' : 'pea', r)
						}
						if (i === 0) volley()
						else setTimeout(volley, i * 150)
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
						// BOSS 免疫冰冻
						if (!z.isBoss) z.freezeTimer = p.freeze
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
					// BOSS 吞不下
					let z = zombies.value.find(z => !z.dead && !z.isBoss && z.row === p.row && z.x > p.x - 10 && z.x < p.x + 130)
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
			if (z.dead) continue
			// BOSS 体型巨大，任意行打出的子弹只要飞到它身上都能命中
			let hit = z.isBoss ? b.x > z.x - 130 && b.x < z.x + 130 : z.row === b.row && b.x > z.x - 25 && b.x < z.x + 35
			if (hit) {
				hurtZombie(z, b.attack)
				if (b.type === 'snow' && !z.isBoss) z.slowTimer = 5
				bullets.value = bullets.value.filter(item => item !== b)
				break
			}
		}
	}
	bullets.value = bullets.value.filter(item => item.x < STAGE_W + 60)
}

/** 僵尸走到小推车处就触发，小推车一路向右碾平整行 */
const MOWER_SPEED = 700
function tickMowers(dt) {
	for (let m of mowers.value) {
		if (m.used) continue
		if (!m.running) {
			let z = zombies.value.find(item => !item.dead && item.row === m.row && item.x <= LAWN.left + 25)
			if (z) m.running = true
			continue
		}
		m.x += MOWER_SPEED * dt
		for (let z of zombies.value) {
			// 小推车撞不动 BOSS
			if (z.dead || z.isBoss || z.row !== m.row) continue
			if (z.x > m.x - 60 && z.x < m.x + 40) hurtZombie(z, 99999)
		}
		if (m.x > STAGE_W + 80) m.used = true
	}
}
/** 该行的小推车还在不在（不在的话僵尸冲进去就算输） */
function mowerAlive(row) {
	let m = mowers.value.find(item => item.row === row)
	return !!m && !m.used
}

const EAT_DPS = 100

/** BOSS：缓慢推进，碾碎挡路的植物，定期放出小僵尸 */
function tickBoss(z, dt) {
	z.x -= z.speed * dt
	// 走到哪一格就把那一格的植物碾碎
	for (let row = z.row - 1; row <= z.row + 1; row++) {
		let col = Math.floor((z.x - LAWN.left) / LAWN.cellW)
		let p = plantAt(row, col)
		if (p) removePlant(p)
	}
	// 定期放小僵尸
	z.minionTimer -= dt
	if (z.minionTimer <= 0) {
		z.minionTimer = 10
		z.attackTimer = 0.8
		spawnZombie(z.x + 40, randomInt(LAWN.rows))
	}
	if (z.attackTimer > 0) z.attackTimer -= dt
	if (z.x < LAWN.left + 60) gameOver.value = true
}

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
		if (z.isBoss) {
			tickBoss(z, dt)
			continue
		}
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
		// 小推车还在的话，僵尸会先被推车解决，冲进房子才算输
		if (z.x < LAWN.left - 60 && !mowerAlive(z.row)) gameOver.value = true
	}
}

/** 计算本关进度 0~1（有 BOSS 的关卡按 BOSS 血量算） */
function updateProgress() {
	let level = currentLevel.value
	if (level.boss) {
		if (!bossSpawned) {
			progress.value = Math.min(0.3, (gameTime / level.boss.at) * 0.3)
		} else {
			let alive = zombies.value.find(z => z.isBoss && !z.dead)
			let ratio = alive ? 1 - alive.hp / alive.maxHp : 1
			progress.value = Math.min(1, 0.3 + 0.7 * ratio)
		}
	} else {
		progress.value = Math.min(1, gameTime / level.duration)
	}
}

function winLevel() {
	levelClear.value = true
	if (levelIndex.value >= levels.length - 1) allClear.value = true
}

function tickSpawn(dt) {
	let level = currentLevel.value
	// 天降阳光
	skySunTimer -= dt
	if (skySunTimer <= 0) {
		skySunTimer = 10
		genSun(LAWN.left + 60 + randomInt(LAWN.cols * LAWN.cellW - 120), -40, LAWN.top + 40 + randomInt(LAWN.rows * LAWN.cellH - 80))
	}
	// 关卡内僵尸刷新间隔由 spawn.from 递减到 spawn.to
	let interval = level.spawn.from + (level.spawn.to - level.spawn.from) * progress.value
	spawnTimer -= dt
	if (spawnTimer <= 0) {
		spawnTimer = interval
		spawnZombie()
	}
	// 大波僵尸
	if (level.bigWaveCount && !bigWaveDone && progress.value >= level.bigWave) {
		bigWaveDone = true
		waveBanner.value = 'large'
		bannerTimer = 2.5
		for (let i = 0; i < level.bigWaveCount; i++) {
			setTimeout(() => spawnZombie(STAGE_W + 40 + i * 60), i * 200)
		}
	}
	// BOSS 登场
	if (level.boss && !bossSpawned && gameTime >= level.boss.at) {
		bossSpawned = true
		waveBanner.value = 'final'
		bannerTimer = 2.5
		spawnBoss()
	}
	// 通关判定
	if (level.boss) {
		if (bossSpawned && !zombies.value.some(z => z.isBoss && !z.dead)) winLevel()
	} else if (gameTime >= level.duration) {
		winLevel()
	}
	// 提示横幅自动消失
	if (bannerTimer > 0) {
		bannerTimer -= dt
		if (bannerTimer <= 0) waveBanner.value = ''
	}
}

// ---------------- 主循环 ----------------
let lastTime = 0
let rafId = 0
let gameTime = 0
let skySunTimer = 4
let spawnTimer = 8
let bossSpawned = false
let bigWaveDone = false
let bannerTimer = 0

function loop(t) {
	if (!lastTime) lastTime = t
	let dt = Math.min((t - lastTime) / 1000, 0.1)
	lastTime = t
	if (!gameOver.value && !levelClear.value) {
		gameTime += dt
		tickCards(dt)
		tickBooms(dt)
		tickSuns(dt)
		tickPlants(dt)
		tickBullets(dt)
		tickMowers(dt)
		tickZombies(dt)
		tickSpawn(dt)
		updateProgress()
	}
	rafId = requestAnimationFrame(loop)
}

function resetState() {
	sun.value = START_SUN
	planted.value = []
	zombies.value = []
	mowers.value = Array.from({ length: LAWN.rows }, (_, row) => ({
		uid: nextUid(),
		row,
		x: LAWN.left - 42,
		y: cellBottom(row),
		running: false,
		used: false
	}))
	bullets.value = []
	suns.value = []
	booms.value = []
	gameOver.value = false
	levelClear.value = false
	progress.value = 0
	waveBanner.value = ''
	cards.value.forEach(card => (card.cd = 0))
	gameTime = 0
	skySunTimer = 4
	spawnTimer = 8
	bossSpawned = false
	bigWaveDone = false
	bannerTimer = 0
}

/** 选完植物后从第一关开始 */
export function startGame() {
	cards.value = picked.value.map(name => {
		let plant = allPlants.find(item => item.name === name)
		return { ...plant, cd: 0, cdMax: ENABLE_CD ? plant.cd : 0 }
	})
	levelIndex.value = 0
	allClear.value = false
	resetState()
	started.value = true
	lastTime = 0
	rafId = requestAnimationFrame(loop)
}

/** 进入下一关 */
export function nextLevel() {
	if (levelIndex.value < levels.length - 1) levelIndex.value++
	resetState()
}

/** 重新开始当前这关（沿用已选植物） */
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
