<template>
	<div id="example3"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'
let { Game } = Phaser

function init() {
	let sky = null
	let trees = null
	let game = new Game({
		type: Phaser.AUTO,
		parent: 'example3',
		width: 800,
		height: 600,
		backgroundColor: '#304858',
		scene: {
			preload: function () {
				// this.load.path = '/img'
				this.load.atlas('walker', '/img/walker.png', '/json/walker.json')
				// 512 × 296
				this.load.image('sky', '/img/ms3-sky.png')
				// 512 × 320
				this.load.image('trees', '/img/ms3-trees.png')
			},
			create: function () {
				// 512 × 296
				sky = this.add.tileSprite(0, 38, 800, 296, 'sky').setOrigin(0, 0)
				// 512 × 320
				trees = this.add.tileSprite(0, 280, 800, 320, 'trees').setOrigin(0, 0)

				let animConfig = {
					key: 'walk',
					frames: 'walker',
					frameRate: 16,
					repeat: -1
				}
				this.anims.create(animConfig)
				// 为什么不掉下来？
				let sprite = this.add.sprite(400, 484, 'walker', 'frame_0000')
				sprite.play({
					key: 'walk',
					// 播放的次数，优先级比animConfig高
					// repeat: 1
				})
			},
			update() {
				// 每帧率持续调用
				sky.tilePositionX -= 1
				trees.tilePositionX -= 2
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
