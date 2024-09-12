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
		}
	]
	
})
export default router
