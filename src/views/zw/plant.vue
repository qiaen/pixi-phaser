<template>
	<div class="plant" :style="style" @drag="drag" @dragover="dragover" @drop="drop">
		<img :src="src" draggable />
		<div class="num">{{ Math.pow(2, data.level - 1) }}</div>
	</div>
</template>
<script setup>
import { defineProps, computed, defineEmits } from 'vue'
import { dragging } from './utils'
let props = defineProps(['data'])
let emits = defineEmits(['fire'])
let data = computed(() => props.data || { row: 0, col: 0, level: 0 })
let src = computed(() => {
	let { level } = data.value
	return `/zw/lv-${level}.gif`
})
let style = computed(() => {
	let { col, row, show } = data.value
	return {
		left: `${252 + col * 80}px`,
		top: `${72 + row * 100}px`,
        opacity: show ? 1 : 0
	}
})
function drag() {
	dragging.value = props.data
}
/** 允许拖拽，这个很重要 */
function dragover(e) {
	e.preventDefault()
}
function drop() {
    if (props.data.show) {
        if (dragging.value.level === props.data.level && props.data.level <= 7) {
            props.data.level += 1
            emits('fire')
        }
        dragging.value.show = false
    } else {
        props.data.level = dragging.value.level
        props.data.show = true
        emits('fire')
    }
	
}
</script>
<style lang="scss">
.plant {
	position: absolute;
	width: 74px;
	height: 98px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	// box-shadow: 0 0 5px rgba(0,0,0,0.5);
	.num {
		font-weight: bolder;
	}
	img {
		width: 70%;
		margin-top: 10px;
	}
	&:-webkit-drag-over {
		background-color: rgba(0, 0, 0, 0.2);
	}
}
</style>
