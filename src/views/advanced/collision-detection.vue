<template>
	<!-- 碰撞检测 https://pixijs.com/8.x/playground?exampleId=advanced.collisionDetection -->
	<div ref="refCanvas"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Application, Sprite, Assets, Matrix, Point, Graphics } from 'pixi.js'
let happyImg = 'https://homework-prod.oss-accelerate.aliyuncs.com/g-av-i-1.png'
let sadImg = 'https://homework-prod.oss-accelerate.aliyuncs.com/g-av-f-1.png'
let imgs = [ happyImg, sadImg]
let refCanvas = ref()
let app = new Application()
let size = 60
function radomPosition() {
	let w = app.screen.width
	let h = app.screen.height
	let sw = w - size
	let sh = h - size
	return {
		x: sw * Math.random() + 30,
		y: sh * Math.random() + 30
	}
}
async function init() {
	await app.init({ width: 400, height: 400 })
	refCanvas.value.appendChild(app.canvas)

	let isSad = false
	
	imgs.forEach(async url => {
		let element = await Assets.load(url)
		let sprite = new Sprite(element)
		sprite.width = size
		sprite.height = size

		sprite.anchor.set(0.5)
		let rp = radomPosition()
		sprite.position.x = rp.x
		sprite.position.y = rp.y
		
		sprite.eventMode = 'static'
		sprite.cursor = 'pointer'

		app.stage.addChild(sprite)
	})
}
onMounted(async () => {
	init()
})
</script>