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
let camera, cameraTarget, scene, renderer

function init() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20)
	camera.position.set(-1.8, 0.6, 2.7)

	scene = new THREE.Scene()
    let loaderBg = new RGBELoader().setPath('https://threejs.org/examples/textures/equirectangular/')
	loaderBg.load(
        'royal_esplanade_1k.hdr', 
        function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping
            // 会影响背景显示
            scene.background = texture
            // 会影响model的高光反射
            scene.environment = texture
            render()
        }
    )
    // su7
    // https://gamemcu.com/su7/1.0.5/mesh/sm_startroom.raw.glb
    // 
    // https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/
    // model 如果想要背景先渲染，再下载model，可以放到loaderBg的回调内
    const loaderMdel = new GLTFLoader().setPath('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/')
    loaderMdel.load('DamagedHelmet.gltf', async function (gltf) {
        const model = gltf.scene

        // wait until the model can be added to the scene without blocking due to shader compilation

        await renderer.compileAsync(model, camera, scene)

        scene.add(model)

        render()
    })
    // antialias抗锯齿
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1
	refDiv.value.appendChild(renderer.domElement)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.addEventListener('change', render) // use if there is no animation loop
	controls.minDistance = 0
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
onMounted(() => {
	init()
})
</script>
