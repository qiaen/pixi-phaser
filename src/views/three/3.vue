<template>
	<!-- 写一个文字 -->
	<div ref="refDiv"></div>
</template>
<script setup>
import { PerspectiveCamera, Mesh, Scene, WebGLRenderer, MeshBasicMaterial } from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { onMounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
let refDiv = ref()

function init() {
	let wiw = window.innerWidth
	let wih = window.innerHeight
	let renderer = new WebGLRenderer()
	renderer.setSize(wiw, wih)
	refDiv.value.appendChild(renderer.domElement)

	let camera = new PerspectiveCamera(45, wiw / wih, 1, 500)
	// 相机的位置，三维
	camera.position.set(0, 0, 70)
	// camera.lookAt(0, 0, 0)
	let scene = new Scene()
	let loader = new FontLoader()
	let url = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
	loader.load(url, function (font) {
		// console.log(111, font)
		let geometry = new TextGeometry('Hello three.js!', {
			font: font,
			// 控制文字大小
			size: 1,
			// 控制文字粗细
			height: 0.5
		})
		let material = new MeshBasicMaterial({
			color: 0x884888
		})
		let mesh = new Mesh(geometry, material)
		scene.add(mesh)
		renderer.render(scene, camera)
	})
    function renderFunc() {
        renderer.render(scene, camera)
    }
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.addEventListener('change', renderFunc) // use if there is no animation loop
	controls.minDistance = 2
	controls.maxDistance = 10
	controls.target.set(0, 0, -0.2)
	controls.update()
}
onMounted(() => {
	init()
})
</script>
