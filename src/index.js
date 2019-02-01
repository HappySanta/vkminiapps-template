import React from "react"
import mount from "./tools/mount"
import VkSdk from "@happysanta/vk-apps-sdk"
import store from "./store"
import history from "./routing/history"
import {Provider} from "react-redux"
import MobileContainer from "./containers/MobileContainer/MobileContainer"
import L from "./lang/L"
import "./style/index.css"
import Error from "./components/Error/Error"
import registerServiceWorker from "./registerServiceWorker"
import * as VkConnect from "@vkontakte/vkui-connect/index"
import {ConfigProvider} from "@vkontakte/vkui"
import {Router, Route, generatePath} from "react-router-dom"
import {handleLocation} from "./modules/LocationModule"
import {isDevEnv} from "./tools/helpers"

VkConnect.send("VKWebAppInit", {})

export function pushPage(pageId, params = {}, search = '') {
	history.push({
		pathname: generatePath(pageId, params),
		state: params,
		search: search,
	})
}

export function popPage() {
	history.goBack()
}

export function replacePage(pageId, params, search = '') {
	history.replace({
		pathname: generatePath(pageId, params = {}),
		state: params,
		search: search,
	})
}

/**
 * @type {VkStartParams}
 */
let startParams = VkSdk.getStartParams()
L.init(startParams.getLangCode()).then(() => {
	history.listen((location, action) => {
		store.dispatch(handleLocation(location.pathname, action))
	})
	store.dispatch(handleLocation(history.location.pathname))
	handleLocation(history.location.pathname)
	mount(<Provider store={store}>
		<ConfigProvider isWebView={isDevEnv() ? true : undefined}>
			<Router history={history}>
				<Route component={(props) => <MobileContainer {...props}/>}/>
			</Router>
		</ConfigProvider>
	</Provider>)
}).catch(e => {
	mount(<Error error={e}/>)
})

registerServiceWorker()
