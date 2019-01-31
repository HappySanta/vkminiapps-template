import {goBack, push, replace} from "connected-react-router"
import {bootstrap, setBootstrap} from "./BootstrapModule"
import {Route} from "../routing/Route"
const SET_PARAMS = 'PageModule.SET_PARAMS'

const initState = {
	params: {},
}

const PageModule = (state = initState, action) => {
	switch (action.type) {
		case SET_PARAMS:
			return {...state, params: action.params}
		default:
			return state
	}
}

export function pushPage(pageId, params = undefined) {
	return dispatch => {
		dispatch(handlePageParams(params))
		let route = Route.fromPageId(pageId, params)
		dispatch(push(route.getLocation()))
	}
}

export function popPage() {
	return goBack()
}

export function replacePage(pageId, params) {
	return dispatch => {
		dispatch(handlePageParams(params))
		let route = Route.fromPageId(pageId, params)
		return replace(route.getLocation())
	}
}

export function handlePageParams(params) {
	return (dispatch, getState) => {
		let currentParams = getState().PageModule.params
		if (params) {
			dispatch(setPageParams(params))
		} else if (!params && Object.keys(currentParams).length) {
			dispatch(setPageParams({}))
		}
	}
}

export function subscribeToHistory(history) {
    return (dispatch) => {
        history.listen((location) => {
        	dispatch(handleLocation(location.pathname))
        })
    }
}

export function handleLocation(pathname) {
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

export function setPageParams(params) {
	return {type:SET_PARAMS, params}
}

export default PageModule
