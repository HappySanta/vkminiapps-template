import 'core-js/features/map'
import 'core-js/features/set'
import 'core-js/features/promise'
import 'core-js/features/symbol'
import 'core-js/features/object'
import React from "react"
import mount from "./tools/mount"
import VkSdk from "@happysanta/vk-apps-sdk"
import store from "./store"
import history from "./routing/history"
import {Provider} from "react-redux"
import MobileContainer from "./containers/MobileContainer/MobileContainer"
import L from "./lang/L"
import "./style/index.css"
import ErrorMobile from "./components/ErrorMobile/ErrorMobile"
// import registerServiceWorker from "./registerServiceWorker"
import {ConfigProvider} from "@vkontakte/vkui"
import {Router, Route, generatePath} from "react-router-dom"
import {handleLocation, HISTORY_ACTION_PUSH} from "./modules/LocationModule"
import {isDevEnv} from "./tools/helpers"
import {Route as MyRoute} from "./routing/Route"
import DesktopContainer from "./containers/DesktopContainer/DesktopContainer"

export function pushPage(pageId, params = {}, search = '') {
	let nextRoute = MyRoute.fromPageId(pageId, params)
	let currentRoute = MyRoute.fromLocation(history.location.pathname)
	if (nextRoute.isPopup()) {
		if (currentRoute.isPopup() && !VkSdk.getStartParams().isMobile()) {
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
}

export function popPage() {
	history.goBack()
}

export function replacePage(pageId, params = {}, search = '') {
	let nextRoute = MyRoute.fromPageId(pageId, params)
	if (nextRoute.isPopup()) {
		let previousRoute = MyRoute.fromLocation(history.location.pathname)
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

VkSdk.init()
/**
 * @type {VkStartParams}
 */
let startParams = VkSdk.getStartParams()
window._hsMobileUI = startParams.isMobile()
L.init(startParams.getLangCode()).then(() => {
	history.listen((location, action) => {
		store.dispatch(handleLocation(location.pathname, action, location.state))
	})
	store.dispatch(handleLocation(history.location.pathname, HISTORY_ACTION_PUSH, history.location.state, true))
	mount(<Provider store={store}>
		<ConfigProvider isWebView={isDevEnv() ? true : undefined}>
			<Router history={history}>
				<Route component={(props) =>
					startParams.isMobile() ? <MobileContainer {...props}/> : <DesktopContainer {...props}/>
				}/>
			</Router>
		</ConfigProvider>
	</Provider>)
}).catch(e => {
	mount(<ErrorMobile error={e}/>)
})

// registerServiceWorker()
