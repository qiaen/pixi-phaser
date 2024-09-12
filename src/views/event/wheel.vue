<template>
	<div ref="refCanvas"></div>
</template>
<script setup>
// https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js
import { ref, onMounted } from 'vue'
import { Application, Sprite, Assets, Matrix, Point, Graphics } from 'pixi.js'
import { gsap } from 'gsap'
let refCanvas = ref()
let app = new Application()
let startX = 0
let startY = 0
let isDrag = false
let sourceX = 0
let sourceY = 0
let lastScale = 1
let isDraw = false
let sprit = null
function bindEvent() {
	app.eventMode = 'static'
	app.canvas.addEventListener('pointerdown', event => {
		isDrag = true
		startX = event.pageX
		startY = event.pageY
		sourceX = app.stage.position.x
		sourceY = app.stage.position.y
	})
	app.canvas.addEventListener('pointermove', event => {
		if (!isDrag || isDraw) {
			return
		}
		app.stage.position.x = sourceX + event.pageX - startX
		app.stage.position.y = sourceY + event.pageY - startY
	})
	function onOutSide() {
		isDrag = false
	}
	app.canvas.addEventListener('pointerout', onOutSide)
	app.canvas.addEventListener('pointerup', onOutSide)
	// if (isDraw) {
	// 	let globalPoint = new Point(event.pageX, event.pageY)
	// 	// 转化为相对于stage的坐标
	// 	let localPoint = app.stage.toLocal(globalPoint)
	// 	return console.log(localPoint)
	// }
	function onScroll(event) {
		let globalPoint = new Point(event.pageX, event.pageY)
		// 转化为相对于stage的坐标
		let localPoint = app.stage.toLocal(globalPoint)
		// juzheng
		let scale = lastScale + 0.001 * event.wheelDelta
		if (scale > 3 || scale < 0.25) {
			return
		}
		let tx = event.pageX - localPoint.x * scale
		let ty = event.pageY - localPoint.y * scale
		let matrix = new Matrix(scale, 0, 0, scale, tx, ty)
		app.stage.setFromMatrix(matrix)
		lastScale = scale
	}
	app.canvas.addEventListener('wheel', onScroll)
	window.addEventListener('keydown', event => {
		if (event.key === ' ')  {
			isDraw = true
		}
	})
	window.addEventListener('keyup', event => {
		if (event.key === ' ')  {
			isDraw = false
		}
	})
}
function initTag(tags) {
	function move(tag) {
		// tag.rotation += 0.01
		// tag.scale.set(2 + Math.sin(tag.rotation))
		tag.position.x += 1
	}
	for (let item of tags) {
		let tag = new Graphics()
		tag.rect(item.startX, item.startY, item.endX - item.startX, item.endY - item.startY)
		tag.fill(item.bgColor)
		tag.stroke({ width: 2, color: item.borderColor })
		tag.eventMode = 'static'
		tag.cursor = 'pointer'
		tag.on('pointerdown', function() {
			app.ticker.add(move.bind(this, tag))
		})
		app.stage.addChild(tag)
		
	}
	
}
async function init(src, tags) {
	await app.init({
		resizeTo: window
	})
	let screenWidth = app.screen.width
	let screenHeight = app.screen.height
	let bunny = await Assets.load(src)
	sprit = new Sprite(bunny)
	// sprit.width = screenWidth
	// sprit.height = screenWidth / bunny.width * bunny.height
	// sprit.anchor.set(0.5)
	// sprit.position.x = screenWidth / 2
	// sprit.position.y = screenHeight / 2
	let scaleHeight = screenWidth / bunny.width * bunny.height

	sprit.position.x = 0
	lastScale = screenWidth / bunny.width
	let matrix = new Matrix(lastScale, 0, 0, lastScale, 0, (screenHeight - scaleHeight) / 2)
	app.stage.setFromMatrix(matrix)
	app.stage.addChild(sprit)
	refCanvas.value.appendChild(app.canvas)
	bindEvent()
	initTag(tags)
	// let face = await Assets.load('https://homework-prod.oss-accelerate.aliyuncs.com/g-av-i-1.png')
	// let happy = new Sprite(face)
	// app.stage.addChild(happy)
	// happy.eventMode = 'static'
	// happy.cursor = 'pointer'
	// happy.position.x = 100
	// happy.position.y = 100
	// happy.scale = 1
	// happy.on('pointerdown', function() {
	// 	gsap.to(this, {
	// 		duration: 0.4,
	// 		x: 200
	// 		// scale: 0.5
	// 	})
	// 	setTimeout(() => {
	// 		gsap.to(this, {
	// 			duration: 0.4,
	// 			x: 100
	// 			// scale: 1
	// 		})
	// 	}, 400)
	// })
}
onMounted(() => {
	let src = 'https://homework-prod.oss-accelerate.aliyuncs.com/juxing.jpg'
	init(src, [
		{
			startX: 100,
			startY: 100,
			endX: 200,
			endY: 300,
			bgColor: 'ff990050',
			borderColor: 'ff990099',
			text: '我是第1个框'
		},
		{
			startX: 300,
			startY: 300,
			endX: 400,
			endY: 600,
			bgColor: '88488850',
			borderColor: '88488899',
			text: '我是第2个框'
		}
	])
})

</script>