<template>
	<div class="pick-plants">
		<div class="pick-head">
			<div class="head-side left">
				<button class="pick-btn ghost" @click="useDefault">默认阵容</button>
			</div>
			<div class="head-center">
				<h1>选择你的植物</h1>
				<p class="tip">
					最多选 {{ MAX_PICK }} 个上场，已选
					<b :class="{ full: picked.length >= MAX_PICK }">{{ picked.length }}</b>
					/ {{ MAX_PICK }}
				</p>
			</div>
			<div class="head-side right">
				<button class="pick-btn ghost" @click="clearAll">清空</button>
			</div>
		</div>
		<div class="pick-list">
			<div
				class="pick-item"
				v-for="plant in allPlants"
				:key="plant.name"
				:class="{ on: isPicked(plant.name), locked: !isPicked(plant.name) && picked.length >= MAX_PICK }"
				@click="togglePlant(plant.name)"
			>
				<div class="pick-card">
					<img :src="plant.card" :alt="plant.cname" />
					<span class="order" v-if="isPicked(plant.name)">{{ isPicked(plant.name) }}</span>
				</div>
				<div class="pick-name">{{ plant.cname }}</div>
				<div class="pick-cost">
					<img src="/images/interface/Sun.gif" alt="" />
					<span>{{ plant.cost }}</span>
				</div>
				<div class="pick-desc">{{ plant.desc }}</div>
			</div>
		</div>
		<div class="pick-foot">
			<button class="pick-btn primary" :disabled="!picked.length" @click="startGame">
				开始游戏（{{ picked.length }}）
			</button>
		</div>
	</div>
</template>
<script setup>
import { MAX_PICK, allPlants, defaultPick } from '../config'
import { picked, togglePlant, startGame } from '../utils'

function isPicked(name) {
	let index = picked.value.indexOf(name)
	return index >= 0 ? index + 1 : 0
}
function useDefault() {
	picked.value = [...defaultPick]
}
function clearAll() {
	picked.value = []
}
</script>
<style lang="scss">
.pick-plants {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: column;
	padding: 24px 40px 20px;
	box-sizing: border-box;
	background: radial-gradient(circle at 50% 0%, #2f5d2a, #10240f 70%);

	.pick-head {
		flex: none;
		display: flex;
		align-items: center;
		.head-side {
			flex: 1;
			display: flex;
			&.left {
				justify-content: flex-start;
			}
			&.right {
				justify-content: flex-end;
			}
		}
		.head-center {
			flex: none;
			text-align: center;
			color: #ffe08a;
		}
		h1 {
			font-size: 30px;
			letter-spacing: 4px;
			text-shadow: 2px 2px 4px #000;
		}
		.tip {
			margin-top: 6px;
			font-size: 15px;
			color: #cfd8c0;
			b {
				color: #9ee04f;
				&.full {
					color: #ff6a4a;
				}
			}
		}
	}

	.pick-list {
		flex: 1;
		margin: 24px 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
		gap: 16px;
		align-content: start;
	}
	.pick-item {
		padding: 10px;
		text-align: center;
		border: 2px solid #4a2c10;
		border-radius: 8px;
		background: linear-gradient(#e6d3a3, #c8a165);
		cursor: pointer;
		transition: transform 0.12s, box-shadow 0.12s;
		&:hover {
			transform: translateY(-3px);
		}
		&.on {
			border-color: #6fd12b;
			box-shadow: 0 0 0 3px rgba(111, 209, 43, 0.5), 0 6px 12px rgba(0, 0, 0, 0.4);
		}
		&.locked {
			filter: grayscale(0.8) brightness(0.75);
			cursor: not-allowed;
		}
	}
	.pick-card {
		position: relative;
		display: inline-block;
		img {
			width: 76px;
			height: 92px;
			object-fit: contain;
		}
		.order {
			position: absolute;
			right: -6px;
			top: -6px;
			width: 24px;
			height: 24px;
			line-height: 22px;
			border-radius: 50%;
			background: #6fd12b;
			color: #173d06;
			font-size: 14px;
			font-weight: bold;
			border: 2px solid #fff;
			box-sizing: border-box;
		}
	}
	.pick-name {
		margin-top: 4px;
		font-size: 15px;
		font-weight: bold;
		color: #3a2008;
	}
	.pick-cost {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		font-size: 13px;
		font-weight: bold;
		color: #4a2c10;
		img {
			width: 16px;
			height: 16px;
		}
	}
	.pick-desc {
		margin-top: 6px;
		font-size: 12px;
		line-height: 1.4;
		color: #5a3413;
		min-height: 34px;
	}

	.pick-foot {
		flex: none;
		display: flex;
		justify-content: center;
		padding-bottom: 6px;
	}

	.pick-btn {
		padding: 10px 26px;
		font-size: 16px;
		border-radius: 8px;
		cursor: pointer;
		white-space: nowrap;
		transition: transform 0.12s, background 0.12s;
		&.ghost {
			color: #e6d3a3;
			background: #4a2c10;
			border: 2px solid #8a5326;
			&:hover {
				background: #5f3814;
				transform: translateY(-1px);
			}
		}
		&.primary {
			min-width: 220px;
			padding: 12px 34px;
			font-size: 18px;
			font-weight: bold;
			color: #173d06;
			background: linear-gradient(#b6e86a, #6fd12b);
			border: 2px solid #4a2c10;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
			&:hover:not(:disabled) {
				transform: translateY(-1px);
				box-shadow: 0 6px 14px rgba(0, 0, 0, 0.45);
			}
			&:disabled {
				filter: grayscale(1) brightness(0.7);
				cursor: not-allowed;
			}
		}
	}
}
</style>
