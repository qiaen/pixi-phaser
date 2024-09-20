<template>
	<!-- 话一个简单的立方体 -->
	<div ref="ref1"></div>
</template>
<script setup>
import { BoxGeometry, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, Mesh } from 'three'
import { onMounted, ref } from 'vue'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
let ref1 = ref()

function init() {
	let wiw = window.innerWidth
	let wih = window.innerHeight
	let scene = new Scene()
	// 视野角度
	// 长宽比，类似电视屏幕
	// 近截面
	// 远截面 当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中
	let camera = new PerspectiveCamera(75, wiw / wih, 0.1, 1000)
	let renderer = new WebGLRenderer()
	renderer.setSize(wiw, wih)
	ref1.value.appendChild(renderer.domElement)
	
	let geometry = new BoxGeometry(1, 1, 1)
	let material = new MeshBasicMaterial({
		color: 0x884888
	})
	let cube = new Mesh(geometry, material)
	scene.add(cube)
	// z 远近，距离越近，主体越小，我发现不管怎么调，xyz，都是一个正方形，只是主体的位置变了
	camera.position.z = 2
	// camera.position.x = 0.2
	// camera.position.y = 0.3
	// 影响主体视角的是lookAt
	camera.lookAt(0, 0.1, 1)
	// 开始渲染，不然的话还是看不到东西, 需要执行渲染
	renderer.render(scene, camera)
	
	function animate() {
		requestAnimationFrame(animate)
		cube.rotation.x += 0.01
		cube.rotation.y += 0.01
		renderer.render(scene, camera)
		
	}
	// animate()
}
onMounted(() => {
	init()
})
</script>
