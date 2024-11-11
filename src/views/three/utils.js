export async function playAction(action, duration = 1) {
	action.play()
	let time = duration * 1000
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(duration)
			// console.log(action)
		}, time)
	})
}
// await playAction({duration: 1})
// await playAction({duration: 2})
// await playAction({duration: 3})