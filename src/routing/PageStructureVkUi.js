import {PANEL_MAIN, ROOT_MAIN, VIEW_MAIN} from "./routes"
import {PageStructure} from "./PageStructure"

export class PageStructureVkUi extends PageStructure {

	panelId
	viewId
	rootId

	constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN, rootId = ROOT_MAIN, popup = false) {
		super()
		this.panelId = panelId
		this.viewId = viewId
		this.rootId = rootId
		this.isModal = popup
	}
}
