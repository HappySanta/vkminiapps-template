import {Route} from "../routing/Route"
import routes, {PAGE_MAIN} from "../routing/routes"
import {PageStructureVkUi} from "../routing/PageStructureVkUi"
import {replacePage} from "../index"

const SET_LOCATION_MODULE = "LocationModule.SET_LOCATION_MODULE"
const PUSH_VIEW_HISTORY = "LocationModule.PUSH_VIEW_HISTORY"
const POP_VIEW_HISTORY = "LocationModule.POP_VIEW_HISTORY"

export const HISTORY_ACTION_PUSH = "PUSH"
export const HISTORY_ACTION_POP = "POP"
export const HISTORY_ACTION_REPLACE = "REPLACE"

function getInitialViewHistory() {
	let viewHistory = {}
	Object.keys(routes).forEach(pageId => {
		let viewId = routes[pageId].viewId
		if (viewId && !viewHistory.hasOwnProperty(viewId)) {
			viewHistory[viewId] = []
		}
	})
	return viewHistory
}

function getInitialViewsPanels() {
	let viewsPanels = {};

	Object.keys(routes).forEach(pageId => {
		let viewId = routes[pageId].viewId,
			panelId = routes[pageId].panelId;

		if (viewId) {
			if (!viewsPanels.hasOwnProperty(viewId)) {
				viewsPanels[viewId] = []
			}
			if (panelId && !~viewsPanels[viewId].indexOf(panelId)) {
				viewsPanels[viewId] = [...viewsPanels[viewId], routes[pageId].panelId]
			}
		}
	});

	return viewsPanels
}

const initState = {
	viewHistory: getInitialViewHistory(),
	viewsPanels: getInitialViewsPanels(),
	currentViewId: null,
}

const LocationModule = (state = initState, action) => {
	switch (action.type) {
		case SET_LOCATION_MODULE:
			return Object.assign({}, state, action.update)
		case PUSH_VIEW_HISTORY:
			return {...state, viewHistory: {
				...state.viewHistory, [action.viewId]: state.viewHistory[action.viewId].concat([action.paneId])}}
		case POP_VIEW_HISTORY:
			return {...state, viewHistory: {
				...state.viewHistory, [action.viewId]: state.viewHistory[action.viewId].slice(0, -1)}}
		default:
			return state
	}
}

function setLocationModule(update) {
	return {type: SET_LOCATION_MODULE, update}
}

function setCurrentViewId(currentViewId) {
	return setLocationModule({currentViewId})
}

/**
 * @param route {Route}
 * @param action - one of: PUSH, POP, REPLACE
 */
function setViewHistory(route, action) {
	return (dispatch, getState) => {
		if (!(route.structure instanceof PageStructureVkUi)) {
			return
		}
		let currentViewId = getState().LocationModule.currentViewId
		switch (action) {
			case HISTORY_ACTION_PUSH:
				dispatch(pushViewHistory(route.getViewId(), route.getPanelId()))
				break
			case HISTORY_ACTION_POP:
				currentViewId ? dispatch(popViewHistory(currentViewId)) : (() => {})()
				break
			case HISTORY_ACTION_REPLACE:
				currentViewId ? dispatch(replaceViewHistory(currentViewId, route.getViewId(), route.getPanelId())) : (() => {})()
				break
			default:
		}
		dispatch(setCurrentViewId(route.getViewId()))
	}
}

function pushViewHistory(viewId, paneId) {
	return {type: PUSH_VIEW_HISTORY, viewId, paneId}
}

function popViewHistory(viewId) {
	return {type: POP_VIEW_HISTORY, viewId}
}

function replaceViewHistory(currentViewId, nextViewId, nextPaneId) {
	return dispatch => {
		dispatch(popViewHistory(currentViewId))
		dispatch(pushViewHistory(nextViewId, nextPaneId))
	}
}

export function handleLocation(pathname, action, state, isInitial = false) {
	return (dispatch) => {
		let route = Route.fromLocation(pathname)
		if (isInitial && route.isPopup()) {
			replacePage(PAGE_MAIN)
			return
		}
		dispatch(setViewHistory(route, action))
		const handlePageData = (pageId) => {
			//тут можно в зависимости от страницы подгрузить нужные данные
		}
		handlePageData(route.getPageId())
	}
}

export default LocationModule
