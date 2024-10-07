<template>
	<!-- 画一个简单的线条 -->
	<div ref="refDiv" id=""></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
let refDiv = ref()

class Game {
	constructor(el) {
		this.clock = new THREE.Clock()
		this.renderer = this.genRender(el)
		this.camera = this.genCamera()
		this.scene = this.genScene()
	}
	genRender(el) {
		let renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		// renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.shadowMap.enabled = true
		el.appendChild(renderer.domElement)
		return renderer
	}
	genScene() {
		let scene = new THREE.Scene()
		scene.background = new THREE.Color(0xe0e0e0)
		scene.fog = new THREE.Fog(0xe0e0e0, 20, 100)
		return scene
	}
	genCamera() {
		let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100)
		camera.position.set(-5, 3, 10)
		camera.lookAt(0, 2, 0)
		return camera
	}
	render() {
		this.renderer.render(this.scene, this.camera)
	}
	animation() {
		if (this.clock?.getDelta) {
			let mixerUpdateDelta = this.clock.getDelta()
			this.mixerSprite?.update(mixerUpdateDelta)
		}
		this.render()
	}
}
//
class Sprite extends Game {
	constructor(el) {
		super(el)
		this.loaderSprite()
		this.genEnv()
	}
	loaderSprite() {
		let dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
		dracoLoader.preload()
		let path = 'https://sougen.co/character_body.gltf'
		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)
		// console.log(loader)
		loader.load(path, async gltf => {
			console.log(gltf)
			const model = gltf.scene
			// 添加影子
			model.traverse(function (object) {
				if (object.isMesh) {
					object.castShadow = true
				}
			})
			let animations = gltf.animations
			this.scene.add(model)
			let mixer = new THREE.AnimationMixer(model)
			let action = mixer.clipAction(animations[11])
			action.play()
			this.mixerSprite = mixer
			this.renderer.setAnimationLoop(this.animation.bind(this))
		})
	}
	genEnv() {
		const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
		hemiLight.position.set(0, 20, 0)
		this.scene.add(hemiLight)

		const dirLight = new THREE.DirectionalLight(0xffffff, 3)
		dirLight.position.set(-3, 10, -10)
		dirLight.castShadow = true
		this.scene.add(dirLight)

		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }))
		mesh.rotation.x = -Math.PI / 2
		mesh.receiveShadow = true
		this.scene.add(mesh)

		const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
		grid.material.opacity = 0.2
		grid.material.transparent = true
		this.scene.add(grid)
	}
}
onMounted(() => {
	new Sprite(refDiv.value)
})
</script>
