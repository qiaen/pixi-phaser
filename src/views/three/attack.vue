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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { playAction } from './utils'
let refDiv = ref()

class Game {
	constructor(el) {
		this.clock = new THREE.Clock()
		this.renderer = this.genRender(el)
		this.camera = this.genCamera()
		this.scene = this.genScene()
		console.log(222)
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
		scene.background = new THREE.Color(0x87ceeb)
		scene.fog = new THREE.Fog(0xe0e0e0, 200, 10000)
		return scene
	}
	genCamera() {
		let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000)
		camera.position.set(-1000, 1000, 100)
		camera.lookAt(0, 0, 0)
		return camera
	}
	render() {
		this.renderer.render(this.scene, this.camera)
	}
	animation() {
		if (this.clock?.getDelta) {
			let mixerUpdateDelta = this.clock.getDelta()
			if (this.meshSprite) {
				this.mixerSprite.update(mixerUpdateDelta)
				// this.meshSprite.position.z += 2
			}
		}
		this.render()
	}
}
//
class Sprite extends Game {
	actions = []
	constructor(el) {
		console.log(111)
		super(el)
		console.log(333)
		this.genEnv()
		this.loaderSprite()
	}
	/** 执行一串攻击动作 */
	async attack() {
		// 连招的循序
		let attackList = [12, 8, 9, 10]
		console.log(1)
		await playAction(this.actions[9])

		console.log(2)
		// await playAction(this.actions[8], 100)
		// await playAction(this.actions[24])
	}
	genMixer(animations, meshSprite) {
		let mixer = new THREE.AnimationMixer(meshSprite)
		if (animations?.length) {
			for (let animate of animations) {
				let action = mixer.clipAction(animate)
				this.actions.push(action)
			}
		}

		this.mixerSprite = mixer
	}
	loaderSprite() {
		let path = '/gltf/Naruto.fbx'
		const loader = new FBXLoader()
		// console.log(loader)
		loader.load(path, async meshSprite => {
			console.log(meshSprite)
			meshSprite.position.y = 110
			// 设置模型的每个部位都可以投影
			meshSprite.traverse(function (child) {
				if (child.isMesh) {
					child.castShadow = true
					child.receiveShadow = true
				}
			})
			this.meshSprite = meshSprite
			let animations = meshSprite.animations
			console.log(animations)
			this.genMixer(animations, meshSprite)
			this.dirLight.target = meshSprite
			this.scene.add(meshSprite)

			this.render()

			this.renderer.setAnimationLoop(this.animation.bind(this))
			setTimeout(() => {
				this.attack()
			}, 200)
		})
	}
	genEnv() {
		// 氛围光
		const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
		hemiLight.position.set(0, 20, 0)
		this.scene.add(hemiLight)

		// 平行光
		const dirLight = new THREE.DirectionalLight(0xeeeeee)
		dirLight.position.set(0, 200, 100)
		dirLight.lookAt(new THREE.Vector3())
		dirLight.shadow.camera.top = 300
		dirLight.shadow.camera.bottom = -300
		dirLight.shadow.camera.left = -300
		dirLight.shadow.camera.right = 300
		dirLight.castShadow = true
		this.dirLight = dirLight
		this.scene.add(dirLight)

		// 地面
		let loader = new THREE.TextureLoader()
		let texture = loader.load('/img/1.jpg')
		texture.wrapS = THREE.RepeatWrapping
		texture.wrapT = THREE.RepeatWrapping
		texture.magFilter = THREE.NearestFilter
		// 纹理重复
		texture.repeat.set(100, 100)

		let planeGeo = new THREE.PlaneGeometry(10000, 10000)
		let planeMat = new THREE.MeshPhongMaterial({
			map: texture,
			side: THREE.DoubleSide
		})

		const mesh = new THREE.Mesh(planeGeo, planeMat)
		mesh.rotation.x = Math.PI * -0.5
		mesh.receiveShadow = true
		this.scene.add(mesh)
	}
}
onMounted(() => {
	new Sprite(refDiv.value)
})
</script>
