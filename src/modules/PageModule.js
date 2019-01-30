import {goBack, push, replace} from "connected-react-router"
import {bootstrap, setBootstrap} from "./BootstrapModule"
const SET_PARAMS = 'PageModule.SET_PARAMS'

export const VIEW_MAIN = 'view_main'

export const PAGE_MAIN = '/'
export const PAGE_NEXT = '/next'

const initState = {
	params: {}
}

export class Route {

	panelId = ''

	static fromRaw(panelId) {
		let route = new Route()
		route.panelId = panelId
		return route
	}

	getView() {
		let view = getPanelViewMap()[this.panelId]
		return view ? view : VIEW_MAIN
	}
}

function getPanelViewMap() {
	let map = {}
	map[PAGE_MAIN] = VIEW_MAIN
	map[PAGE_NEXT] = VIEW_MAIN
	return map
}

const PageModule = (state = initState, action) => {
	switch (action.type) {
		case SET_PARAMS:
			return {...state, params: action.params}
		default:
			return state
	}
}

export function pushPage(name, params = undefined) {
	return (dispatch, getState) => {
		let currentParams = getState().PageModule.params
		if (params) {
			dispatch(setPageParams(params))
		} else if (!params && Object.keys(currentParams).length) {
			dispatch(setPageParams({}))
		}
		dispatch(push(name))
	}
}

export function popPage() {
	return goBack()
}

export function replacePage(name) {
	return replace(name)
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
		let route = getRouteByPath(pathname)
		const resolve = () => {
			switch (route.panelId) {
				default:
			}
			dispatch(setBootstrap({loaded: true}))
		}
		dispatch(bootstrap(resolve))
	}
}

export function getPathByPanelId(panelId) {
	return panelId
}

export function getRouteByPath(path) {
	return Route.fromRaw(path)
}

export function setPageParams(params) {
	return {type:SET_PARAMS, params}
}

export default PageModule
