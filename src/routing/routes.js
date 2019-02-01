import {PageStructureVkUi} from "./PageStructureVkUi"

export const ROOT_MAIN = 'root_main'

export const VIEW_MAIN = 'view_main'
export const VIEW_ENTITY = 'view_entity'

export const PANEL_MAIN = 'panel_main'
export const PANEL_NEXT = 'panel_next'
export const PANEL_ENTITY = 'panel_entity'
export const PANEL_ENTITY_NEXT = 'panel_entity_next'

export const PAGE_MAIN = '/'
export const PAGE_NEXT = '/next'
export const PAGE_ENTITY = '/:entityId([0-9]+)'
export const PAGE_ENTITY_NEXT = '/:entityId([0-9]+)/next'
export const PAGE_POPUP = '/:entityId([0-9]+)/next/:myId([0-9]+)'

export default {
	[PAGE_MAIN]: new PageStructureVkUi(),
	[PAGE_NEXT]: new PageStructureVkUi(PANEL_NEXT),
	[PAGE_ENTITY]: new PageStructureVkUi(PANEL_ENTITY, VIEW_ENTITY),
	[PAGE_ENTITY_NEXT]: new PageStructureVkUi(PANEL_ENTITY_NEXT, VIEW_ENTITY),
	[PAGE_POPUP]: new PageStructureVkUi(PANEL_ENTITY_NEXT, VIEW_ENTITY, ROOT_MAIN, true),
}
