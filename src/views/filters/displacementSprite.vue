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
		// 注意这个是放到stage不是container
		this.displacementSprite = await this.load('https://pixijs.com/assets/pixi-filters/displace.png', 3, 'stage')
		// this.filter = new ColorMatrixFilter()
		// console.log(this.filter)
		
		this.render()
		let disFilter = new DisplacementFilter({
			sprite: this.displacementSprite,
			scale: 150
		})
		contain.filters = [disFilter]
		this.stage.eventMode = 'static'
		this.listener()
	}
	async load(src, zIndex, target) {
		let img = await Assets.load(src)
		let sprite = new Sprite(img)
		this[target || 'contain'].addChild(sprite)
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
		})
	}
	listener() {
		let that = this
		function onPointerMove(event) {
			// console.log(event.data.global.x, event.data.global.y)
			that.displacementSprite.position.set(event.data.global.x, event.data.global.y)
			// ring.position.copyFrom(displacementSprite.position)
		}
		this.app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove)
	}
}
let refCanvas = ref()
onMounted(() => {
	new Game(refCanvas.value)
})
</script>
