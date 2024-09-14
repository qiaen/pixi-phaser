<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
import { Application, Assets, ColorMatrixFilter, Container, DisplacementFilter, Sprite } from 'pixi.js'
import { onMounted, ref } from 'vue'
class Game {
	constructor(el) {
		this.count = 0
		this.init(el)
	}
	async init(el) {
		this.app = new Application()
		await this.app.init({ resizeTo: window })
		this.stage = this.app.stage
		el.appendChild(this.app.canvas)
		let contain = new Container()
		contain.position.x = this.app.screen.width / 2
		contain.position.y = this.app.screen.height / 2
		this.stage.addChild(contain)
		this.contain = contain
		// this.r1Sprite = await this.load('https://pixijs.com/assets/light_rotate_1.png', 0)
		this.r2Sprite = await this.load('https://pixijs.com/assets/light_rotate_2.png', 1)
		this.pandaSprite = await this.load('https://pixijs.com/assets/panda.png', 2)
		this.filter = new ColorMatrixFilter()
		// console.log(this.filter)
		contain.filters = [this.filter]
		this.render()
	}
	async load(src, zIndex) {
		let img = await Assets.load(src)
		let sprite = new Sprite(img)
		this.contain.addChild(sprite)
		sprite.anchor.set(0.5)
		sprite.zIndex = zIndex
		return sprite
	}
	render() {
		// console.log(this.r2Sprite)
		this.app.ticker.add(() => {
			// console.log(1)
			this.r2Sprite.rotation += 0.01
			this.count += 0.1

			// Animate the filter
			const { matrix } = this.filter

			// matrix[1] = Math.sin(this.count) * 3
			// matrix[2] = Math.cos(this.count)
			// matrix[3] = Math.cos(this.count) * 1.5
			// matrix[4] = Math.sin(this.count / 3) * 2
			// matrix[5] = Math.sin(this.count / 2)
			matrix[6] = Math.sin(this.count / 4)
		})
	}
}
let refCanvas = ref()
onMounted(() => {
	new Game(refCanvas.value)
})
</script>
