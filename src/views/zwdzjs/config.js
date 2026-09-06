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

/** 卡槽数量：开局最多选这么多个植物上场 */
export const MAX_PICK = 9

/** 开局阳光（调试/爽玩用，改这里即可） */
export const START_SUN = 1000000

/** 卡片是否需要冷却时间，false = 可以一直种 */
export const ENABLE_CD = false

/**
 * 全部可选植物（开局从中挑 9 个）
 * hp 血量（僵尸啃食 dps=100）   cd 卡槽冷却(秒)   cost 阳光消耗
 * interval 攻击间隔(秒)   attack 伤害
 */
export let allPlants = [
	{
		name: 'SunFlower', cname: '向日葵', desc: '每 24 秒产出 25 阳光',
		card: '/images/Card/Plants/SunFlower.png', gif: '/images/Plants/SunFlower/0.gif',
		cost: 50, cd: 7.5, hp: 300, produce: 24, sunValue: 25
	},
	{
		name: 'Peashooter', cname: '豌豆射手', desc: '单线射击，每发 20 伤害',
		card: '/images/Card/Plants/Peashooter.png', gif: '/images/Plants/Peashooter/0.gif',
		cost: 100, cd: 7.5, hp: 300, interval: 1.4, attack: 20
	},
	{
		name: 'SnowPea', cname: '寒冰射手', desc: '冰豌豆命中后减速',
		card: '/images/Card/Plants/SnowPea.png', gif: '/images/Plants/SnowPea/0.gif',
		cost: 175, cd: 7.5, hp: 300, interval: 1.4, attack: 20, slow: true
	},
	{
		name: 'Repeater', cname: '双发射手', desc: '一次连发两颗豌豆',
		card: '/images/Card/Plants/Repeater.png', gif: '/images/Plants/Repeater/0.gif',
		cost: 200, cd: 7.5, hp: 300, interval: 1.4, attack: 20, shots: 2
	},
	{
		name: 'Threepeater', cname: '三线射手', desc: '同时攻击相邻三行',
		card: '/images/Card/Plants/Threepeater.png', gif: '/images/Plants/Threepeater/0.gif',
		cost: 300, cd: 7.5, hp: 300, interval: 1.5, attack: 20, three: true
	},
	{
		name: 'WallNut', cname: '坚果墙', desc: '4000 血肉盾',
		card: '/images/Card/Plants/WallNut.png', gif: '/images/Plants/WallNut/0.gif',
		cost: 50, cd: 30, hp: 4000
	},
	{
		name: 'TallNut', cname: '高坚果', desc: '8000 血超级肉盾',
		card: '/images/Card/Plants/TallNut.png', gif: '/images/Plants/TallNut/0.gif',
		cost: 125, cd: 30, hp: 8000
	},
	{
		name: 'PotatoMine', cname: '土豆雷', desc: '埋设 14 秒后炸掉踩中的僵尸',
		card: '/images/Card/Plants/PotatoMine.png', gif: '/images/Plants/PotatoMine/0.gif',
		cost: 25, cd: 30, hp: 300, armTime: 14, attack: 1800
	},
	{
		name: 'Squash', cname: '窝瓜', desc: '压扁踩到它的僵尸，一次性',
		card: '/images/Card/Plants/Squash.png', gif: '/images/Plants/Squash/0.gif',
		cost: 50, cd: 30, hp: 300, armTime: 1, attack: 1800
	},
	{
		name: 'CherryBomb', cname: '樱桃炸弹', desc: '种下 1.2 秒后炸掉 3x3 范围',
		card: '/images/Card/Plants/CherryBomb.png', gif: '/images/Plants/CherryBomb/0.gif',
		cost: 150, cd: 50, hp: 9999, boomDelay: 1.2, attack: 1800
	},
	{
		name: 'Jalapeno', cname: '火爆辣椒', desc: '烧掉一整行的僵尸',
		card: '/images/Card/Plants/Jalapeno.png', gif: '/images/Plants/Jalapeno/0.gif',
		cost: 125, cd: 50, hp: 9999, boomDelay: 1.2, attack: 1800, rowBoom: true
	},
	{
		name: 'IceShroom', cname: '寒冰菇', desc: '全场僵尸冻结',
		card: '/images/Card/Plants/IceShroom.png', gif: '/images/Plants/IceShroom/0.gif',
		cost: 75, cd: 50, hp: 9999, boomDelay: 1, attack: 20, freeze: 8
	},
	{
		name: 'Chomper', cname: '大嘴花', desc: '一口吞掉一只僵尸，之后咀嚼 20 秒',
		card: '/images/Card/Plants/Chomper.png', gif: '/images/Plants/Chomper/0.gif',
		cost: 150, cd: 7.5, hp: 300, chewTime: 20
	},
	{
		name: 'Torchwood', cname: '火炬树桩', desc: '穿过的豌豆变火豆，伤害翻倍',
		card: '/images/Card/Plants/Torchwood.png', gif: '/images/Plants/Torchwood/0.gif',
		cost: 175, cd: 7.5, hp: 300
	},
	{
		name: 'Spikeweed', cname: '地刺', desc: '持续伤害踩过它的僵尸',
		card: '/images/Card/Plants/Spikeweed.png', gif: '/images/Plants/Spikeweed/0.gif',
		cost: 100, cd: 7.5, hp: 300, spikeDps: 40
	}
]

/** 默认上场的 9 个植物（名字保持从左到右的顺序就是卡槽顺序） */
export let defaultPick = [
	'SunFlower', 'Peashooter', 'SnowPea', 'Repeater', 'WallNut',
	'PotatoMine', 'CherryBomb', 'Chomper', 'Torchwood'
]

/** 子弹素材 */
export let bulletSrc = {
	pea: '/images/Plants/PB00.gif',
	snow: '/images/Plants/PB-10.gif',
	fire: '/images/Plants/PB10.gif'
}

/** 爆炸/特效素材 */
export let boomSrc = {
	cherry: '/images/Plants/CherryBomb/Boom.gif',
	mine: '/images/Plants/PotatoMine/ExplosionSpudow.gif',
	jalapeno: '/images/Plants/Jalapeno/JalapenoAttack.gif',
	ice: '/images/Plants/IceShroom/Snow.gif',
	squash: '/images/Plants/Squash/SquashAttack.gif'
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
