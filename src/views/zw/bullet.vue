<template>
    <img class="bullet" src="/zw/zd.png" :style="style" />
</template>
<script setup>
import { defineProps, computed } from 'vue'
let props = defineProps(['data'])
let style = computed(() => {
    let { row, x } = props.data
    return {
        left: `${x}px`,
        top: `${98 + row * 90}px`
    }
})
</script>
<style lang="scss">
.bullet {
    position: absolute;
    z-index: 1;
}
</style>