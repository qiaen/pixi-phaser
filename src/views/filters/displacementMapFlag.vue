<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
import { Application, Assets, ColorMatrixFilter, Container, DisplacementFilter, Sprite, WRAP_MODES } from 'pixi.js'
import { onMounted, ref } from 'vue'
class Game {
	constructor(el) {
		this.init(el)
	}
	async init(el) {
		this.app = new Application()
		await this.app.init({ resizeTo: window })
		this.stage = this.app.stage
		this.stage.eventMode = 'static'
		el.appendChild(this.app.canvas)
		this.contain = new Container()
		this.stage.addChild(this.contain)
		this.load()
	}
	async load(src, zIndex, target) {
		await Assets.load(['https://pixijs.com/assets/pixi-filters/flag.png', 'https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg'])
		let flag = Sprite.from('https://pixijs.com/assets/pixi-filters/flag.png')
		flag.x = 100
		flag.y = 100
		this.contain.addChild(flag)

		let mask = Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg')
		mask.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT
		// mask.alpha = 0.9
		let filter = new DisplacementFilter({
			sprite: mask,
			scale: {
				x: 60,
				y: 120
			}
		})
		this.stage.addChild(mask)
		flag.filters = [filter]
		this.mask = mask
		this.render()
	}
	render() {
		this.app.ticker.add(() => {
			this.mask.x++
			if (this.mask.x > this.mask.width) {
				this.mask.x = 0
			}
		})
	}
	listener() {}
}
let refCanvas = ref()
onMounted(() => {
	new Game(refCanvas.value)
})
</script>
