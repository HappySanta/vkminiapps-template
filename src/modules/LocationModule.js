import {Route} from "../routing/Route"
import {bootstrap, setBootstrap} from "./BootstrapModule"

const initState = {
	viewHistory: {}
}

const LocationModule = (state = initState, action) => {
	switch (action.type) {
		default:
			return state
	}
}

export function handleLocation(pathname, action) {
	return (dispatch) => {
		let route = Route.fromLocation(pathname)
		const resolve = () => {
			switch (route.getPageId()) {
				default:
			}
			dispatch(setBootstrap({loaded: true}))
		}
		dispatch(bootstrap(resolve))
	}
}

export default LocationModule
