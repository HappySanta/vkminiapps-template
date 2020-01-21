import {isDevEnv} from "../tools/helpers"

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

export function getOnErrorClose(fatal, removeFatal) {
	if (isDevEnv() || (fatal && (fatal.network || fatal.on_retry))) {
		return removeFatal
	}
	return false
}

export default FatalErrorModule
