import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/event/wheel',
			component: () => import(`../views/event/wheel.vue`)
		},
		{
			path: '/assets/background',
			component: () => import(`../views/assets/background.vue`)
		},
		{
			path: '/advanced/collision-detection',
			component: () => import(`../views/advanced/collision-detection.vue`)
		},
		{
			path: '/phaser/1',
			component: () => import(`../views/phaser/1.vue`)
		},
		{
			path: '/phaser/3',
			component: () => import(`../views/phaser/3.vue`)
		},
		{
			path: '/phaser/4',
			component: () => import(`../views/phaser/4.vue`)
		},
		{
			path: '/phaser/5',
			component: () => import(`../views/phaser/5.vue`)
		},
		{
			path: '/offical',
			component: () => import(`../views/phaser/offical/index.vue`)
		},
		{
			path: '/shuibowen',
			component: () => import(`../views/shuibowen.vue`)
		},
		{
			path: '/color-matrix',
			component: () => import(`../views/filters/color-matrix.vue`)
		},
		{
			path: '/displacementSprite',
			component: () => import(`../views/filters/displacementSprite.vue`)
		},
		{
			path: '/displacementMapFlag',
			component: () => import(`../views/filters/displacementMapFlag.vue`)
		},
		{
			path: '/suibowen',
			component: () => import(`../views/filters/suibowen.vue`)
		},
		{
			path: '/suibowen-click',
			component: () => import(`../views/filters/suibowen-click.vue`)
		},
		{
			path: '/graphics/gradient',
			component: () => import(`../views/graphics/gradient.vue`)
		},
		{
			path: '/phaser/police',
			component: () => import(`../views/phaser/police.vue`)
		},
		{
			path: '/three/1',
			component: () => import(`../views/three/1.vue`)
		},
		{
			path: '/three/2',
			component: () => import(`../views/three/2.vue`)
		},
		{
			path: '/three/3',
			component: () => import(`../views/three/3.vue`)
		},
		{
			path: '/three/4',
			component: () => import(`../views/three/4.vue`)
		},
		{
			path: '/three/4X',
			component: () => import(`../views/three/4X.vue`)
		},
		{
			path: '/three/5',
			component: () => import(`../views/three/5.vue`)
		},
        {
			path: '/three/6',
			component: () => import(`../views/three/6.vue`)
		},
        {
			path: '/three/su7',
			component: () => import(`../views/three/su7.vue`)
		}
	]
	
})
export default router
