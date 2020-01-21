import {Route} from "../routing/Route"
import routes, {PAGE_MAIN} from "../routing/routes"
import {PageStructureVkUi} from "../routing/PageStructureVkUi"
import {replacePage} from "../routing/methods"

const SET_LOCATION_MODULE = "LocationModule.SET_LOCATION_MODULE"
const PUSH_VIEW_HISTORY = "LocationModule.PUSH_VIEW_HISTORY"
const POP_VIEW_HISTORY = "LocationModule.POP_VIEW_HISTORY"
const CLEAR_PREV_PANEL = "LocationModule.CLEAR_PREV_PANEL"

export const HISTORY_ACTION_PUSH = "PUSH"
export const HISTORY_ACTION_POP = "POP"
export const HISTORY_ACTION_REPLACE = "REPLACE"

export const REPEATED_PANEL_ID_MARK = 'panelIndex'

let stack = []

export function getLastRoute() {
	if (stack.length >= 2) {
		return stack[stack.length-2]
	}
	return null
}

export function getCurrentRoute() {
	if (stack.length) {
		return stack[stack.length-1]
	}
	return null
}

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
			return {
				...state,
				[`${action.viewId}_prevPanel`]: undefined,
				viewHistory: {
					...state.viewHistory,
					[action.viewId]: state.viewHistory[action.viewId].concat([action.panelId])
				}
			}
		case POP_VIEW_HISTORY:
			return {
				...state,
				[`${action.viewId}_prevPanel`]: state.viewHistory[action.viewId].slice(-1)[0],
				viewHistory: {...state.viewHistory, [action.viewId]: state.viewHistory[action.viewId].slice(0, -1)}
			}
		case CLEAR_PREV_PANEL:
			return {...state, [`${action.viewId}_prevPanel`]: undefined}
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

export function setPreventViewHistoryPop(preventViewHistoryPop) {
	return setLocationModule({preventViewHistoryPop})
}

/**
 * @param route {Route}
 * @param action - one of: PUSH, POP, REPLACE
 */
function setViewHistory(route, action) {
	return (dispatch, getState) => {
		if (action === HISTORY_ACTION_REPLACE) {
			if (!stack[0]) {
				stack = [route]
			} else {
				stack[0] = route
			}
		} else if (action === HISTORY_ACTION_POP) {
			stack.pop()
		} else if (action === HISTORY_ACTION_PUSH) {
			stack.push(route)
		}
		if (!(route.structure instanceof PageStructureVkUi)) {
			return
		}
		let currentViewId = getState().LocationModule.currentViewId
		switch (action) {
			case HISTORY_ACTION_PUSH:
				dispatch(pushViewHistory(route))
				break
			case HISTORY_ACTION_POP:
				if (getState().LocationModule.preventViewHistoryPop) {
					dispatch(setPreventViewHistoryPop(false))
					return
				}
				currentViewId ? dispatch(popViewHistory(currentViewId)) : (() => {
				})()
				break
			case HISTORY_ACTION_REPLACE:
				currentViewId ? dispatch(replaceViewHistory(currentViewId, route)) : (() => {
				})()
				break
			default:
		}
		dispatch(setCurrentViewId(route.getViewId()))
	}
}

export function clearPrevPanel(viewId) {
	return {type: CLEAR_PREV_PANEL, viewId}
}

function pushViewHistory(route) {
	return (dispatch, getState) => {
		let {viewHistory} = getState().LocationModule
		let panelId = route.getPanelId()
		let viewId = route.getViewId()
		let history = viewHistory[viewId]
		if (route.isModal()) {
			return
		}
		panelId = getHandledRepeatsPanelId(history, panelId, true)
		dispatch({type: PUSH_VIEW_HISTORY, viewId, panelId})
	}
}

export function getHandledRepeatsPanelId(viewHistory, panelId, addIndexToFirst = false) {
	let repeatsCount = 0
	let resultPanelId = panelId
	viewHistory.forEach((viewHistoryPanelId) => {
		if (viewHistoryPanelId.indexOf(panelId) !== -1) {
			if (!addIndexToFirst) {
				if (repeatsCount > 0) {
					resultPanelId = panelId + `_${REPEATED_PANEL_ID_MARK}_${repeatsCount - 1}`
				}
			} else {
				resultPanelId = panelId + `_${REPEATED_PANEL_ID_MARK}_${repeatsCount}`
			}
			repeatsCount++
		}
	})
	return resultPanelId
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

export function handleLocation(location, action, isInitial = false) {
	return (dispatch) => {
		let route = Route.fromLocation(location.pathname)
		if (isInitial && route.isModal()) {
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
