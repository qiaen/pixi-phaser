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
let refDiv = ref()
let camera, scene, renderer
function init() {
	let container

	let camera, cameraTarget, scene, renderer

	let group, textMesh1, textMesh2, textGeo, materials

	let firstLetter = true

	let text = 'three.js',
		bevelEnabled = true,
		font = undefined,
		fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
		fontWeight = 'bold' // normal bold

	const depth = 20,
		size = 70,
		hover = 30,
		curveSegments = 4,
		bevelThickness = 2,
		bevelSize = 1.5

	const mirror = true

	const fontMap = {
		helvetiker: 0,
		optimer: 1,
		gentilis: 2,
		'droid/droid_sans': 3,
		'droid/droid_serif': 4
	}

	const weightMap = {
		regular: 0,
		bold: 1
	}

	const reverseFontMap = []
	const reverseWeightMap = []

	for (const i in fontMap) reverseFontMap[fontMap[i]] = i
	for (const i in weightMap) reverseWeightMap[weightMap[i]] = i

	let targetRotation = 0
	let targetRotationOnPointerDown = 0

	let pointerX = 0
	let pointerXOnPointerDown = 0

	let windowHalfX = window.innerWidth / 2

	let fontIndex = 1

	init()

	function init() {
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20)
		camera.position.set(-1.8, 0.6, 2.7)

		scene = new THREE.Scene()

		new RGBELoader().setPath('textures/equirectangular/').load('royal_esplanade_1k.hdr', function (texture) {
			texture.mapping = THREE.EquirectangularReflectionMapping

			scene.background = texture
			scene.environment = texture

			render()

			// model

			const loader = new GLTFLoader().setPath('models/gltf/DamagedHelmet/glTF/')
			loader.load('DamagedHelmet.gltf', async function (gltf) {
				const model = gltf.scene

				// wait until the model can be added to the scene without blocking due to shader compilation

				await renderer.compileAsync(model, camera, scene)

				scene.add(model)

				render()
			})
		})

		renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1
		refDiv.value.appendChild(renderer.domElement)

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.addEventListener('change', render) // use if there is no animation loop
		controls.minDistance = 2
		controls.maxDistance = 10
		controls.target.set(0, 0, -0.2)
		controls.update()

		window.addEventListener('resize', onWindowResize)
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize(window.innerWidth, window.innerHeight)

		render()
	}

	//

	function render() {
		renderer.render(scene, camera)
	}
}
onMounted(() => {
	init()
})
</script>
