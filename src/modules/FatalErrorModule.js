import {isDevEnv, nToBr} from "../tools/helpers"
import L from "../lang/L"
import VkSdk from "@happysanta/vk-apps-sdk"

const SET_ERROR = "FatalError.SET_ERROR"
const REMOVE_ERROR = "FatalError.REMOVE_ERROR"

const FatalErrorModule = (state = false, action) => {
	switch (action.type) {
		case SET_ERROR:
			return Object.assign(action.error, {on_retry: action.on_retry, prevent_close: action.prevent_close})
		case REMOVE_ERROR:
			return false
		default:
			return state
	}
}

export function setFatalError(error, on_retry, prevent_close = false) {
	return dispatch => {
		dispatch({type: SET_ERROR, error, on_retry, prevent_close})
	}
}

export function removeFatalError() {
	return dispatch => {
		dispatch({type: REMOVE_ERROR})
	}
}

export function getOnErrorClose(error, removeError) {
	if (isDevEnv() || (error && (error.network || error.on_retry))) {
		return removeError
	}
	return false
}

export function getErrorHeader(error) {
	let e = error || {}
	return e.code ? e.code : L.t('error')
}

export function getTextErrorDetails(error) {
	let text = ''
	let e = error || {}
	if (e.message) {
		if (e.message instanceof Object) {
			text = JSON.stringify(e.message, null, 2)
			text += "\n"
		} else {
			text += e.message || ''
			text += "\n"
		}
	}
	if (e.code) {
		text += e.code || ''
		text += "\n"
	}
	if (e.stack) {
		text += e.stack
		text += "\n"
	}
	if (text === '') {
		try {
			text = JSON.stringify(e, null, 2)
		} catch (e) {
			text = "Empty text and cant't json stringify"
		}
	}
	text = window.navigator.userAgent + "\n\n" + text
	text = `user_id:  ${VkSdk.getStartParams().userId} \n\n${text}`
	return nToBr(text)
}

export function isNetwork(error) {
	let e = error || {}
	return !!e.network
}

export function onRetry(error, onClose) {
	return dispatch => {
		if (error.on_retry) {
			error.on_retry()
		}
		if (typeof onClose === "function") {
			dispatch(onClose())
		}
	}
}

export default FatalErrorModule
