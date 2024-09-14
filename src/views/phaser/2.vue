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
