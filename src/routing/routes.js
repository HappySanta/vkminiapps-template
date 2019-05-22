import {PageStructureVkUi} from "./PageStructureVkUi"
import VkSdk from "@happysanta/vk-apps-sdk"
import {PageStructure} from "./PageStructure"

export const ROOT_MAIN = 'root_main'

export const VIEW_MAIN = 'view_main'

export const PANEL_MAIN = 'panel_main'
export const PANEL_ENTITY = 'panel_entity'

export const PAGE_MAIN = '/'
export const PAGE_ENTITY = '/:entityId([0-9]+)'
export const PAGE_POPUP = '/:entityId([0-9]+)/popup'

let routes =  {
	[PAGE_MAIN]: new PageStructureVkUi(),
	[PAGE_ENTITY]: new PageStructureVkUi(PANEL_ENTITY, VIEW_MAIN),
	[PAGE_POPUP]: new PageStructureVkUi(PANEL_ENTITY, VIEW_MAIN, ROOT_MAIN, true),
}

if (!VkSdk.getStartParams().isMobile()) {
	routes[PAGE_POPUP] = new PageStructure(true)
}

export default routes
