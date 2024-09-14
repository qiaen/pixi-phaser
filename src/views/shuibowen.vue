<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
// https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js
import { ref, onMounted } from 'vue'
import { Application, Sprite, Assets, Text, DisplacementFilter, WRAP_MODES, Matrix, Point, Graphics, BlurFilter } from 'pixi.js'
import { ShockwaveFilter } from 'pixi-filters'
let refCanvas = ref()
let app = new Application()

async function init(src, tags) {
	await app.init({
		resizeTo: window
	})
	let screenWidth = app.screen.width
	let screenHeight = app.screen.height
	let bunny = await Assets.load(src)
	let sprit = new Sprite(bunny)
	sprit.position.x = screenWidth / 2
	sprit.position.y = screenHeight / 2
	sprit.anchor.set(0.5)
	sprit.scale = 0.8
	app.stage.addChild(sprit)
	refCanvas.value.appendChild(app.canvas)

	let text = new Text({
		anchor: 0.5,
		text: '测 试 页 面',
		style: {
			fontSize: 30 + Math.floor(window.innerWidth / 20),
			fill: 0xffffff,
			dropShadow: true, // 给文字添加阴影效果
			dropShadowColor: '#000000', // 阴影颜色
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI * 0.25, // 光纤照射角度 从左到右
			dropShadowDistance: 8
		},
		position: {
			x: screenWidth / 2,
			y: screenHeight / 2
		}
	})
	app.stage.addChild(text)
	// 模糊化
	// let blure1 = new BlurFilter()
	// text.filters = [blure1]
	// blure1.blur = 10
}
onMounted(() => {
	let src = '/img/weed.jpg'
	init(src)
})
</script>
