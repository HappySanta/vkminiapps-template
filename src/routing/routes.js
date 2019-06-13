import {PageStructureVkUi} from "./PageStructureVkUi"
import VkSdk from "@happysanta/vk-apps-sdk"
import {PageStructure} from "./PageStructure"

export const ROOT_MAIN = 'root_main'

export const VIEW_MAIN = 'view_main'
export const VIEW_2 = 'view_2'
export const VIEW_3 = 'view_3'

export const PANEL_MAIN = 'panel_main'
export const PANEL_ENTITY = 'panel_entity'

export const PANEL_2_1 = 'panel_2'
export const PANEL_2_2 = 'panel_2_2'

export const PANEL_3_1 = 'panel_3'
export const PANEL_3_2 = 'panel_3_2'

export const PAGE_MAIN = '/'
export const PAGE_ENTITY = '/:entityId([0-9]+)'
export const PAGE_POPUP = '/:entityId([0-9]+)/popup'
export const PAGE_2_1 = '/page_2_1'
export const PAGE_2_2 = '/page_2_2'
export const PAGE_3_1 = '/page_3_1'
export const PAGE_3_2 = '/page_3_2'

let routes =  {
	[PAGE_MAIN]: new PageStructureVkUi(),
	[PAGE_ENTITY]: new PageStructureVkUi(PANEL_ENTITY, VIEW_MAIN),
	[PAGE_POPUP]: new PageStructureVkUi(PANEL_ENTITY, VIEW_MAIN, ROOT_MAIN, true),

	[PAGE_2_1]: new PageStructureVkUi(PANEL_2_1, VIEW_2),
	[PAGE_2_2]: new PageStructureVkUi(PANEL_2_2, VIEW_2),

	[PAGE_3_1]: new PageStructureVkUi(PANEL_3_1, VIEW_3),
	[PAGE_3_2]: new PageStructureVkUi(PANEL_3_2, VIEW_3),
}

if (!VkSdk.getStartParams().isMobile()) {
	routes[PAGE_POPUP] = new PageStructure(true)
}

export default routes
