<template>
	<!-- 画一个简单的线条 -->
	<div ref="refDiv" id=""></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
let refDiv = ref()
let container, stats, clock, gui, mixer, actions, activeAction, previousAction
let camera, scene, renderer, model, face

const api = { state: 'run' }

onMounted(() => [init()])

function init() {
	container = document.createElement('div')
	refDiv.value.appendChild(container)

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100)
	camera.position.set(-5, 3, 10)
	camera.lookAt(0, 2, 0)

	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xe0e0e0)
	scene.fog = new THREE.Fog(0xe0e0e0, 20, 100)

	clock = new THREE.Clock()

	// lights

	const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
	hemiLight.position.set(0, 20, 0)
	scene.add(hemiLight)

	const dirLight = new THREE.DirectionalLight(0xffffff, 3)
	dirLight.position.set(-3, 10, -10)
    dirLight.castShadow = true
	scene.add(dirLight)

	// ground

	const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }))
	mesh.rotation.x = -Math.PI / 2
	scene.add(mesh)

	const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
	grid.material.opacity = 0.2
	grid.material.transparent = true
	scene.add(grid)

	// model
	let dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
	dracoLoader.preload()
	const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
	// let path = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
	let path = 'https://sougen.co/character_body.gltf'
	loader.load(
		path,
		function (gltf) {
			model = gltf.scene
			scene.add(model)
            console.log(gltf.animations)
			createGUI(model, gltf.animations)
		},
		undefined,
		function (e) {
			console.error(e)
		}
	)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setAnimationLoop(animate)
	container.appendChild(renderer.domElement)

	window.addEventListener('resize', onWindowResize)

	// stats
	stats = new Stats()
	container.appendChild(stats.dom)
}

function createGUI(model, animations) {
	// const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing']
	// const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
    // const states = ['bow', 'run', 'thankyou', 'dance', 'glide', 'idel', 'jump', 'kneelidle', 'leanback']
	// const emotes = ['leanforward', 'leanright', 'meditateyoyo', 'run', 'slide', 'thankyou']
	// gui = new GUI()

	mixer = new THREE.AnimationMixer(model)

	actions = {}
    let runAct = mixer.clipAction(animations[11])
	for (let i = 0; i < animations.length; i++) {
		const clip = animations[i]
		const action = mixer.clipAction(clip)
		actions[clip.name] = action

		// if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
			// action.clampWhenFinished = true
			// action.loop = THREE.LoopOnce
		// }
	}

	// states

	// const statesFolder = gui.addFolder('States')

	// const clipCtrl = statesFolder.add(api, 'state').options(states)

	// clipCtrl.onChange(function () {
	// 	fadeToAction(api.state, 0.5)
	// })

	// statesFolder.open()

	// emotes

	// const emoteFolder = gui.addFolder('Emotes')

	// function createEmoteCallback(name) {
	// 	api[name] = function () {
	// 		fadeToAction(name, 0.2)

	// 		mixer.addEventListener('finished', restoreState)
	// 	}

	// 	emoteFolder.add(api, name)
	// }

	// function restoreState() {
	// 	mixer.removeEventListener('finished', restoreState)

	// 	fadeToAction(api.state, 0.2)
	// }

	// for (let i = 0; i < emotes.length; i++) {
	// 	createEmoteCallback(emotes[i])
	// }

	// emoteFolder.open()

	// expressions

	// face = model.getObjectByName('Head_4')

	// const expressions = Object.keys(face.morphTargetDictionary)
	// const expressionFolder = gui.addFolder('Expressions')

	// for (let i = 0; i < expressions.length; i++) {
	// 	expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
	// }

	// activeAction = actions['run']
    // console.log(activeAction)
    // console.log(runAct)
	// activeAction.play()
    runAct.play()
    // renderer.render(scene, camera)
	// expressionFolder.open()
}

function fadeToAction(name, duration) {
	previousAction = activeAction
	activeAction = actions[name]

	if (previousAction !== activeAction) {
		previousAction.fadeOut(duration)
	}

	activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play()
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)
}

//

function animate() {
	const dt = clock.getDelta()

	if (mixer) mixer.update(dt)

	renderer.render(scene, camera)

	stats.update()
}
</script>
