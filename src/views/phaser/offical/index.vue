<template>
	<div id="exampleoffical"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'
import { create, preload } from './game'
let { Game } = Phaser

function init() {
	let platforms = null
	let player = null
	let cursors = null
	let stars = null
	let score = 0
	let scoreText = ''
	let bombs = null
	let gameOver = false
	let game = new Game({
		type: Phaser.AUTO,
		parent: 'exampleoffical',
		width: 800,
		height: 600,
		scale: {
			// mode: Phaser.Scale.RESIZE,
			// autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {
					y: 300
				},
				debug: true
			}
		},
		scene: {
			preload: function() {
				// this.load.image('sky', '/img/sky.png')
				this.load.image('ground', '/img/platform.png')
				this.load.image('star', '/img/star.png')
				this.load.image('bomb', '/img/bomb.png')
				this.load.spritesheet('dude', '/img/dude.png', {
					frameWidth: 32, frameHeight: 48
				})
			},
			create: function() {
				// this.add.image(400, 300, 'sky')
				// 分数显示
				scoreText = this.add.text(16, 16, 'Score: 0', {
					fontSize: '32px', fill: '#000'
				})
				
				// 添加静态模块，指不会被玩家移动不受重力等因素影响的模块
				platforms = this.physics.add.staticGroup()
				platforms.create(400, 568, 'ground').setScale(2).refreshBody()
				platforms.create(600, 400, 'ground')
				platforms.create(50, 250, 'ground')
				platforms.create(750, 220, 'ground')

				player = this.physics.add.sprite(100, 450, 'dude')
				// 反弹力度,0 不反弹，最大为 1
				player.setBounce(0.2)
				// 触底反弹
				player.setCollideWorldBounds(true)
				// 图片从中间开始，4是人物面向玩家的图片，0到3是面向左，5到8是想有的图片
				this.anims.create({
					key: 'left',
					frames: this.anims.generateFrameNumbers('dude', { 
						start: 0, end: 3
					}),
					frameRate: 10,
					repeat: -1
				})
				// 面向玩家
				this.anims.create({
					key: 'turn',
					frames: [ { key: 'dude', frame: 4 } ],
					frameRate: 20
				})
				this.anims.create({
					key: 'right',
					frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
					frameRate: 10,
					repeat: -1
				})
				// 碰撞器，使两个物体不会交集
				this.physics.add.collider(player, platforms)
				// 和地面平台不通的是这是group那个是staticGroup
				stars = this.physics.add.group({
					key: 'star',
					// 重复11次，意味着产生12个星星
					repeat: 11,
					setXY: {
						// 初始在12，0； stepX重复的步进，意思x相隔70像素
						x: 12, y: 0, stepX: 70
					}
				})
				stars.children.iterate(child => {
					// 迭代器给信息设置y上的反弹，星星不会左右所以不需要，反弹随机0.4到0.8
					child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3))
				})
				// 添加碰撞，不允许和静态地面重叠
				this.physics.add.collider(stars, platforms)
				// 收集星星
				function collectStar(player, star) {
					star.disableBody(true, true)
					score += 10
					scoreText.setText(`Score: ${score}`)
					
					// countActive 查看存活的星星数量
					if (stars.countActive(true) === 0) {
						stars.children.iterate(child => {
							child.enableBody(true, child.x, 0, true, true)
						})
						let xCenter = player.x < 400 ? 400 : 0
						let x = Phaser.Math.Between(xCenter, xCenter+ 400)
						let bomb = bombs.create(x, 16, 'bomb')
						// 反弹力度, 横向0.3， 垂直0.3
						bomb.setBounce(0.3, 0.3)
						// 触底反弹
						bomb.setCollideWorldBounds(true)
						// 给炸弹设置了速度，造成炸弹好像是甩出来一样，横向速度是随机的，垂直是20
						bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
					}
				}
				// 检测两组物体重叠，监测到就调用collectStar，传入重叠的对象
				this.physics.add.overlap(player, stars, collectStar, null, this)
				
				bombs = this.physics.add.group()
				this.physics.add.collider(bombs, platforms)
				function hitBomb(player, bomb) {
					this.physics.pause()
					player.setTint(0xff0000)
					player.anims.play('turn')
					gameOver = true
					console.log('baoza')

				}
				this.physics.add.collider(player, bombs, hitBomb, null, this)

			},
			update: function() {
				// 添加键盘控制
				cursors = this.input.keyboard.createCursorKeys()
				// console.log(cursors.left)
				if (cursors.left.isDown) {
					// 设置速度x
					player.setVelocityX(-160)
					player.anims.play('left', true)
				} else if (cursors.right.isDown) {
					player.setVelocityX(160)
					player.anims.play('right', true)
				} else {
					player.setVelocityX(0)
					player.anims.play('turn')
				}
				// 如果身体接触了地面才允许向上跳动
				if (cursors.up.isDown && player.body.touching.down) {
					player.setVelocity(-330)
				}

			}
		}
	})
}
onMounted(() => {
	init()
})
</script>
<style lang="scss">
#exampleoffical canvas {
	margin: 0 !important;
	padding: 0 !important;
}
</style>
