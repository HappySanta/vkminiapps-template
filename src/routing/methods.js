import {Route as MyRoute} from "./Route"
import history from "./history"
import VkSdk from "@happysanta/vk-apps-sdk"
import {generatePath} from "react-router-dom"
import {devLog} from "../tools/helpers"
import {getLastRoute} from "../modules/LocationModule"

const ANIM_TIME = 500

let list = []

function pop() {
	if (list.length === 0) return
	let [fn, args] = list.shift()
	if (fn) {
		fn(...args)
		reset()
	}
}

function push(fn, ...args) {
	list.push([fn, args])
	reset()
}

let timer = null

function reset() {
	clearTimeout(timer)
	timer = setTimeout(pop, ANIM_TIME)
}


let time = 0

function lock() {
	time = Date.now()
}


function isLock() {
	/*
	 * Почему тут для десктопа задежка 10мс?
	 * Потому что может быть случай когда два изменения history api могут перепутаться
	 */
	if (Date.now() - time < (VkSdk.getStartParams().isMobile() ? ANIM_TIME : 10)) {
		return true
	} else {
		lock()
		return false
	}
}

export function pushPage(pageId, params = {}, search = '') {
	if (isLock()) {
		return push(pushPage, pageId, params, search)
	}
	devLog("pushPage " + pageId, {params, search})
	let nextRoute = MyRoute.fromPageId(pageId, params, search)
	let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
	if (nextRoute.isModal()) {
		if (currentRoute.isModal() && !VkSdk.getStartParams().isMobile()) {
			replacePage(pageId, params)
			return
		}
		params = {...params, previousRoute: currentRoute}
	}
	history.push({
		pathname: nextRoute.getLocation(),
		state: params,
		search: search,
	})
	preventBlinkingBySettingScrollRestoration()
}

export function pushModal(modalId) {
	if (isLock()) {
		return push(pushModal, modalId)
	}
	devLog("pushModal " + modalId)
	let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
	currentRoute.search = 'w=' + modalId
	history.push({
		pathname: currentRoute.getLocation(),
		state: currentRoute.params,
		search: currentRoute.search,
	})
	preventBlinkingBySettingScrollRestoration()
}

export function replaceModal(modalId) {
	if (isLock()) {
		return push(replaceModal, modalId)
	}
	devLog("replaceModal " + modalId)
	let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
	currentRoute.search = 'w=' + modalId
	history.replace({
		pathname: currentRoute.getLocation(),
		state: currentRoute.params,
		search: currentRoute.search,
	})
	preventBlinkingBySettingScrollRestoration()
}

export function popPage() {
	if (isLock()) {
		return push(popPage, 1, 2)
	}
	if (VkSdk.getStartParams().isMobile()) {
		devLog("popPage")
		history.goBack()
	} else {
		let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
		if (currentRoute.getActiveModal()) {
			currentRoute.search = ''
			history.push({
				pathname: currentRoute.getLocation(),
				state: currentRoute.params,
				search: currentRoute.search,
			})
		} else {
			const route = getLastRoute()
			if (route && route.pageId) {
				history.push({
					pathname: route.getLocation(),
					state: route.params,
					search: route.search,
				})
			} else {
				history.goBack()
			}
		}
	}
	preventBlinkingBySettingScrollRestoration()
}

export function popPageIfModal() {
	if (isLock()) {
		return push(popPageIfModal, 1, 2)
	}
	if (VkSdk.getStartParams().isMobile()) {
		let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
		if (currentRoute.getActiveModal()) {
			devLog("popPageIfModal")
			history.goBack()
		} else {
			devLog("popPageIfModal NO: " + currentRoute.getActiveModal())
		}
	} else {
		let currentRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
		if (currentRoute.getActiveModal()) {
			devLog("popPageIfModal")
			currentRoute.search = ''
			history.push({
				pathname: currentRoute.getLocation(),
				state: currentRoute.params,
				search: currentRoute.search,
			})
		} else {
			devLog("popPageIfModal NO: " + currentRoute.getActiveModal())
		}
	}
}

export function replacePage(pageId, params = {}, search = '') {
	if (isLock()) {
		return push(replacePage, pageId, params, search)
	}
	devLog("replacePage " + pageId, {params, search})
	let nextRoute = MyRoute.fromPageId(pageId, params, search)
	if (nextRoute.isModal()) {
		let previousRoute = MyRoute.fromLocation(history.location.pathname, history.location.state, history.location.search)
		if (params.pageId) {
			previousRoute.pageId = params.pageId
			delete params.pageId
		}
		params = {...params, previousRoute: previousRoute}
	}
	history.replace({
		pathname: generatePath(pageId, params),
		state: params,
		search: search,
	})
}

export function preventBlinkingBySettingScrollRestoration() {
	let startParams = VkSdk.getStartParams()
	if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto' && startParams.isMobile()) {
		window.history.scrollRestoration = 'manual'
	}
}
