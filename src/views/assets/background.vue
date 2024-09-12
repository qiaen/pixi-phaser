<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Application, Sprite, Assets, Matrix, Point, Graphics } from 'pixi.js'
let happyImg = 'https://homework-prod.oss-accelerate.aliyuncs.com/g-av-i-1.png'
let sadImg = 'https://homework-prod.oss-accelerate.aliyuncs.com/g-av-f-1.png'
let refCanvas = ref()
let app = new Application()
async function init() {
	await app.init({ width: 256, height: 256 })
	refCanvas.value.appendChild(app.canvas)

	let isSad = false
	Assets.add({ alias: 'sad', src: sadImg })
	Assets.add({ alias: 'happy', src: happyImg })
	Assets.backgroundLoad(['sad', 'happy'])
	Assets.load('happy').then(target => {
		console.log(target)
		let sprite = new Sprite(target)
		sprite.scale.x = 0.5
		sprite.scale.y = 0.5
		sprite.anchor.set(0.5)
		sprite.position.x = app.screen.width / 2
		sprite.position.y = app.screen.height / 2
		app.stage.addChild(sprite)
		sprite.eventMode = 'static'
		sprite.cursor = 'pointer'
		sprite.on('pointertap', async () => {
			isSad = !isSad
			sprite.texture = await Assets.load(isSad ? 'sad' : 'happy')
		})
	})
}
onMounted(async () => {
	init()
})
</script>