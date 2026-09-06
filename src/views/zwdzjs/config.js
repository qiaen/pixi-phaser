/** 舞台尺寸，与 background1.jpg 原始尺寸一致 */
export const STAGE_W = 1400
export const STAGE_H = 600

/** 草坪网格：9 列 x 5 行，坐标基于舞台（1400x600）坐标系 */
export const LAWN = {
	cols: 9,
	rows: 5,
	left: 253,
	top: 80,
	cellW: 81,
	cellH: 96
}

/**
 * 植物卡与植物属性
 * hp 血量（僵尸啃食 dps=100）  cd 卡槽冷却(秒)  interval 攻击间隔(秒)  attack 单发伤害
 */
export let plantCards = [
	{
		name: 'SunFlower', cname: '向日葵',
		card: '/images/Card/Plants/SunFlower.png', gif: '/images/Plants/SunFlower/0.gif',
		cost: 50, cd: 7.5,
		hp: 300, produce: 24, sunValue: 25
	},
	{
		name: 'Peashooter', cname: '豌豆射手',
		card: '/images/Card/Plants/Peashooter.png', gif: '/images/Plants/Peashooter/0.gif',
		cost: 100, cd: 7.5,
		hp: 300, interval: 1.4, attack: 20
	},
	{
		name: 'SnowPea', cname: '寒冰射手',
		card: '/images/Card/Plants/SnowPea.png', gif: '/images/Plants/SnowPea/0.gif',
		cost: 175, cd: 7.5,
		hp: 300, interval: 1.4, attack: 20, slow: true
	},
	{
		name: 'Repeater', cname: '双发射手',
		card: '/images/Card/Plants/Repeater.png', gif: '/images/Plants/Repeater/0.gif',
		cost: 200, cd: 7.5,
		hp: 300, interval: 1.4, attack: 20, shots: 2
	},
	{
		name: 'WallNut', cname: '坚果墙',
		card: '/images/Card/Plants/WallNut.png', gif: '/images/Plants/WallNut/0.gif',
		cost: 50, cd: 30,
		hp: 4000
	},
	{
		name: 'PotatoMine', cname: '土豆雷',
		card: '/images/Card/Plants/PotatoMine.png', gif: '/images/Plants/PotatoMine/0.gif',
		cost: 25, cd: 30,
		hp: 300, armTime: 14, attack: 1800
	},
	{
		name: 'CherryBomb', cname: '樱桃炸弹',
		card: '/images/Card/Plants/CherryBomb.png', gif: '/images/Plants/CherryBomb/0.gif',
		cost: 150, cd: 50,
		hp: 9999, boomDelay: 1.2, attack: 1800
	},
	{
		name: 'Chomper', cname: '大嘴花',
		card: '/images/Card/Plants/Chomper.png', gif: '/images/Plants/Chomper/0.gif',
		cost: 150, cd: 7.5,
		hp: 300, chewTime: 20
	},
	{
		name: 'Torchwood', cname: '火炬树桩',
		card: '/images/Card/Plants/Torchwood.png', gif: '/images/Plants/Torchwood/0.gif',
		cost: 175, cd: 7.5,
		hp: 300
	}
]

/** 子弹素材 */
export let bulletSrc = {
	pea: '/images/Plants/PB00.gif',
	snow: '/images/Plants/PB-10.gif',
	fire: '/images/Plants/PB10.gif'
}

/** 爆炸素材：樱桃炸弹 3x3 / 土豆雷单格 */
export let boomSrc = {
	cherry: '/images/Plants/CherryBomb/Boom.gif',
	mine: '/images/Plants/PotatoMine/ExplosionSpudow.gif'
}

/** 僵尸类型 */
export let zombieTypes = [
	{
		name: 'Zombie', cname: '普通僵尸',
		src: '/images/Zombies/Zombie/0.gif',
		attackSrc: '/images/Zombies/Zombie/ZombieAttack.gif',
		dieSrc: '/images/Zombies/Zombie/ZombieDie.gif',
		hp: 200, speed: 14
	},
	{
		name: 'ConeheadZombie', cname: '路障僵尸',
		src: '/images/Zombies/ConeheadZombie/0.gif',
		attackSrc: '/images/Zombies/ConeheadZombie/ConeheadZombieAttack.gif',
		dieSrc: '/images/Zombies/Zombie/ZombieDie.gif',
		hp: 560, speed: 14
	}
]
