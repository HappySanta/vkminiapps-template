import {goBack, push, replace} from "connected-react-router"
import {bootstrap, setBootstrap} from "./BootstrapModule"
import { matchPath, generatePath } from 'react-router'
const SET_PARAMS = 'PageModule.SET_PARAMS'

export const ROOT_MAIN = 'root_main'
export const VIEW_MAIN = 'view_main'
export const PANEL_MAIN = 'panel_main'
export const PANEL_ENTITY = 'panel_entity'
export const PANEL_NEW = 'panel_new'

export const PAGE_MAIN = '/'
export const PAGE_ENTITY = '/:entityId([0-9]+)'
export const PAGE_NOT_FOUND = '/404'
export const PAGE_NEW = '/new'

const initState = {
	params: {},
	path: [],
}

export class PageStructure {

	panelId
	viewId
	rootId
	isPopup

	constructor(panelId, viewId = VIEW_MAIN, rootId = ROOT_MAIN, isPopup = false) {
		this.panelId = panelId
		this.viewId = viewId
		this.rootId = rootId
		this.isPopup = isPopup
	}

	static getMap() {
		let map = {}
		//порядок важен
		map[PAGE_NEW] = new PageStructure(PANEL_NEW)
		map[PAGE_ENTITY] = new PageStructure(PANEL_ENTITY)
		map[PAGE_MAIN] = new PageStructure(PANEL_MAIN)
		return map
	}
}

export class Route {

	/**
	 * @type {PageStructure}
	 */
	structure
	location = PAGE_NOT_FOUND
	pageId = PAGE_NOT_FOUND

	static fromLocation(location) {
		let route = new Route()
		let match = null
		Object.keys(PageStructure.getMap()).some(pageId => {
			match = matchPath(location, pageId)
			return !!match
		})
		if (!match || (match && !match.isExact)) {
			return route
		}
		route.location = location
		route.pageId = match.path
		route.structure = PageStructure.getMap()[route.pageId]
		return route
	}

	static fromPageId(pageId, params) {
		let route = new Route()
		route.location = generatePath(pageId, params)
		route.pageId = pageId
		route.structure = PageStructure.getMap()[pageId]
		return route
	}

	getLocation() {
		return this.location
	}

	getPageId() {
		return this.pageId
	}

	getPanelId() {
		return this.structure.panelId
	}

	getViewId() {
		return this.structure.viewId
	}

	getRootId() {
		return this.structure.rootId
	}
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
