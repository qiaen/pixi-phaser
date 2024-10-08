<template>
	<!-- 画一个简单的线条 -->
	<div ref="refDiv" @click="myAction"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
let refDiv = ref()
let camera = null
let scene = null
let renderer = null
let clock = null
let model = null
let mixer = null
let stats = null
let skeleton = null
function init() {
	camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.25, 1000)
	camera.position.set(-5, 8, 10)
	camera.lookAt(0, 2, 0)

	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x0e0e0e)
	scene.fog = new THREE.Fog(0x0e0e0e, 20, 100)

	clock = new THREE.Clock()

	// 光照 半光？
	let hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
	hemiLight.position.set(0, 20, 0)
	scene.add(hemiLight)

	// 光照 平行光
	let dirLight = new THREE.DirectionalLight(0xffffff, 3)
	dirLight.position.set(10, 20, 30)
	dirLight.castShadow = true
	scene.add(dirLight)

	// 地面ground
	let plane = new THREE.PlaneGeometry(2000, 2000)
	let net = new THREE.MeshPhongMaterial({
		color: 0xcbcbcb,
		depthWrite: false
	})
	let groud = new THREE.Mesh(plane, net)
	groud.rotation.x = -Math.PI / 2
	groud.receiveShadow = true
	scene.add(groud)

	let grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
	grid.material.opacity = 0.2
	grid.material.transparent = true
	scene.add(grid)

	// 模型
	let loader = new GLTFLoader()
	loader.load(
		'/img/RobotExpressive.glb',
		gltf => {
			model = gltf.scene
			scene.add(model)
			createGUI(model, gltf.animations)
			model.traverse(object => {
				// console.log(object.isMesh)
				if (object.isMesh) {
					object.castShadow = true
				}
			})
			// render()
			// 骨架
			// skeleton = new THREE.SkeletonHelper(model)
			// skeleton.visible = true
			// scene.add(skeleton)
		},
		undefined,
		e => {
			console.error(e)
		}
	)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setAnimationLoop(animate)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	refDiv.value.appendChild(renderer.domElement)

	let controls = new OrbitControls(camera, renderer.domElement)
	controls.addEventListener('change', renderModel) // use if there is no animation loop
	controls.minDistance = 2
	controls.maxDistance = 10
	controls.target.set(0, 0, -0.2)
	controls.update()
	window.addEventListener('resize', onWindowResize)

	// 帧率显示
	stats = new Stats()
	refDiv.value.appendChild(stats.dom)
}

let gui = null
let actions = {}
let api = {
	state: 'Walking'
}
let face = null
function createGUI(model, animations) {
	console.log(animations)
	let states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing', 'WalkJump']
	// 只执行一次的动作
	let emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
	gui = new GUI()
	mixer = new THREE.AnimationMixer(model)
	for (let item of animations) {
		let action = mixer.clipAction(item)
		actions[item.name] = action
		// 有些动作是只执行一次的，且执行完回到原来的动作
		if (emotes.includes(item.name) || states.indexOf(item.name) >= 4) {
			// 动画播放完毕留在最后一针，否则在执行下一个动作比较僵硬，配置为true更顺滑，但是可能反应会慢一些
			action.clampWhenFinished = true
			action.loop = THREE.LoopOnce
		}
	}
	// 显示状态控制
	let statesFolder = gui.addFolder('States')
	let clipCtrl = statesFolder.add(api, 'state').options(states)
	clipCtrl.onChange(() => {
		fadeToAction(api.state, 0.5)
	})
	// statesFolder.open()
	// 显示表情控制
	let emoteFolder = gui.addFolder('Emotes')
	function createEmoteCallback(name) {
		api[name] = function () {
			fadeToAction(name, 0.2)
			mixer.addEventListener('finished', restoreState)
		}
		emoteFolder.add(api, name)
	}
	for (let item of emotes) {
		createEmoteCallback(item)
	}
	emoteFolder.open()
	// 捏脸
	face = model.getObjectByName('Head_4')

	// ['Angry', 'Surprised', 'Sad']
	let expressions = Object.keys(face.morphTargetDictionary)
	console.log(face)
	let expressionFolder = gui.addFolder('Expressions')
	
	for (let i = 0; i < expressions.length; i++) {
		// console.log(face.morphTargetInfluences)
		// [0,0,0]
		expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i])
	}
	// face.morphTargetInfluences[1] = 1
	activeAction = actions['Walking']
	activeAction.play()

	expressionFolder.open()
	gui.close()
	// 开始执行动作
	activeAction = actions.Walking
	activeAction.play()
}
function restoreState() {
	mixer.removeEventListener('finished', restoreState)
	// console.log(api)
	fadeToAction(api.state, 0.2)
}
let previousAction = null
let activeAction = null
function fadeToAction(name, duration) {
	previousAction = activeAction
	activeAction = actions[name]
	if (previousAction && previousAction !== activeAction) {
		previousAction.fadeOut(duration)
	}
	activeAction.reset()
	activeAction.setEffectiveTimeScale(1)
	activeAction.setEffectiveWeight(1)
	activeAction.fadeIn(duration)
	activeAction.play()
}
function animate() {
	let dt = clock.getDelta()
	if (mixer) {
		mixer.update(dt)
	}
	renderModel()
	stats.update()
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)
}
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()
function myAction(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

	// 通过鼠标点的位置和当前相机的矩阵计算出raycaster
	raycaster.setFromCamera(mouse, camera)

	// 获取raycaster直线和所有模型相交的数组集合
	let intersects = raycaster.intersectObjects(scene.children)
	// 向上查找parent.uuid 是否为自己要确定的model的uuid
	// console.log(intersects[0].object)
	// console.log(model)
	let flag = checkUid(intersects[0].object, model.uuid)
	// 肯定不是用这个办法，需要判断时候包含某个
	if (flag) {
		fadeToAction('Wave', 0.2)
		mixer.addEventListener('finished', restoreState)
	}
}
function checkUid(obj, uid) {
	let flag = false
	function loop(mesh) {
		if (uid === mesh.uuid) {
			flag = true
		} else {
			// console.log(1)
			if (mesh.parent) {
				loop(mesh.parent)
			}
		}
	}
	loop(obj)
	return flag
}
function renderModel() {
	renderer.render(scene, camera)
}
onMounted(() => {
	init()
})
</script>
