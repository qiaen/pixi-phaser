import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/event/wheel',
			name: 'event-wheel',
			component: () => import(`../views/event/wheel.vue`)
		},
		{
			path: '/assets/background',
			name: 'assets-background',
			component: () => import(`../views/assets/background.vue`)
		},
		{
			path: '/advanced/collision-detection',
			name: 'advanced-collision-detection',
			component: () => import(`../views/advanced/collision-detection.vue`)
		},
		{
			path: '/phaser/1',
			name: 'phaser-c1',
			component: () => import(`../views/phaser/1.vue`)
		},
		{
			path: '/phaser/3',
			name: 'phaser-c3',
			component: () => import(`../views/phaser/3.vue`)
		},
		{
			path: '/phaser/4',
			name: 'phaser-c4',
			component: () => import(`../views/phaser/4.vue`)
		},
		{
			path: '/phaser/5',
			name: 'phaser-c5',
			component: () => import(`../views/phaser/5.vue`)
		},
		{
			path: '/offical',
			name: 'offical-c1',
			component: () => import(`../views/phaser/offical/index.vue`)
		},
		{
			path: '/shuibowen',
			name: 'shuibowen-c1',
			component: () => import(`../views/shuibowen.vue`)
		},
		{
			path: '/color-matrix',
			name: 'color-matrix-c1',
			component: () => import(`../views/filters/color-matrix.vue`)
		},
		{
			path: '/displacementSprite',
			name: 'displacementSprite-c1',
			component: () => import(`../views/filters/displacementSprite.vue`)
		},
		{
			path: '/displacementMapFlag',
			name: 'displacementMapFlag-c1',
			component: () => import(`../views/filters/displacementMapFlag.vue`)
		},
		{
			path: '/suibowen',
			name: 'suibowen-c1',
			component: () => import(`../views/filters/suibowen.vue`)
		},
		{
			path: '/suibowen-click',
			name: 'suibowen-c2',
			component: () => import(`../views/filters/suibowen-click.vue`)
		},
		{
			path: '/graphics/gradient',
			name: 'graphics-gradient',
			component: () => import(`../views/graphics/gradient.vue`)
		}
	]
	
})
export default router
