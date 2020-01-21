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
		route.structure = routes[route.pageId]
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

	isModal() {
		return this.getActiveModal() !== null
	}

	getParams() {
		return this.params
	}

	getPopupId() {
		return this.popupId
	}

	getActiveModal() {
		if (this.search) {
			const modal = this.search.toString().match('w=([A-z0-9_-]+)')
			if (modal) {
				return modal[1]
			}
		}
		return null
	}
}
