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
import FatalErrorMobile from "./components/FatalErrorMobile/FatalErrorMobile"
import {ConfigProvider} from "@vkontakte/vkui"
import {Route, Router} from "react-router-dom"
import {handleLocation, HISTORY_ACTION_PUSH} from "./modules/LocationModule"
import {delay, isDevEnv} from "./tools/helpers"
import DesktopContainer from "./containers/DesktopContainer/DesktopContainer"
import "./style/index.css"
import FatalErrorDesktop from "./components/FatalErrorDesktop/FatalErrorDesktop"

VkSdk.init()
let startParams = VkSdk.getStartParams()
window._hsMobileUI = startParams.isMobile()
L.init(startParams.getLangCode())
	.then(async () => {
		//Если window.innerHeight будет 0 то у нас все сломается
		//ждем пока тут будет норм высота
		let i = 0
		while (window.innerHeight <= 0 && i++ < 100) {
			await delay(50)
		}
	})
	.then(() => {
		history.listen((location, action) => {
			store.dispatch(handleLocation(location, action, false))
		})
		store.dispatch(handleLocation(history.location, HISTORY_ACTION_PUSH, true))
		mount(<Provider store={store}>
			<ConfigProvider webviewType="vkapps" isWebView={isDevEnv() ? true : undefined}>
				<Router history={history}>
					<Route component={(props) =>
						startParams.isMobile() ? <MobileContainer {...props}/> : <DesktopContainer {...props}/>
					}/>
				</Router>
			</ConfigProvider>
		</Provider>)
	})
	.catch(e => {
		mount(<Provider store={store}>
			{VkSdk.getStartParams().isMobile() ? <FatalErrorMobile error={e}/> : <FatalErrorDesktop error={e}/>}
		</Provider>)
	})
