<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
import { Application, Assets, ColorMatrixFilter, Container, DisplacementFilter, Sprite, WRAP_MODES } from 'pixi.js'
import { onMounted, ref } from 'vue'
import { ShockwaveFilter } from 'pixi-filters'
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
		this.contain.filters = []
		this.stage.addChild(this.contain)
		
		this.load()
		this.listener()
		
	}
	async load(src, zIndex, target) {
		await Assets.load(['/img/weed.jpg', 'https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg'])
		let flag = Sprite.from('/img/weed.jpg')
		flag.scale = 0.75
		flag.y = -200
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
		this.contain.addChild(mask)
		// console.log(this.contain.filters)
		// 不能使用push，也不能使用【0】=xxx，必须替换
		this.contain.filters = [filter]
		
		this.mask = mask
		this.render()
	}
	render() {
		this.app.ticker.add(() => {
			let swf1 = this.contain.filters[1]
			if (swf1) {
				swf1.time += 0.01
			}
			this.mask.x++
			if (this.mask.x > this.mask.width) {
				this.mask.x = 0
			}
		})
	}
	listener() {
		this.contain.eventMode = 'static'
		
		this.contain.on('pointerdown', e => {
			
			let { x, y } = e.data.global
			let swf1 = new ShockwaveFilter({
				center: { x, y },
				speed: 600,
				radius: 600,
				// 波长
				wavelength: 110,
				// 振幅
				amplitude: 15,
				time: 0
			})
			this.contain.filters = [this.contain.filters[0], swf1]
		})
	}
}
let refCanvas = ref()
onMounted(() => {
	new Game(refCanvas.value)
})
</script>
