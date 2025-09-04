<template>
	<div style="display: flex; align-items: center">
		<div v-for="(item, index) in numberToArray" :key="index" :class="['scroll-number', { sign: ignoreStr.includes(item) }]" :style="numStyle">
			<div class="scroll-container" :style="{ ...animateStyle(item) }" v-bind="getBindValue">
				<div v-for="(v, i) in numberBox" :key="i" class="scroll-single" :style="{ color: color }">
					{{ v }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'scroll-number'
}
</script>
<script lang="ts" setup>
import { useAttrs,defineProps, computed, ref, watch } from 'vue'
const props = defineProps({
	number: {
		type: [Number, String],
		required: true
	},
	h: {
		type: Number, // 数字高度
		default: 30
	},
	color: {
		type: [String],
		default: '#606cee'
	},
	customStyle: {
		type: Object,
		default: () => {
			return {}
		}
	},
	/** 数字是否使用千分位，如果不是数字，请不要配置为true */
	useThousands: {
		type: Boolean,
		default: false
	}
})

const attrs = useAttrs()
/** 绑定自定义属性，包括class */
const getBindValue = computed(() => {
	return {
		...attrs
	}
})
/** 注意空格放最后，否则会显示异常 */
const numberBox = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '.', '-', ':', ',', ' ']
const ignoreStr = ['.', ' ', '-', ':', ',']
const numberToArray = ref<any[]>([])

watch(
	() => props.number,
	n => {
		if (props.useThousands) {
			numberToArray.value = n
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
				.split('')
		} else {
			numberToArray.value = n.toString().split('')
		}
	},
	{
		immediate: true,
		deep: true
	}
)

const numStyle = computed(() => {
	return {
		...props.customStyle,
		height: `${props.h}px`,
		fontSize: `${props.h}px`
	}
})

const animateStyle = (item: any) => {
	const index = item.trim().length === 0 ? 9999 : numberBox.findIndex(i => item == i)
	return { transform: `translate3d(0, -${index * props.h}px, 0)` }
}
</script>

<style lang="scss">
.scroll-number {
	overflow: hidden;
	.scroll-container {
		display: flex;
		flex-direction: column;
		transform: translate(0, 0);
		transition: all 0.2s;
	}
	.scroll-single {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		line-height: 1;
		overflow: hidden;
	}
}
</style>
