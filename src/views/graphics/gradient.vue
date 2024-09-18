<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
import { Application, Assets, ColorMatrixFilter, Container, FillGradient, Sprite, Graphics } from 'pixi.js'
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
		this.render()
		this.stage.addChild(this.contain)
	}
	render() {
		let w = this.app.screen.width
		let h = this.app.screen.height
		let gradientFill = new FillGradient(0, 0, w, h)
		console.log(gradientFill.transform)
		// gradientFill.addColorStop(0, 0x179ac5)
		// gradientFill.addColorStop(1, 0x9bddf3)
		// 
		gradientFill.addColorStop(0, 0xff0000)
		gradientFill.addColorStop(1, 0x0000ff)
		// 起点x，起点y，宽度，高度，圆角，角度从左上角开始
		// let block = new Graphics().roundRect(0, 0, w, h, 0).fill(gradientFill)
		let block = new Graphics().roundRect(0, 0, w, h, 0).fill(gradientFill)
		// 设置为一个50圆角
		// let block = new Graphics().roundRect(0, 0, w, h, 50).fill(gradientFill)
		// 相当于设置锚点
		// block.pivot.set(0, 0)
		// block.x = 100
		// block.y = 200
		// 精灵才可以设置锚点，Graphics图形不可以
		// block.anchor.set(0.5)
		this.contain.addChild(block)
	}
}
let refCanvas = ref()
onMounted(() => {
	new Game(refCanvas.value)
})
</script>
