<template>
	<div class="plant" :style="style">
		<img :src="src" @drag="drag" @dragover="dragover" @drop="drop" draggable />
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
		left: `${236 + col * 74}px`,
		top: `${62 + row * 90}px`,
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
	.num {
		font-weight: bolder;
	}
	img {
		width: 70%;
	}
	&:-webkit-drag-over {
		background-color: rgba(0, 0, 0, 0.2);
	}
}
</style>
