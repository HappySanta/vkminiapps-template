import {generatePath, matchPath} from "react-router-dom"
import routes, {PAGE_MAIN, PANEL_MAIN, ROOT_MAIN, VIEW_MAIN} from "./routes"
import {PageStructureVkUi} from "./PageStructureVkUi"

export class Route {

	/**
	 * @type {PageStructure}
	 */
	structure
	location
	pageId
	params
	popupId

	static fromLocation(location, state, search) {
		let route = new Route()
		route.location = location
		route.search = search
		route.params = {}
		let match = null
		Object.keys(routes).some(pageId => {
			match = matchPath(location, pageId)
			return !!match && match.isExact
		})
		if (!match || (match && !match.isExact)) {
			return route
		}
		route.params = match.params
		route.pageId = match.path
		if (routes[route.pageId].isPopup && state && state.previousRoute) {
			if (routes[route.pageId] instanceof PageStructureVkUi) {
				route.structure = new PageStructureVkUi(
					state.previousRoute.getPanelId(),
					state.previousRoute.getViewId(),
					state.previousRoute.getRootId(),
					true,
				)
				route.popupId = match.path
				route.pageId = state.previousRoute.pageId
			} else {
				route.pageId = state.previousRoute.pageId
				route.popupId = match.path
				route.structure = routes[match.path]
			}
		} else {
			route.structure = routes[route.pageId]
			if (route.isPopup()) {
				route.popupId = match.path
			}
		}
		return route
	}

	static fromPageId(pageId, params, search) {
		let route = new Route()
		route.location = generatePath(pageId, params)
		route.pageId = pageId
		route.structure = routes[pageId]
		route.params = params
		route.search = search
		return route
	}

	getLocation() {
		return this.location
	}

	getPageId() {
		if (!this.pageId) {
			return PAGE_MAIN
		}
		return this.pageId
	}

	getPanelId() {
		if (this.structure instanceof PageStructureVkUi) {
			return this.structure.panelId
		}
		return PANEL_MAIN
	}

	getViewId() {
		if (this.structure instanceof PageStructureVkUi) {
			return this.structure.viewId
		}
		return VIEW_MAIN
	}

	getRootId() {
		if (this.structure instanceof PageStructureVkUi) {
			return this.structure.rootId
		}
		return ROOT_MAIN
	}

	isPopup() {
		if (this.structure) {
			return this.structure.isPopup
		}
		return false
	}

	getParams() {
		return this.params
	}

	getPopupId() {
		return this.popupId
	}
}
