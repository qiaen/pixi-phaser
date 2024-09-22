<template>
	<div id="police"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'
let { Game } = Phaser

function init() {
	let touX = 0
	let player = null
	let sky = null
	let trees = null
	let xiaotou = null
	let fenshu = 0
    let platforms = null
    let scoreText = ''
    let sudu = 120
    let shengao = 0.1
	let game = new Game({
		type: Phaser.AUTO,
		parent: 'police',
		width: window.innerWidth,
		height: 550,
		backgroundColor: '#304858',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {
					y: 300
				},
				// debug: true
			}
		},
		scene: {
			preload: function () {
				// key，图片地址，小图的宽度高度，数量，如果宽度高度，位置都不一样，那么需要xml或者json来描述
				this.load.spritesheet('police', '/img/police9191.png', {
					frameWidth: 130,
					frameHeight: 261
				})
				// key，图片地址，小图的宽度高度，数量，如果宽度高度，位置都不一样，那么需要xml或者json来描述
				this.load.image('xiaotou', '/img/xiaotou.png')
				// 512 × 296
				this.load.image('sky', '/img/ms3-sky.png')
				// 512 × 320
				this.load.image('trees', '/img/ms3-trees.png')
				this.load.on('start', () => {
					console.log(1)
				})
				this.load.on('complete', () => {
					console.log(2)
				})
                this.load.image('ground', '/img/platform.png')
			},
			create: function () {
                				// 512 × 296
				sky = this.add.tileSprite(0, 38, window.innerWidth, 296, 'sky').setOrigin(0, 0)
				// 512 × 320
				trees = this.add.tileSprite(0, 280, window.innerWidth, 320, 'trees').setOrigin(0, 0)
				player = this.physics.add.sprite(100, 450, 'police')
				xiaotou = this.physics.add.sprite(300, 450, 'xiaotou')
				player.scale = shengao
				xiaotou.scale = 0.3
				player.setCollideWorldBounds(true)
				xiaotou.setCollideWorldBounds(true)
				this.anims.create({
					key: 'walk',
					frames: this.anims.generateFrameNumbers('police', {
						start: 0,
						end: 7
					}),
					frameRate: 10,
					repeat: -1
				})
				function collectXiaotou(p1, x2) {
					fenshu += 1
                    sudu += 8
					console.log(fenshu)
                    shengao += 0.06
                    player.scale = shengao
                    scoreText.setText(`你抓到小偷: ${fenshu}次，速度提升${sudu}`)
					let { x, y } = randomXY()
					xiaotou.x = x
					xiaotou.y = y
				}
				this.physics.add.overlap(player, xiaotou, collectXiaotou, null, this)
                // 添加静态模块，指不会被玩家移动不受重力等因素影响的模块
				// platforms = this.physics.add.staticGroup()
				// platforms.create(700, 400, 'ground')
				// platforms.create(50, 230, 'ground')
				// platforms.create(950, 220, 'ground')

                // 碰撞器，使两个物体不会交集
				// this.physics.add.collider(player, platforms)
                // this.physics.add.collider(xiaotou, platforms)
                // 分数显示
				scoreText = this.add.text(16, 20, '你抓到小偷: 0次', {
					fontSize: '16px', fill: '#fff'
				})
			},
			update() {
				let cursor = this.input.keyboard.createCursorKeys()
				if (cursor.left.isDown) {
					player.flipX = 180
					player.setVelocityX(-sudu)
					player.anims.play('walk', true)
					// 每帧率持续调用
					sky.tilePositionX -= 0.1
					trees.tilePositionX -= 0.5
				} else if (cursor.right.isDown) {
					player.flipX = 0
					player.setVelocityX(sudu)
					player.anims.play('walk', true)
					// 每帧率持续调用
					sky.tilePositionX += 0.1
					trees.tilePositionX += 0.5
				} else if (cursor.up.isDown) {
					player.setVelocityY(-300)
				} else {
					player.setVelocityX(0)
				}
			}
		}
	})
}
function randomXY() {
	return {
		x: window.innerWidth * Math.random(),
		y: window.innerHeight * Math.random()
	}
}
onMounted(() => {
	init()
})
</script>
<style lang="scss">
#example1 canvas {
	margin: 0 !important;
	padding: 0 !important;
}
</style>
