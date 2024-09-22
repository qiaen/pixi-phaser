<template>
	<div id="police"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'
let { Game } = Phaser

function init() {
	let player = null
	let sky = null
	let trees = null
	let game = new Game({
		type: Phaser.AUTO,
		parent: 'police',
		width: 800,
		height: 550,
		backgroundColor: '#304858',
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
			preload: function () {
				// key，图片地址，小图的宽度高度，数量，如果宽度高度，位置都不一样，那么需要xml或者json来描述
				this.load.spritesheet('police', '/img/police9191.png', {
					frameWidth: 130,
					frameHeight: 261
				})
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
			},
			create: function () {
				
				// 512 × 296
				sky = this.add.tileSprite(0, 38, 800, 296, 'sky').setOrigin(0, 0)
				// 512 × 320
				trees = this.add.tileSprite(0, 280, 800, 320, 'trees').setOrigin(0, 0)
				player = this.physics.add.sprite(100, 450, 'police')
				player.scale = 0.4
				player.setCollideWorldBounds(true)
				this.anims.create({
					key: 'walk',
					frames: this.anims.generateFrameNumbers('police', {
						start: 0, end: 8,
					}),
					frameRate: 10,
					repeat: -1
				})
				
			},
			update() {
				let cursor = this.input.keyboard.createCursorKeys()
				if (cursor.left.isDown) {
					player.flipX = 180
					player.setVelocityX(-120)
					player.anims.play('walk', true)
					// 每帧率持续调用
					sky.tilePositionX -= 0.1
					trees.tilePositionX -= 0.5
				} else if (cursor.right.isDown) {
					player.flipX = 0
					player.setVelocityX(120)
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
