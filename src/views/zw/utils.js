import { ref, computed } from 'vue'
export function uid() {
	let u = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 10; i++) {
		u += characters.charAt(Math.floor(Math.random() * 62))
	}
	return u
}
export let waitPlant = ref({
    level: 1
})
export let dragging = ref({})
export let action = ref(0)
export let level = computed(() => {
    return Math.min(7, action.value)
})
// row 行，col：列
export let plants = ref([
	{
		row: 0,
		col: 0,
		level: 1,
        show: false,
		uid: uid()
	},
	{
		row: 0,
		col: 1,
		level: 1,
		uid: uid()
	},
    {
		row: 1,
		col: 0,
		level: 1,
        show: false,
		uid: uid()
	},
	{
		row: 1,
		col: 1,
		level: 1,
		uid: uid()
	},
    {
		row: 2,
		col: 0,
		level: 1,
        show: false,
		uid: uid()
	},
	{
		row: 2,
		col: 1,
		level: 1,
		uid: uid()
	},
    {
		row: 3,
		col: 0,
		level: 1,
        show: false,
		uid: uid()
	},
	{
		row: 3,
		col: 1,
		level: 1,
		uid: uid()
	},
    {
		row: 4,
		col: 0,
		level: 1,
        show: false,
		uid: uid()
	},
	{
		row: 4,
		col: 1,
		level: 1,
		uid: uid()
	}
])
export function randomInt(n) {
    return Math.floor(Math.random() * n)
}
export let zombies = ref([])
genZombie()
export function genZombie() {
    let zs = Array.from(new Set([randomInt(5), randomInt(5), randomInt(5)]))
    for(let i = 0; i < zs.length; i++) {
        let lv = randomInt(level.value) + 1
        zombies.value.push({
            row: zs[i],
            col: 7,
            dead: false,
            level: lv,
            blood: Math.pow(2, lv - 1),
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
    console.log('---', power)
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
				bullets.value = bullets.value.filter((_, index) => index != bulletIndex)
			} else {
				// 子弹能量有剩余
                removeZombie(zombie)
				bullet.power = bullet.power - zombie.blood
			}
		}
	})
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
		if (zombie.col <= 0) {
			alert('🧟‍♂️吃掉了你的🧠！')
            location.reload()
			break
		} else {
            zombie.col --
        }
	}
}
