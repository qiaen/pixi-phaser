<template>
	<div id="example4"></div>
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
		parent: 'example4',
		width: 800,
		height: 600,
		backgroundColor: '#304858',
		scene: {
			preload: function () {
				this.load.atlas('gems', '/img/gems.png', '/json/gems.json')
			},
			create: function () {
				this.anims.create({
					key: 'diamond',
					frames: this.anims.generateFrameNames('gems', {
						prefix: 'diamond_',
						end: 15,
						zeroPad: 4
					}),
					repeat: -1
				})
				// 992 × 200
				this.add.sprite(400, 200, 'gems').play('diamond')
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
#example1 canvas {
	margin: 0 !important;
	padding: 0 !important;
}
</style>
