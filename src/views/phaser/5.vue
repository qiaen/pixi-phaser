<template>
	<button class="button">立即领取</button>
	<div id="example5"></div>
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
		parent: 'example5',
		width: window.innerWidth,
		height: window.innerHeight,
		// 画布透明
		transparent: true,
		scene: {
			preload: function () {
				this.load.path = 'https://homework-webfront.oss-cn-beijing.aliyuncs.com/wx_mini_app_exam/free-notes'
				// 480 × 132
				this.load.image('banner', '/g-ctyl.png')
				// 478 × 552
				this.load.image('redbag', '/g-red-bag.png')

			},
			create: function () {
				let ww = window.innerWidth
				let wh = window.innerHeight
				let banner = this.add.sprite(ww / 2, wh / 2 - 190, 'banner')
				banner.scale = 0.5

				let redbag = this.add.sprite(ww / 2, wh / 2, 'redbag')
				redbag.scale = 0.3
				// redbag.flipX = -1
				// redbag.flipX = true
				redbag.rotationZ = -180
				this.tweens.add({
					targets: redbag,
					scale: 0.5,
					flipX: false,
					// angle: 180,
					duration: 500,
					ease: 'Bounce.Out'
				})
				redbag.setInteractive()
				redbag.on('pointerdown', () => {
					console.log(1)
				})

			},
			update() {}
		}
	})
}
onMounted(() => {
	init()
})
</script>
<style lang="scss">
.button {
	width: 200px;
	height: 40px;
	outline: none;
	border-radius: 4px;
	text-align: center;
	line-height: 40px;
	background-color: antiquewhite;
	color: #333;
	border: none;
	margin: 100px;
	cursor: pointer;
}
.button:hover {
	opacity: 0.7;
	color: #000;
}
.button:active {
	background-color: rgb(248, 219, 182);
}
#example5 {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	background-color: rgba(0,0,0,0.5);
}
#example5 canvas {
	margin: 0 !important;
	padding: 0 !important;
}
</style>
