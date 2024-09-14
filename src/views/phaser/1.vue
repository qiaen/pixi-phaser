<template>
	<div id="example1"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'
let { Game } = Phaser

function init() {
	let game = new Game({
		type: Phaser.AUTO,
		parent: 'example1',
		width: 800,
		height: 600,
		scale: {
			// mode: Phaser.Scale.RESIZE,
			// autoCenter: Phaser.Scale.CENTER_BOTH
		},
		scene: {
			preload: function () {
				// this.load.image('space', 'https://homework-prod.oss-accelerate.aliyuncs.com/starfield.png')
				this.load.image({
					key: 'space',
					url: 'https://homework-prod.oss-accelerate.aliyuncs.com/starfield.png'
				})
				this.load.image('logo', 'https://homework-prod.oss-accelerate.aliyuncs.com/phaser2.png')
			},
			create: function () {
				// console.log(game)
				// console.log(this)
				let sb = this.add.sprite(400, 300, 'space')
				// 用image也可以，参数一致，目前发现效果一致，scale都会导致显示宽度失效
				// let sb = this.add.image(400, 300, 'space')
				sb.displayWidth = 800
				sb.displayHeight = 600
				// 尺寸被设置后，缩放会导致宽高显示为原始宽高
				// sb.scale = 1

				let logo = this.add.sprite(game.config.width / 2, game.config.height / 2, 'logo')
				logo.alpha = 0
				let w = this.tweens.add({
					targets: logo,
					alpha: 1,
					duration: 2000,
					// loop: true,
					// 重复的次数，不停止
					repeat: -1,
					yoyo: true,
					// rotation: 10
					// scale: 0.5
				})
				w.on('start', () => {
					console.log('---动画开始')
				})
				w.on('complete', () => {
					console.log('---动画完毕')
				})
				// 必须的，添加事件用
				logo.setInteractive()
				this.input.setDraggable(logo)
				this.input.dragDistanceThreshold = 10
				this.input.dragTimeThreshold = 300
				this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
					// 跟随拖拽点
					gameObject.x = dragX
					gameObject.y = dragY
					
				})
				// console.log(this.)
				this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
					console.log(pointer)
					pointer.distance = 2
					console.log(gameObjects)
					// if (deltaY > 0) {
					// 	var newZoom = this.camera.zoom - 0.1
					// 	if (newZoom > 0.3) {
					// 		this.camera.zoom = newZoom
					// 	}
					// }

					// if (deltaY < 0) {
					// 	var newZoom = this.camera.zoom + 0.1
					// 	if (newZoom < 1.3) {
					// 		this.camera.zoom = newZoom
					// 	}
					// }
				})
				// this.input.set
				// let isDrag = false
				// logo.on('pointerdown', function(event) {
				// 	console.log('我被点击了')
				// 	isDrag = true
				// 	console.log(event.downX, event.downY)
				// })

				// logo.on('pointerup', () => {
				// 	console.log('我被放开了')
				// 	isDrag = false
				// })
				// this.input.on('pointerup', () => {
				// 	isDrag = false
				// })
				// // this.setInteractive()
				// this.input.on('pointermove', (event) => {

				// 	if (isDrag) {
				// 		console.log(event.x, event.y)
				// 		logo.x = event.x
				// 		logo.y = event.y
				// 	}
				// })
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
