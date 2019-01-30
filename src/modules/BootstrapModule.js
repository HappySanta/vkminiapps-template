export const SET_BOOTSTRAP = 'BootstrapModule.SET_BOOTSTRAP'

const initState = {
	loaded: false,
}

const BootstrapModule = (state = initState, action) => {
	switch (action.type) {
		case SET_BOOTSTRAP:
			return Object.assign({}, state, action.update)
		default:
			return state
	}
}

export function setBootstrap(update) {
	return {type: SET_BOOTSTRAP, update}
}

export function bootstrap(onSuccess) {
	return (dispatch, getState) => {
		let {loaded} = getState().BootstrapModule
		if (loaded) {
			onSuccess()
			return
		}
		setTimeout(() => {
            onSuccess()
        }, 2000)
		/*Backend.request('bootstrap', {}).then(r => {
			onSuccess(r)
		}).catch(e => {
			dispatch(setFatalError(e))
		})*/
	}
}

export default BootstrapModule
