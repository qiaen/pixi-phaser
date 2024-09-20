<template>
	<!-- 画一个简单的线条 -->
	<div ref="refDiv"></div>
</template>
<script setup>
import { BoxGeometry, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, Mesh, LineBasicMaterial, Vector3, BufferGeometry, Line } from 'three'
import { onMounted, ref, render } from 'vue'
let refDiv = ref()

function init() {
	let wiw = window.innerWidth
	let wih = window.innerHeight
	let renderer = new WebGLRenderer()
	renderer.setSize(wiw, wih)
	refDiv.value.appendChild(renderer.domElement)

	let camera = new PerspectiveCamera(45, wiw / wih, 1, 500)
	// 相机的位置，三维
	camera.position.set(0, 0, 50)
	camera.lookAt(0, 0, 0)
	let scene = new Scene()
	let material = new LineBasicMaterial({
		color: 0x884888
	})
	let points = []
	points.push(new Vector3(-10, 0, 0))
	points.push(new Vector3(0, 10, 0))
	points.push(new Vector3(10, 0, 0))
	points.push(new Vector3(0, -10, 0))
	let geometry = new BufferGeometry().setFromPoints(points)
	let line = new Line(geometry, material)
	scene.add(line)
	renderer.render(scene, camera)
}
onMounted(() => {
	init()
})
</script>
