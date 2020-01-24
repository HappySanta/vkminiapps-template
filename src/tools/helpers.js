import React from 'react'
import VkSdk from "@happysanta/vk-apps-sdk"
import {DEFAULT_SCROLL_SPEED} from "../containers/DesktopContainer/DesktopContainer"
import {Link} from "@happysanta/vk-app-ui"
import {Link as UILink} from "@vkontakte/vkui"

export function isDevEnv() {
	return process.env.NODE_ENV === 'development'
}

export function devErrorLog(e) {
	if (isDevEnv()) {
		console.error(e)
	}
}

export function devLog(any) {
	if (isDevEnv()) {
		console.log(any)
	}
}

export function throwDevError(error) {
	if (isDevEnv()) {
		throw error
	}
}

export function isRetina() {
	return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3)) ||
		(((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent))
}

function parseLink(text, pref, cfg = {}) {
	const regexp = /(\[[a-zA-Z@:/.0-9\-_?=&#]+\|.*?\]|<.*?>)/gmu
	let parts = text.split(regexp)
	if (parts.length === 1) {
		return parts[0]
	}
	let res = []
	parts.forEach((t, i) => {
		if (t.indexOf('[') === 0 && !cfg['noLink']) {
			let tag = t.split('|')
			let href = tag[0].replace('[', '')
			let text = tag[1].replace(']', '')
			if (VkSdk.getStartParams().isMobile()) {
				res.push(<UILink href={href} rel="noopener noreferrer" target="_blank" key={pref + '_' + i}>{text}</UILink>)
			} else {
				res.push(<Link href={href} rel="noopener noreferrer" target="_blank" key={pref + '_' + i}>{text}</Link>)
			}
		} else {
			res.push(t)
		}
	})
	return res
}

export function nToBr(string, cfg = {}) {
	string = string || ""
	if (!cfg['noTypography']) {
		string = string.replace(/&shy;/g, "\u00AD")
		string = string.replace(/&nbsp;/g, "\u00A0")
		string = string.replace(/&#8209;/g, "\u2011")
	}
	let stringArray = string.split('\n')
	let length = stringArray.length
	let result = []
	for (let i = 0; i < length; i++) {
		result.push(parseLink(stringArray[i], i, cfg))
		if (i !== length - 1) {
			result.push(<br key={i}/>)
		}
	}
	return result
}

export function getAndroidVersion() {
	let ua = (window.navigator.userAgent).toLowerCase()
	// eslint-disable-next-line
	let match = ua.match(/android\s([0-9\.]*)/)
	if (ua.indexOf('chrome/6') !== -1) {
		return false
	}
	return match ? parseInt(match[1], 10) : false
}

export function getIosVersion() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
		return parseInt(v[1], 10)
	} else {
		return false
	}
}

export function isDeviceSupported() {
	return !(getAndroidVersion() && getAndroidVersion() <= 4) || (getIosVersion() && getIosVersion() <= 8)
}

export function hasLength(item) {
	return item && item.length
}

export function scrollDesktopToPopupHeader(speed = DEFAULT_SCROLL_SPEED) {
	if (VkSdk.getStartParams().isMobile()) {
		return
	}
	let popup = document.querySelector('.PopupDesktop__window')
	if (!popup) {
		return
	}
	let rect = popup.getBoundingClientRect()
	if (!rect || !rect.top) {
		return
	}
	let scrollPosition = rect.top
	VkSdk.scroll(scrollPosition, speed).then().catch()
}

/**
 * @param timer
 * @param args
 * @return {Promise<any>}
 */
export function delay(timer, args = []) {
	return new Promise(resolve => setTimeout(resolve, timer, args))
}

export function preventBlinkingBecauseOfScroll() {
	let startParams = VkSdk.getStartParams()
	if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto' && startParams.isMobile()) {
		window.history.scrollRestoration = 'manual'
	}
}
